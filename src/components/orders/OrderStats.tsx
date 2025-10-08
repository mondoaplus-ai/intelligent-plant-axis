import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { useOrderStore } from '@/lib/orderStore';

export const OrderStats = () => {
  const orders = useOrderStore((state) => state.orders);
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'orcamento' || o.status === 'aprovado').length;
  const completedOrders = orders.filter(o => o.status === 'entregue').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.total, 0);
  
  const stats = [
    {
      title: 'Total de Pedidos',
      value: totalOrders,
      icon: ShoppingCart,
      description: 'Pedidos cadastrados',
      color: 'text-blue-600'
    },
    {
      title: 'Pendentes',
      value: pendingOrders,
      icon: Clock,
      description: 'Aguardando processamento',
      color: 'text-orange-600'
    },
    {
      title: 'Concluídos',
      value: completedOrders,
      icon: CheckCircle,
      description: 'Pedidos entregues',
      color: 'text-green-600'
    },
    {
      title: 'Faturamento',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: 'Total em pedidos',
      color: 'text-purple-600'
    }
  ];
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
