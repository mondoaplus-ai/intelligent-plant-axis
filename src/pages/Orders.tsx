import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderStats } from '@/components/orders/OrderStats';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { OrderTable } from '@/components/orders/OrderTable';
import { OrderModal } from '@/components/orders/OrderModal';
import { useOrders, useCreateOrder, useUpdateOrder, useDeleteOrder } from '@/hooks/useOrders';
import { Order } from '@/types/order';
import { toast } from 'sonner';

export default function Orders() {
  const { data: orders = [], isLoading } = useOrders();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === '' ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [orders, searchTerm, statusFilter, priorityFilter]);

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteOrder(id);
      toast.success('Pedido excluído com sucesso!');
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleNewOrder = () => {
    setSelectedOrder(undefined);
    setModalOpen(true);
  };

  const handleSave = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedOrder) {
      updateOrder(selectedOrder.id, orderData);
      toast.success('Pedido atualizado com sucesso!');
    } else {
      addOrder(orderData);
      toast.success('Pedido criado com sucesso!');
    }
    setSelectedOrder(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento completo de pedidos de vendas
          </p>
        </div>
        <Button onClick={handleNewOrder}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      <OrderStats />

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
        onView={handleView}
      />

      <OrderModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrder(undefined);
        }}
        onSave={handleSave}
        order={selectedOrder}
      />
    </div>
  );
}
