import { motion } from 'framer-motion';
import { TrendingUp, Zap, ShoppingBag, Package } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ProductionOrder } from '@/types/productionOrder';
import { Order } from '@/types/order';
import { Customer } from '@/types/customer';
import { Product } from '@/types/product';

interface KPICardsProps {
  productionOrders: ProductionOrder[];
  salesOrders: Order[];
  customers: Customer[];
  products: Product[];
}

export const KPICards = ({ productionOrders, salesOrders, customers, products }: KPICardsProps) => {
  // Calcular métricas reais
  const activeProductionOrders = productionOrders.filter(o => 
    o.status === 'Produzindo' || o.status === 'Em Setup'
  ).length;
  
  const avgEfficiency = productionOrders
    .filter(o => o.efficiency)
    .reduce((acc, o) => acc + (o.efficiency || 0), 0) / productionOrders.filter(o => o.efficiency).length || 0;
  
  const pendingSalesOrders = salesOrders.filter(o => 
    o.status === 'orcamento' || o.status === 'aprovado' || o.status === 'producao'
  ).length;
  
  const pendingValue = salesOrders
    .filter(o => o.status === 'orcamento' || o.status === 'aprovado' || o.status === 'producao')
    .reduce((sum, o) => sum + o.total, 0);
    
  const lowStockProducts = products.filter(p => 
    p.currentStock <= p.minStock && p.status === 'Ativo'
  ).length;

  const kpis = [
    {
      title: 'Produção Ativa',
      value: activeProductionOrders.toString(),
      unit: 'ordens',
      change: `${productionOrders.length} total`,
      comparison: 'ordens cadastradas',
      icon: TrendingUp,
      color: 'success',
      bgGradient: 'from-success/10 to-success/5',
    },
    {
      title: 'Eficiência Média',
      value: avgEfficiency.toFixed(1),
      unit: '%',
      change: 'OEE',
      comparison: 'das ordens',
      icon: Zap,
      color: 'primary',
      bgGradient: 'from-primary/10 to-primary/5',
    },
    {
      title: 'Pedidos Pendentes',
      value: pendingSalesOrders.toString(),
      unit: 'pedidos',
      change: `R$ ${(pendingValue / 1000).toFixed(0)}K`,
      comparison: 'em valor',
      icon: ShoppingBag,
      color: 'warning',
      bgGradient: 'from-warning/10 to-warning/5',
    },
    {
      title: 'Estoque Baixo',
      value: lowStockProducts.toString(),
      unit: 'produtos',
      change: 'atenção',
      comparison: 'necessária',
      icon: Package,
      color: 'accent',
      bgGradient: 'from-accent/20 to-accent/10',
      pulse: lowStockProducts > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card
            className={`p-6 bg-gradient-to-br ${kpi.bgGradient} border-${kpi.color}/20 hover:shadow-elevated transition-smooth cursor-pointer ${
              kpi.pulse ? 'animate-pulse-glow' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-${kpi.color}/10 flex items-center justify-center`}
              >
                <kpi.icon className={`w-6 h-6 text-${kpi.color}`} />
              </div>
              {kpi.title === 'IA Ativa' && (
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  LIVE
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">{kpi.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold font-poppins text-foreground">
                  {kpi.value}
                </h3>
                <span className="text-sm text-muted-foreground">{kpi.unit}</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge
                  variant="secondary"
                  className={`text-xs bg-${kpi.color}/10 text-${kpi.color} border-${kpi.color}/20`}
                >
                  {kpi.change}
                </Badge>
                <span className="text-xs text-muted-foreground">{kpi.comparison}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
