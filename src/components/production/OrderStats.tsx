import { Card, CardContent } from '@/components/ui/card';
import { Factory, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { ProductionOrder } from '@/types/productionOrder';

interface OrderStatsProps {
  orders: ProductionOrder[];
}

export const OrderStats = ({ orders }: OrderStatsProps) => {
  const totalOrders = orders.length;
  const inProduction = orders.filter(o => o.status === 'Produzindo').length;
  const completed = orders.filter(o => o.status === 'Concluída').length;
  const delayed = orders.filter(o => {
    if (o.status === 'Concluída') return false;
    return new Date(o.expectedEndDate) < new Date();
  }).length;

  const avgEfficiency = orders
    .filter(o => o.efficiency)
    .reduce((acc, o) => acc + (o.efficiency || 0), 0) / orders.filter(o => o.efficiency).length || 0;

  const stats = [
    {
      title: 'Total de OPs',
      value: totalOrders,
      icon: Factory,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Em Produção',
      value: inProduction,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Eficiência Média',
      value: `${avgEfficiency.toFixed(1)}%`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      title: 'Atrasadas',
      value: delayed,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
