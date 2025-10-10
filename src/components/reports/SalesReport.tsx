import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderStore } from '@/lib/orderStore';
import { useCustomerStore } from '@/lib/customerStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

export const SalesReport = () => {
  const orders = useOrderStore((state) => state.orders);
  const customers = useCustomerStore((state) => state.customers);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const activeCustomers = customers.filter(c => c.status === 'Ativo').length;

  const stats = [
    { title: 'Receita Total', value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign },
    { title: 'Total de Pedidos', value: orders.length, icon: ShoppingCart },
    { title: 'Ticket Médio', value: `R$ ${avgOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp },
    { title: 'Clientes Ativos', value: activeCustomers, icon: Users },
  ];

  const statusData = [
    { name: 'Orçamento', value: orders.filter(o => o.status === 'orcamento').length },
    { name: 'Aprovado', value: orders.filter(o => o.status === 'aprovado').length },
    { name: 'Produção', value: orders.filter(o => o.status === 'producao').length },
    { name: 'Faturado', value: orders.filter(o => o.status === 'faturado').length },
    { name: 'Entregue', value: orders.filter(o => o.status === 'entregue').length },
  ];

  const revenueByStatus = [
    { 
      name: 'Orçamento', 
      valor: orders.filter(o => o.status === 'orcamento').reduce((sum, o) => sum + o.total, 0) 
    },
    { 
      name: 'Aprovado', 
      valor: orders.filter(o => o.status === 'aprovado').reduce((sum, o) => sum + o.total, 0) 
    },
    { 
      name: 'Produção', 
      valor: orders.filter(o => o.status === 'producao').reduce((sum, o) => sum + o.total, 0) 
    },
    { 
      name: 'Faturado', 
      valor: orders.filter(o => o.status === 'faturado').reduce((sum, o) => sum + o.total, 0) 
    },
    { 
      name: 'Entregue', 
      valor: orders.filter(o => o.status === 'entregue').reduce((sum, o) => sum + o.total, 0) 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faturamento por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                <Bar dataKey="valor" fill="hsl(var(--success))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
