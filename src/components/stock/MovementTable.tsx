import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Trash2, ArrowDownCircle, ArrowUpCircle, RefreshCw, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StockMovement } from '@/types/stockMovement';

interface MovementTableProps {
  movements: StockMovement[];
  onView: (movement: StockMovement) => void;
  onDelete: (id: string) => void;
}

const typeConfig = {
  entrada: { label: 'Entrada', icon: ArrowDownCircle, variant: 'default' as const, color: 'text-green-500' },
  saida: { label: 'Saída', icon: ArrowUpCircle, variant: 'destructive' as const, color: 'text-red-500' },
  ajuste: { label: 'Ajuste', icon: RefreshCw, variant: 'secondary' as const, color: 'text-blue-500' },
  transferencia: { label: 'Transferência', icon: ArrowLeftRight, variant: 'outline' as const, color: 'text-purple-500' },
};

const reasonLabels = {
  compra: 'Compra',
  venda: 'Venda',
  producao: 'Produção',
  devolucao: 'Devolução',
  perda: 'Perda',
  ajuste_inventario: 'Ajuste Inventário',
  transferencia_deposito: 'Transferência',
};

export const MovementTable = ({ movements, onView, onDelete }: MovementTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                Nenhuma movimentação encontrada
              </TableCell>
            </TableRow>
          ) : (
            movements.map((movement) => {
              const config = typeConfig[movement.type];
              const Icon = config.icon;
              
              return (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">
                    {format(movement.date, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.variant} className="gap-1">
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{reasonLabels[movement.reason]}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{movement.productCode}</div>
                      <div className="text-sm text-muted-foreground">{movement.productName}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={movement.quantity < 0 ? 'text-red-500' : 'text-green-500'}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {movement.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {movement.fromLocation && (
                        <div className="text-muted-foreground">De: {movement.fromLocation}</div>
                      )}
                      {movement.toLocation && (
                        <div className="text-muted-foreground">Para: {movement.toLocation}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{movement.userName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(movement)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(movement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
