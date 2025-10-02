import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Brain } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const orders = [
  {
    op: 'OP-1847',
    produto: 'Válvula HD-250',
    quantidade: 500,
    progresso: 68,
    status: 'Produzindo',
    statusColor: 'success',
    iaOtimizada: true,
  },
  {
    op: 'OP-1852',
    produto: 'Flange ISO-300',
    quantidade: 350,
    progresso: 42,
    status: 'Em Setup',
    statusColor: 'warning',
    iaOtimizada: false,
  },
  {
    op: 'OP-1859',
    produto: 'Eixo CNC-120',
    quantidade: 200,
    progresso: 89,
    status: 'Produzindo',
    statusColor: 'success',
    iaOtimizada: true,
  },
  {
    op: 'OP-1863',
    produto: 'Engrenagem P-45',
    quantidade: 450,
    progresso: 15,
    status: 'Pausado',
    statusColor: 'danger',
    iaOtimizada: false,
  },
  {
    op: 'OP-1868',
    produto: 'Bucha Metálica BM-78',
    quantidade: 600,
    progresso: 55,
    status: 'Produzindo',
    statusColor: 'success',
    iaOtimizada: true,
  },
];

export const ActiveOrdersTable = () => {
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
            Acompanhamento em tempo real
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OP</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Qtd</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={order.op} className="hover:bg-muted/50 transition-smooth">
                  <TableCell className="font-mono font-semibold">
                    <div className="flex items-center gap-2">
                      {order.iaOtimizada && (
                        <Brain className="w-4 h-4 text-accent animate-pulse" />
                      )}
                      {order.op}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{order.produto}</TableCell>
                  <TableCell className="text-center">{order.quantidade}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={order.progresso} className="h-2" />
                      <span className="text-xs text-muted-foreground">{order.progresso}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="secondary"
                      className={`bg-${order.statusColor}/10 text-${order.statusColor} border-${order.statusColor}/20`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
};
