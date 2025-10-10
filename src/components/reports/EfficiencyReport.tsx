import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppointmentStore } from '@/lib/appointmentStore';
import { useProductionOrderStore } from '@/lib/productionOrderStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Clock, Zap, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const EfficiencyReport = () => {
  const appointments = useAppointmentStore((state) => state.appointments);
  const orders = useProductionOrderStore((state) => state.orders);

  const totalAppointments = appointments.length;
  const avgEfficiency = orders
    .filter(o => o.efficiency)
    .reduce((sum, o) => sum + (o.efficiency || 0), 0) / orders.filter(o => o.efficiency).length || 0;
  const completedOrders = orders.filter(o => o.status === 'Concluída').length;
  const onTimeOrders = orders.filter(o => 
    o.status === 'Concluída' && new Date(o.actualEndDate || '') <= new Date(o.expectedEndDate)
  ).length;
  const onTimePercentage = completedOrders > 0 ? (onTimeOrders / completedOrders) * 100 : 0;

  const stats = [
    { title: 'Apontamentos', value: totalAppointments, icon: Clock },
    { title: 'Eficiência Média', value: `${avgEfficiency.toFixed(1)}%`, icon: TrendingUp },
    { title: 'Ordens Completas', value: completedOrders, icon: Target },
    { title: 'No Prazo', value: `${onTimePercentage.toFixed(1)}%`, icon: Zap },
  ];

  const efficiencyByOrder = orders
    .filter(o => o.efficiency)
    .map(o => ({
      name: o.productName.substring(0, 20),
      eficiencia: o.efficiency,
    }));

  const appointmentsByOrder = appointments.reduce((acc, apt) => {
    const existing = acc.find(item => item.productionOrderId === apt.productionOrderId);
    if (existing) {
      existing.count += 1;
      existing.totalProduced += apt.quantityProduced;
    } else {
      const order = orders.find(o => o.id === apt.productionOrderId);
      acc.push({
        productionOrderId: apt.productionOrderId,
        orderName: order?.productName || 'Desconhecido',
        count: 1,
        totalProduced: apt.quantityProduced,
      });
    }
    return acc;
  }, [] as Array<{ productionOrderId: string; orderName: string; count: number; totalProduced: number }>);

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
            <CardTitle>Eficiência por Ordem</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyByOrder}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="eficiencia" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produção por Ordem</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsByOrder}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="orderName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalProduced" fill="hsl(var(--success))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho das Ordens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.filter(o => o.efficiency).map((order) => (
              <div key={order.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.quantityProduced} unidades produzidas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{order.efficiency}%</p>
                    <p className="text-xs text-muted-foreground">eficiência</p>
                  </div>
                </div>
                <Progress value={order.efficiency} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
