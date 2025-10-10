import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Brain } from 'lucide-react';
import { ProductionOrder, ProductionOrderStatus } from '@/types/productionOrder';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface ActiveOrdersTableProps {
  productionOrders: ProductionOrder[];
}

const getStatusColor = (status: ProductionOrderStatus) => {
  const colors = {
    'Planejada': 'secondary',
    'Em Setup': 'warning',
    'Produzindo': 'success',
    'Pausada': 'danger',
    'Concluída': 'success',
    'Cancelada': 'danger'
  };
  return colors[status] || 'secondary';
};

export const ActiveOrdersTable = ({ productionOrders }: ActiveOrdersTableProps) => {
  const safeOrders = productionOrders || [];
  const activeOrders = safeOrders
    .filter(o => o.status === 'Produzindo' || o.status === 'Em Setup' || o.status === 'Pausada')
    .slice(0, 5);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-poppins font-bold text-foreground">
            Ordens em Andamento
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Top 5 ordens ativas
          </p>
        </div>

        <div className="overflow-x-auto">
          {activeOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma ordem em andamento</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OP</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrders.map((order) => {
                  const progress = order.quantityPlanned > 0 
                    ? Math.round((order.quantityProduced / order.quantityPlanned) * 100) 
                    : 0;
                  
                  return (
                    <TableRow key={order.id} className="hover:bg-muted/50 transition-smooth">
                      <TableCell className="font-mono font-semibold">
                        <div className="flex items-center gap-2">
                          {order.aiOptimized && (
                            <Brain className="w-4 h-4 text-accent animate-pulse" />
                          )}
                          {order.orderNumber}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{order.productName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={progress} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {order.quantityProduced}/{order.quantityPlanned} ({progress}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={`bg-${getStatusColor(order.status)}/10 text-${getStatusColor(order.status)} border-${getStatusColor(order.status)}/20`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
