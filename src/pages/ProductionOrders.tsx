import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { OrderStats } from '@/components/production/OrderStats';
import { OrderFilters } from '@/components/production/OrderFilters';
import { OrderTable } from '@/components/production/OrderTable';
import { OrderModal } from '@/components/production/OrderModal';
import { useProductionOrderStore } from '@/lib/productionOrderStore';
import { ProductionOrder, ProductionOrderStatus } from '@/types/productionOrder';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ProductionOrders = () => {
  const { orders, addOrder, updateOrder, deleteOrder } = useProductionOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductionOrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.machine.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  const handleSave = (orderData: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
    } else {
      addOrder(orderData);
    }
  };

  const handleEdit = (order: ProductionOrder) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteOrder(deleteId);
      toast.success('OP excluída com sucesso!');
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    toast.success('Exportação em desenvolvimento');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ordens de Produção</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe todas as ordens de produção
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova OP
          </Button>
        </div>
      </div>

      <OrderStats orders={orders} />

      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      <OrderTable
        orders={filteredOrders}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <OrderModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingOrder={editingOrder}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ordem de produção? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductionOrders;
