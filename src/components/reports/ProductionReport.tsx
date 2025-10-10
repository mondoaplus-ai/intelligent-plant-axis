import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductionOrderStore } from '@/lib/productionOrderStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Factory, CheckCircle, Clock, Pause } from 'lucide-react';

const STATUS_COLORS = {
  'Concluída': '#22c55e',
  'Produzindo': '#3b82f6',
  'Em Setup': '#f59e0b',
  'Pausada': '#ef4444',
  'Aguardando': '#6b7280',
};

export const ProductionReport = () => {
  const orders = useProductionOrderStore((state) => state.orders);

  const statusData = [
    { name: 'Concluídas', value: orders.filter(o => o.status === 'Concluída').length, icon: CheckCircle },
    { name: 'Produzindo', value: orders.filter(o => o.status === 'Produzindo').length, icon: Factory },
    { name: 'Em Setup', value: orders.filter(o => o.status === 'Em Setup').length, icon: Clock },
    { name: 'Pausadas', value: orders.filter(o => o.status === 'Pausada').length, icon: Pause },
  ];

  const efficiencyData = orders
    .filter(o => o.efficiency)
    .map(o => ({
      name: o.productName,
      eficiencia: o.efficiency,
    }));

  const pieData = Object.entries(STATUS_COLORS).map(([status, color]) => ({
    name: status,
    value: orders.filter(o => o.status === status).length,
    color,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
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
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eficiência por Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="eficiencia" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
