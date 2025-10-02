import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';

const data = [
  { day: 'Dom', producao: 580, meta: 600, iaAtiva: false },
  { day: 'Seg', producao: 620, meta: 650, iaAtiva: false },
  { day: 'Ter', producao: 590, meta: 650, iaAtiva: true },
  { day: 'Qua', producao: 710, meta: 700, iaAtiva: true },
  { day: 'Qui', producao: 820, meta: 750, iaAtiva: true },
  { day: 'Sex', producao: 847, meta: 750, iaAtiva: true },
  { day: 'Sáb', producao: 780, meta: 600, iaAtiva: false },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
        <p className="text-sm font-semibold text-foreground mb-2">{data.day}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Produção:</span>
            <span className="text-sm font-bold text-foreground">{data.producao} un</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Meta:</span>
            <span className="text-sm font-bold text-foreground">{data.meta} un</span>
          </div>
          {data.iaAtiva && (
            <div className="flex items-center gap-2 pt-1 border-t border-border mt-2">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-accent font-semibold">IA Otimizando</span>
            </div>
          )}
        </div>
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Eficiência: <span className="font-bold text-foreground">{((data.producao / data.meta) * 100).toFixed(1)}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const ProductionChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-poppins font-bold text-foreground">
            Produção dos Últimos 7 Dias
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhamento em tempo real com otimização IA
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="iaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="producao"
              fill="url(#iaGradient)"
              stroke="none"
              name="Área IA"
            />
            <Line
              type="monotone"
              dataKey="producao"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 5, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 7 }}
              name="Produção Real"
            />
            <Line
              type="monotone"
              dataKey="meta"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: 'hsl(var(--success))' }}
              name="Meta"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
