import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerStatsProps {
  customers: Customer[];
}

export const CustomerStats = ({ customers }: CustomerStatsProps) => {
  const activeCustomers = customers.filter(c => c.status === 'Ativo').length;
  const blockedCustomers = customers.filter(c => c.status === 'Bloqueado').length;
  
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const averageTicket = customers.length > 0 
    ? customers.reduce((sum, c) => sum + c.averageTicket, 0) / customers.length 
    : 0;
  
  const categoryA = customers.filter(c => c.category === 'A').length;

  const stats = [
    {
      title: "Total de Clientes",
      value: customers.length.toString(),
      subtitle: `${activeCustomers} ativos`,
      icon: Users,
      trend: "+12% vs mês anterior",
      color: "text-primary"
    },
    {
      title: "Faturamento Total",
      value: `R$ ${(totalRevenue / 1000).toFixed(0)}k`,
      subtitle: "Acumulado",
      icon: DollarSign,
      trend: "+18% vs mês anterior",
      color: "text-green-600"
    },
    {
      title: "Ticket Médio",
      value: `R$ ${(averageTicket / 1000).toFixed(1)}k`,
      subtitle: "Por cliente",
      icon: TrendingUp,
      trend: "+5% vs mês anterior",
      color: "text-blue-600"
    },
    {
      title: "Categoria A",
      value: categoryA.toString(),
      subtitle: `${blockedCustomers} bloqueados`,
      icon: AlertCircle,
      trend: "Alto valor",
      color: "text-amber-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-poppins font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
