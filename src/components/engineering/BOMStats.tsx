import { Card, CardContent } from '@/components/ui/card';
import { Package, Wrench, DollarSign, Clock } from 'lucide-react';
import { BOM } from '@/types/bom';

interface BOMStatsProps {
  boms: BOM[];
}

export const BOMStats = ({ boms }: BOMStatsProps) => {
  const totalBOMs = boms.length;
  const activeBOMs = boms.filter(b => b.status === 'ativo').length;
  const avgCost = boms.length > 0 
    ? boms.reduce((sum, b) => sum + b.totalCost, 0) / boms.length 
    : 0;
  const totalProcesses = boms.reduce((sum, b) => sum + b.processes.length, 0);

  const stats = [
    {
      title: 'Total de BOMs',
      value: totalBOMs,
      icon: Package,
      trend: `${activeBOMs} ativos`,
    },
    {
      title: 'Processos Cadastrados',
      value: totalProcesses,
      icon: Wrench,
      trend: 'Total no sistema',
    },
    {
      title: 'Custo Médio',
      value: `R$ ${avgCost.toFixed(2)}`,
      icon: DollarSign,
      trend: 'Por produto',
    },
    {
      title: 'BOMs em Revisão',
      value: boms.filter(b => b.status === 'em_revisao').length,
      icon: Clock,
      trend: 'Aguardando aprovação',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
