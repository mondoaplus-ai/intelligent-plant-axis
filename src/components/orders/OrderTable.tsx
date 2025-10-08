import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus, OrderPriority } from '@/types/order';
import { Pencil, Trash2, Eye, ShoppingCart } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onView: (order: Order) => void;
}

const statusColors: Record<OrderStatus, string> = {
  'orcamento': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  'aprovado': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'producao': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'faturado': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'entregue': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const priorityColors: Record<OrderPriority, string> = {
  'baixa': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  'normal': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'alta': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'urgente': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const statusLabels: Record<OrderStatus, string> = {
  'orcamento': 'Orçamento',
  'aprovado': 'Aprovado',
  'producao': 'Em Produção',
  'faturado': 'Faturado',
  'entregue': 'Entregue',
  'cancelado': 'Cancelado'
};

const priorityLabels: Record<OrderPriority, string> = {
  'baixa': 'Baixa',
  'normal': 'Normal',
  'alta': 'Alta',
  'urgente': 'Urgente'
};

export const OrderTable = ({ orders, onEdit, onDelete, onView }: OrderTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Entrega</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center h-32">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ShoppingCart className="h-8 w-8" />
                  <p>Nenhum pedido encontrado</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-muted-foreground">{order.customerDocument}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {new Date(order.expectedDelivery).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={priorityColors[order.priority]}>
                    {priorityLabels[order.priority]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(order)}
                    >
                      <Pencil className="h-4 w-4" />
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
