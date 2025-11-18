import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, ArrowLeftRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStockMovementStore } from '@/lib/stockMovementStore';

interface ProductMovementHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  productName?: string;
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

export const ProductMovementHistory = ({
  open,
  onOpenChange,
  productId,
  productName,
}: ProductMovementHistoryProps) => {
  const { movements } = useStockMovementStore();

  const productMovements = movements
    .filter(m => m.productId === productId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!productId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Histórico de Movimentações</DialogTitle>
          <DialogDescription>
            Todas as movimentações do produto: {productName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {productMovements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma movimentação encontrada para este produto
            </div>
          ) : (
            <div className="space-y-3">
              {productMovements.map((movement) => {
                const config = typeConfig[movement.type];
                const Icon = config.icon;

                return (
                  <div
                    key={movement.id}
                    className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={config.variant} className="text-xs">
                              {config.label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {reasonLabels[movement.reason]}
                            </span>
                          </div>
                          <div className="text-sm font-medium mt-1">
                            {format(movement.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.productCode}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          R$ {movement.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>

                    {(movement.fromLocation || movement.toLocation) && (
                      <div className="text-sm space-y-1">
                        {movement.fromLocation && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">De:</span> {movement.fromLocation}
                          </div>
                        )}
                        {movement.toLocation && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">Para:</span> {movement.toLocation}
                          </div>
                        )}
                      </div>
                    )}

                    {movement.referenceDocument && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Documento:</span> {movement.referenceDocument}
                      </div>
                    )}

                    {movement.notes && (
                      <div className="text-sm bg-muted/50 p-2 rounded">
                        {movement.notes}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Realizado por: {movement.userName}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
