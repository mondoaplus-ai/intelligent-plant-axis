import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderStats } from '@/components/orders/OrderStats';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { OrderTable } from '@/components/orders/OrderTable';
import { useOrderStore } from '@/lib/orderStore';
import { Order } from '@/types/order';
import { toast } from 'sonner';

export default function Orders() {
  const { orders, deleteOrder } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

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
    toast.info('Funcionalidade em desenvolvimento');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteOrder(id);
      toast.success('Pedido excluído com sucesso!');
    }
  };

  const handleView = (order: Order) => {
    toast.info('Funcionalidade em desenvolvimento');
  };

  const handleNewOrder = () => {
    toast.info('Funcionalidade em desenvolvimento');
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
    </div>
  );
}
