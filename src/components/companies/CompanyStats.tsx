import { useCompanyStore } from '@/lib/companyStore';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Building, CheckCircle, XCircle } from 'lucide-react';

export const CompanyStats = () => {
  const { companies } = useCompanyStore();

  const stats = [
    {
      title: 'Total de Empresas',
      value: companies.length,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Matrizes',
      value: companies.filter((c) => c.type === 'matriz').length,
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Filiais',
      value: companies.filter((c) => c.type === 'filial').length,
      icon: Building,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Ativas',
      value: companies.filter((c) => c.status === 'ativa').length,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Inativas',
      value: companies.filter((c) => c.status === 'inativa').length,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
