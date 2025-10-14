import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { PriceListItem } from '@/types/priceList';

interface PriceStatsProps {
  prices: PriceListItem[];
}

export const PriceStats = ({ prices }: PriceStatsProps) => {
  const activePrices = prices.filter(p => p.status === 'ativo').length;
  const avgDiscount = prices.reduce((acc, p) => acc + p.discount, 0) / prices.length || 0;
  const scheduledPrices = prices.filter(p => p.status === 'agendado').length;
  const totalRevenue = prices.reduce((acc, p) => acc + p.finalPrice, 0);

  const stats = [
    {
      title: 'Preços Ativos',
      value: activePrices,
      icon: Tag,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Desconto Médio',
      value: `${avgDiscount.toFixed(1)}%`,
      icon: TrendingDown,
      trend: '-2%',
      trendUp: false,
    },
    {
      title: 'Preços Agendados',
      value: scheduledPrices,
      icon: Calendar,
      trend: '+5',
      trendUp: true,
    },
    {
      title: 'Receita Estimada',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      trend: '+18%',
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'} mt-1`}>
              {stat.trend} vs mês anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
