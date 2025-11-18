import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Edit, AlertCircle, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InventoryItem } from '@/types/inventory';

interface InventoryTableProps {
  items: InventoryItem[];
  onView: (item: InventoryItem) => void;
  onAdjust: (item: InventoryItem) => void;
}

const statusConfig = {
  normal: { label: 'Normal', icon: CheckCircle, variant: 'default' as const, color: 'text-green-500' },
  low: { label: 'Baixo', icon: AlertTriangle, variant: 'secondary' as const, color: 'text-yellow-500' },
  critical: { label: 'Crítico', icon: AlertCircle, variant: 'destructive' as const, color: 'text-red-500' },
  overstock: { label: 'Excesso', icon: TrendingUp, variant: 'outline' as const, color: 'text-blue-500' },
};

export const InventoryTable = ({ items, onView, onAdjust }: InventoryTableProps) => {
  const getStockPercentage = (item: InventoryItem) => {
    return Math.min((item.currentStock / item.maxStock) * 100, 100);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead className="text-right">Estoque Atual</TableHead>
            <TableHead className="text-center">Nível</TableHead>
            <TableHead className="text-right">Disponível</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Mov.</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground">
                Nenhum item encontrado
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const config = statusConfig[item.status];
              const Icon = config.icon;
              const stockPercentage = getStockPercentage(item);
              
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.productCode}</div>
                      <div className="text-sm text-muted-foreground">{item.productName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.productCategory}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{item.location}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <div className="font-medium">{item.currentStock} {item.unit}</div>
                      <div className="text-xs text-muted-foreground">
                        Min: {item.minStock} / Max: {item.maxStock}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={stockPercentage} className="h-2" />
                      <div className="text-xs text-center text-muted-foreground">
                        {stockPercentage.toFixed(0)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.availableStock} {item.unit}
                    {item.reservedStock > 0 && (
                      <div className="text-xs text-muted-foreground">
                        ({item.reservedStock} reservado)
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    <div className="text-xs text-muted-foreground">
                      R$ {item.avgCost.toFixed(2)}/{item.unit}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.variant} className="gap-1">
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(item.lastMovement, "dd/MM/yy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAdjust(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
