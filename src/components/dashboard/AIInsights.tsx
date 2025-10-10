import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Brain, AlertTriangle, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ProductionOrder } from '@/types/productionOrder';
import { Order } from '@/types/order';

interface AIInsightsProps {
  productionOrders: ProductionOrder[];
  salesOrders: Order[];
}

const typeColors = {
  warning: 'warning',
  success: 'success',
  info: 'accent',
};

export const AIInsights = ({ productionOrders, salesOrders }: AIInsightsProps) => {
  // Calcular insights reais
  const delayedOrders = productionOrders.filter(o => {
    if (o.status === 'Concluída') return false;
    return new Date(o.expectedEndDate) < new Date();
  }).length;
  
  const avgEfficiency = productionOrders
    .filter(o => o.efficiency)
    .reduce((acc, o) => acc + (o.efficiency || 0), 0) / productionOrders.filter(o => o.efficiency).length || 0;
    
  const pendingSalesOrders = salesOrders.filter(o => 
    o.status === 'aprovado' || o.status === 'orcamento'
  ).length;
  
  const aiOptimizedOrders = productionOrders.filter(o => o.aiOptimized).length;

  const insights = [
    {
      icon: CheckCircle,
      title: 'Eficiência Média',
      description: `A eficiência média da produção está em ${avgEfficiency.toFixed(1)}%`,
      type: avgEfficiency >= 80 ? 'success' : 'warning',
      priority: avgEfficiency >= 80 ? 'medium' : 'high',
    },
    {
      icon: AlertTriangle,
      title: delayedOrders > 0 ? 'Ordens Atrasadas' : 'Produção no Prazo',
      description: delayedOrders > 0 
        ? `${delayedOrders} ordem(ns) de produção com prazo vencido` 
        : 'Todas as ordens de produção estão dentro do prazo',
      type: delayedOrders > 0 ? 'warning' : 'success',
      priority: delayedOrders > 0 ? 'high' : 'medium',
    },
    {
      icon: Target,
      title: 'Pedidos Pendentes',
      description: `${pendingSalesOrders} pedido(s) aguardando aprovação ou processamento`,
      type: pendingSalesOrders > 5 ? 'warning' : 'info',
      priority: pendingSalesOrders > 5 ? 'high' : 'low',
    },
    {
      icon: Lightbulb,
      title: 'IA Otimizando',
      description: `${aiOptimizedOrders} ordem(ns) otimizadas por inteligência artificial`,
      type: 'info',
      priority: 'low',
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-accent animate-pulse-glow" />
          </div>
          <div>
            <h3 className="text-xl font-poppins font-bold text-foreground">
              IA - Insights em Tempo Real
            </h3>
            <p className="text-sm text-muted-foreground">
              Análise preditiva e recomendações automáticas
            </p>
          </div>
          <Badge variant="secondary" className="ml-auto bg-accent/20 text-accent-foreground">
            LIVE
          </Badge>
        </div>

        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            >
              <Card className="p-4 bg-card hover:bg-muted/50 transition-smooth border-l-4 border-l-transparent hover:border-l-primary cursor-pointer">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-${typeColors[insight.type as keyof typeof typeColors]}/10 flex items-center justify-center shrink-0`}
                  >
                    <insight.icon
                      className={`w-5 h-5 text-${typeColors[insight.type as keyof typeof typeColors]}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        {insight.title}
                      </h4>
                      {insight.priority === 'high' && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-danger/10 text-danger border-danger/20"
                        >
                          Urgente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
