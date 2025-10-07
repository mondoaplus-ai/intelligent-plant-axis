import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Download, Trash2 } from "lucide-react";
import { useCustomerStore } from "@/lib/customerStore";
import { CustomerStats } from "@/components/sales/CustomerStats";
import { CustomerFilters } from "@/components/sales/CustomerFilters";
import { CustomerTable } from "@/components/sales/CustomerTable";
import { CustomerModal } from "@/components/sales/CustomerModal";
import { CustomerHistory } from "@/components/sales/CustomerHistory";
import { Customer } from "@/types/customer";
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

const Customers = () => {
  const {
    customers,
    filters,
    selectedCustomers,
    setFilters,
    clearFilters,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    deleteCustomers,
    toggleStatus,
    toggleCustomerSelection,
    selectAllCustomers,
    clearSelection,
  } = useCustomerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.code.toLowerCase().includes(searchLower) ||
          customer.cpfCnpj.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.tradeName?.toLowerCase().includes(searchLower)
      );
    }

    // Categoria
    if (filters.category !== 'Todos') {
      result = result.filter((customer) => customer.category === filters.category);
    }

    // Status
    if (filters.status !== 'Todos') {
      result = result.filter((customer) => customer.status === filters.status);
    }

    // Tipo
    if (filters.type !== 'Todos') {
      result = result.filter((customer) => customer.type === filters.type);
    }

    return result;
  }, [customers, filters]);

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleViewHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
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

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete);
      toast.success('Cliente excluído com sucesso!');
    }
    setDeleteConfirmOpen(false);
    setCustomerToDelete(null);
  };

  const handleDeleteSelected = () => {
    deleteCustomers(selectedCustomers);
    toast.success(`${selectedCustomers.length} clientes excluídos com sucesso!`);
  };

  const handleExportAll = () => {
    const csv = [
      ['Código', 'Nome', 'Nome Fantasia', 'Tipo', 'CPF/CNPJ', 'Categoria', 'Status', 'Email', 'Telefone', 'Faturamento Total', 'Ticket Médio'].join(','),
      ...filteredCustomers.map(c => [
        c.code,
        c.name,
        c.tradeName || '',
        c.type,
        c.cpfCnpj,
        c.category,
        c.status,
        c.email,
        c.phone,
        c.totalPurchases,
        c.averageTicket
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success('Clientes exportados com sucesso!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus clientes e acompanhe o relacionamento comercial
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedCustomers.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="gap-2"
            >
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

      {/* Stats */}
      <CustomerStats customers={filteredCustomers} />

      {/* Filters */}
      <CustomerFilters
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Table */}
      <CustomerTable
        customers={filteredCustomers}
        selectedCustomers={selectedCustomers}
        onToggleSelection={toggleCustomerSelection}
        onSelectAll={selectAllCustomers}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteClick}
        onToggleStatus={toggleStatus}
        onViewHistory={handleViewHistory}
      />

      {/* Modal */}
      <CustomerModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />

      {/* History */}
      <CustomerHistory
        open={isHistoryOpen}
        onClose={handleCloseHistory}
        customer={selectedCustomer}
      />

      {/* Delete Confirmation */}
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
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Customers;
