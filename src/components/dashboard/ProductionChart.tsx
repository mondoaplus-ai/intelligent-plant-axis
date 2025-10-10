import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProductionOrder } from '@/types/productionOrder';

interface ProductionChartProps {
  productionOrders: ProductionOrder[];
}

export const ProductionChart = ({ productionOrders }: ProductionChartProps) => {
  // Agrupar produção por status
  const statusData = [
    { 
      name: 'Planejada', 
      quantidade: productionOrders.filter(o => o.status === 'Planejada').length 
    },
    { 
      name: 'Em Setup', 
      quantidade: productionOrders.filter(o => o.status === 'Em Setup').length 
    },
    { 
      name: 'Produzindo', 
      quantidade: productionOrders.filter(o => o.status === 'Produzindo').length 
    },
    { 
      name: 'Pausada', 
      quantidade: productionOrders.filter(o => o.status === 'Pausada').length 
    },
    { 
      name: 'Concluída', 
      quantidade: productionOrders.filter(o => o.status === 'Concluída').length 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-poppins font-bold text-foreground">
            Ordens de Produção por Status
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Distribuição atual das ordens
          </p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip />
            <Bar dataKey="quantidade" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};
