import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { StockMovement } from '@/types/stockMovement';

interface MovementStatsProps {
  movements: StockMovement[];
}

export const MovementStats = ({ movements }: MovementStatsProps) => {
  const stats = {
    entries: movements.filter(m => m.type === 'entrada').length,
    exits: movements.filter(m => m.type === 'saida').length,
    adjustments: movements.filter(m => m.type === 'ajuste').length,
    transfers: movements.filter(m => m.type === 'transferencia').length,
    totalEntryValue: movements
      .filter(m => m.type === 'entrada')
      .reduce((sum, m) => sum + m.totalCost, 0),
    totalExitValue: movements
      .filter(m => m.type === 'saida')
      .reduce((sum, m) => sum + m.totalCost, 0),
  };

  const cards = [
    {
      title: 'Entradas',
      value: stats.entries,
      subtitle: `R$ ${stats.totalEntryValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: ArrowDownCircle,
      color: 'text-green-500',
    },
    {
      title: 'Saídas',
      value: stats.exits,
      subtitle: `R$ ${stats.totalExitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: ArrowUpCircle,
      color: 'text-red-500',
    },
    {
      title: 'Ajustes',
      value: stats.adjustments,
      subtitle: 'Correções de estoque',
      icon: RefreshCw,
      color: 'text-blue-500',
    },
    {
      title: 'Transferências',
      value: stats.transfers,
      subtitle: 'Entre depósitos',
      icon: ArrowLeftRight,
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
