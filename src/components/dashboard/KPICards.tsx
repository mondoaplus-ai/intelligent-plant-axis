import { motion } from 'framer-motion';
import { TrendingUp, Zap, ShoppingBag, Brain } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

const kpis = [
  {
    title: 'Produção Hoje',
    value: '847',
    unit: 'unidades',
    change: '+12%',
    comparison: 'vs ontem',
    icon: TrendingUp,
    color: 'success',
    bgGradient: 'from-success/10 to-success/5',
  },
  {
    title: 'Eficiência OEE',
    value: '78.5',
    unit: '%',
    change: '+3.2%',
    comparison: 'vs média',
    icon: Zap,
    color: 'primary',
    bgGradient: 'from-primary/10 to-primary/5',
  },
  {
    title: 'Pedidos Pendentes',
    value: '124',
    unit: 'pedidos',
    change: 'R$ 1.2M',
    comparison: 'em valor',
    icon: ShoppingBag,
    color: 'warning',
    bgGradient: 'from-warning/10 to-warning/5',
  },
  {
    title: 'IA Ativa',
    value: '3',
    unit: 'otimizações',
    change: 'rodando',
    comparison: 'agora',
    icon: Brain,
    color: 'accent',
    bgGradient: 'from-accent/20 to-accent/10',
    pulse: true,
  },
];

export const KPICards = () => {
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
