import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Download, Trash2, Loader2 } from "lucide-react";
import { CustomerStats } from "@/components/sales/CustomerStats";
import { CustomerFilters } from "@/components/sales/CustomerFilters";
import { CustomerTable } from "@/components/sales/CustomerTable";
import { CustomerModal } from "@/components/sales/CustomerModal";
import { CustomerHistory } from "@/components/sales/CustomerHistory";
import { Customer, CustomerFilters as CustomerFiltersType } from "@/types/customer";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useDeleteCustomers,
  useToggleCustomerStatus,
} from "@/hooks/useCustomers";

const defaultFilters: CustomerFiltersType = {
  search: '',
  category: 'Todos',
  status: 'Todos',
  type: 'Todos',
};

const Customers = () => {
  const { data: customers = [], isLoading, error } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const deleteCustomers = useDeleteCustomers();
  const toggleStatus = useToggleCustomerStatus();

  const [filters, setFiltersState] = useState<CustomerFiltersType>(defaultFilters);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const setFilters = (f: Partial<CustomerFiltersType>) =>
    setFiltersState((prev) => ({ ...prev, ...f }));
  const clearFilters = () => setFiltersState(defaultFilters);
  const toggleCustomerSelection = (id: string) =>
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const selectAllCustomers = (ids: string[]) => setSelectedCustomers(ids);

  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.code.toLowerCase().includes(s) ||
          c.cpfCnpj.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.tradeName?.toLowerCase().includes(s)
      );
    }
    if (filters.category !== 'Todos') result = result.filter((c) => c.category === filters.category);
    if (filters.status !== 'Todos') result = result.filter((c) => c.status === filters.status);
    if (filters.type !== 'Todos') result = result.filter((c) => c.type === filters.type);
    return result;
  }, [customers, filters]);

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };
  const handleEditCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setIsModalOpen(true);
  };
  const handleViewHistory = (c: Customer) => {
    setSelectedCustomer(c);
    setIsHistoryOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };
  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (selectedCustomer) {
        await updateCustomer.mutateAsync({ id: selectedCustomer.id, data });
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await createCustomer.mutateAsync(data);
        toast.success('Cliente criado com sucesso!');
      }
    } catch (e: any) {
      toast.error('Erro ao salvar cliente: ' + (e?.message ?? 'desconhecido'));
    }
  };

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setDeleteConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomer.mutateAsync(customerToDelete);
        toast.success('Cliente excluído com sucesso!');
      } catch (e: any) {
        toast.error('Erro ao excluir: ' + (e?.message ?? ''));
      }
    }
    setDeleteConfirmOpen(false);
    setCustomerToDelete(null);
  };
  const handleDeleteSelected = async () => {
    try {
      await deleteCustomers.mutateAsync(selectedCustomers);
      toast.success(`${selectedCustomers.length} clientes excluídos!`);
      setSelectedCustomers([]);
    } catch (e: any) {
      toast.error('Erro ao excluir: ' + (e?.message ?? ''));
    }
  };
  const handleToggleStatus = async (id: string) => {
    const c = customers.find((x) => x.id === id);
    if (!c) return;
    try {
      await toggleStatus.mutateAsync({ id, current: c.status });
    } catch (e: any) {
      toast.error('Erro ao alterar status: ' + (e?.message ?? ''));
    }
  };

  const handleExportAll = () => {
    const csv = [
      ['Código', 'Nome', 'Tipo', 'CPF/CNPJ', 'Categoria', 'Status', 'Email', 'Telefone'].join(','),
      ...filteredCustomers.map((c) =>
        [c.code, c.name, c.type, c.cpfCnpj, c.category, c.status, c.email, c.phone].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Clientes exportados!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus clientes e acompanhe o relacionamento comercial
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedCustomers.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Excluir ({selectedCustomers.length})
            </Button>
          )}
          <Button variant="outline" onClick={handleExportAll} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={handleNewCustomer} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <CustomerStats customers={filteredCustomers} />

      <CustomerFilters filters={filters} onFilterChange={setFilters} onClearFilters={clearFilters} />

      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando clientes...
        </div>
      ) : error ? (
        <div className="text-center text-destructive h-32 flex items-center justify-center">
          Erro ao carregar clientes: {(error as any)?.message}
        </div>
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          selectedCustomers={selectedCustomers}
          onToggleSelection={toggleCustomerSelection}
          onSelectAll={selectAllCustomers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
          onViewHistory={handleViewHistory}
        />
      )}

      <CustomerModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />

      <CustomerHistory open={isHistoryOpen} onClose={handleCloseHistory} customer={selectedCustomer} />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Customers;
