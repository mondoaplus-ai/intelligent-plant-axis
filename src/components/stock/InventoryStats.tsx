import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, Warehouse } from 'lucide-react';
import { InventoryItem } from '@/types/inventory';

interface InventoryStatsProps {
  items: InventoryItem[];
}

export const InventoryStats = ({ items }: InventoryStatsProps) => {
  const stats = {
    totalItems: items.length,
    lowStock: items.filter(i => i.status === 'low').length,
    criticalStock: items.filter(i => i.status === 'critical').length,
    totalValue: items.reduce((sum, i) => sum + i.totalValue, 0),
    alertItems: items.filter(i => i.status === 'low' || i.status === 'critical').length,
  };

  const cards = [
    {
      title: 'Total de Itens',
      value: stats.totalItems,
      subtitle: 'Produtos em estoque',
      icon: Package,
      color: 'text-blue-500',
    },
    {
      title: 'Alertas',
      value: stats.alertItems,
      subtitle: `${stats.lowStock} baixos, ${stats.criticalStock} críticos`,
      icon: AlertTriangle,
      color: 'text-orange-500',
    },
    {
      title: 'Valor Total',
      value: `R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: 'Valor do estoque',
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Disponível',
      value: items.reduce((sum, i) => sum + i.availableStock, 0),
      subtitle: 'Unidades disponíveis',
      icon: Warehouse,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
