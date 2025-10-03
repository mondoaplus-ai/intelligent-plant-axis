import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, Sparkles } from 'lucide-react';
import { ProductionOrder, ProductionOrderStatus } from '@/types/productionOrder';
import { format } from 'date-fns';

interface OrderTableProps {
  orders: ProductionOrder[];
  onEdit: (order: ProductionOrder) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: ProductionOrderStatus) => {
  const colors = {
    'Planejada': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    'Em Setup': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    'Produzindo': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    'Pausada': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    'Concluída': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'Cancelada': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getPriorityColor = (priority: string) => {
  const colors = {
    'Urgente': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    'Alta': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    'Normal': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    'Baixa': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

export const OrderTable = ({ orders, onEdit, onDelete }: OrderTableProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">Nenhuma ordem de produção encontrada</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>OP</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Qtd Planejada</TableHead>
            <TableHead>Qtd Produzida</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Máquina</TableHead>
            <TableHead>Previsão Término</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const progress = order.quantityPlanned > 0 
              ? (order.quantityProduced / order.quantityPlanned) * 100 
              : 0;

            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {order.orderNumber}
                    {order.aiOptimized && (
                      <Sparkles className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.productName}</div>
                    <div className="text-sm text-muted-foreground">{order.productCode}</div>
                  </div>
                </TableCell>
                <TableCell>{order.quantityPlanned.toLocaleString()} {order.unit}</TableCell>
                <TableCell>
                  <div>
                    <div>{order.quantityProduced.toLocaleString()} {order.unit}</div>
                    {order.quantityRejected > 0 && (
                      <div className="text-sm text-red-600">
                        -{order.quantityRejected} refugo
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-24">
                    <Progress value={progress} className="h-2" />
                    <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                </TableCell>
                <TableCell>{order.machine}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(order.expectedEndDate), 'dd/MM/yyyy HH:mm')}
                    {new Date(order.expectedEndDate) < new Date() && order.status !== 'Concluída' && (
                      <div className="text-xs text-red-600">Atrasada</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
