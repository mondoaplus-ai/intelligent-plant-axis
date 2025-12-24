import { useUserStore } from '@/lib/userStore';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, UserCheck, UserX, Lock } from 'lucide-react';

export const UserStats = () => {
  const { users } = useUserStore();

  const stats = [
    {
      title: 'Total de Usuários',
      value: users.length,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Administradores',
      value: users.filter((u) => u.role === 'admin').length,
      icon: Shield,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Ativos',
      value: users.filter((u) => u.status === 'ativo').length,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Inativos',
      value: users.filter((u) => u.status === 'inativo').length,
      icon: UserX,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/10',
    },
    {
      title: 'Bloqueados',
      value: users.filter((u) => u.status === 'bloqueado').length,
      icon: Lock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
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
