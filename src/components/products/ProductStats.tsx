import { Package, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';

interface ProductStatsProps {
  products: Product[];
}

export const ProductStats = ({ products }: ProductStatsProps) => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Ativo').length;
  const lowStockProducts = products.filter(p => p.currentStock < p.minStock).length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.avgCost), 0);

  const stats = [
    {
      icon: Package,
      label: 'Total de Produtos',
      value: totalProducts,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: CheckCircle,
      label: 'Ativos',
      value: activeProducts,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      icon: AlertTriangle,
      label: 'Estoque Baixo',
      value: `${lowStockProducts} alertas`,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      icon: DollarSign,
      label: 'Valor Total em Estoque',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalStockValue),
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
