import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Brain, AlertTriangle, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { Badge } from '../ui/badge';

const insights = [
  {
    icon: AlertTriangle,
    title: 'OP #1847 pode atrasar 2h',
    description: 'Sugestão: Antecipar setup máquina 3',
    type: 'warning',
    priority: 'high',
  },
  {
    icon: CheckCircle,
    title: 'Sequenciamento otimizado',
    description: '-18% tempo de setup hoje',
    type: 'success',
    priority: 'medium',
  },
  {
    icon: Target,
    title: 'Qualidade prevista: 96.8%',
    description: 'Acima da meta de 95%',
    type: 'success',
    priority: 'medium',
  },
  {
    icon: Lightbulb,
    title: 'IA detectou padrão',
    description: 'Produção 12% melhor entre 14-18h',
    type: 'info',
    priority: 'low',
  },
];

const typeColors = {
  warning: 'warning',
  success: 'success',
  info: 'accent',
};

export const AIInsights = () => {
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
