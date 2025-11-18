import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { InventoryItem } from '@/types/inventory';
import { CheckCircle, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

interface InventoryDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InventoryItem;
}

const statusConfig = {
  normal: { label: 'Normal', icon: CheckCircle, variant: 'default' as const, color: 'text-green-500' },
  low: { label: 'Baixo', icon: AlertTriangle, variant: 'secondary' as const, color: 'text-yellow-500' },
  critical: { label: 'Crítico', icon: AlertCircle, variant: 'destructive' as const, color: 'text-red-500' },
  overstock: { label: 'Excesso', icon: TrendingUp, variant: 'outline' as const, color: 'text-blue-500' },
};

export const InventoryDetailModal = ({
  open,
  onOpenChange,
  item,
}: InventoryDetailModalProps) => {
  if (!item) return null;

  const config = statusConfig[item.status];
  const Icon = config.icon;
  const stockPercentage = Math.min((item.currentStock / item.maxStock) * 100, 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Inventário
            <Badge variant={config.variant} className="gap-1">
              <Icon className="h-3 w-3" />
              {config.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o item em estoque
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Produto */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Produto</h4>
            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4 bg-muted/50">
              <div>
                <span className="text-xs text-muted-foreground">Código</span>
                <p className="font-medium">{item.productCode}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Nome</span>
                <p className="font-medium">{item.productName}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Categoria</span>
                <p className="font-medium">{item.productCategory}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Unidade</span>
                <p className="font-medium">{item.unit}</p>
              </div>
            </div>
          </div>

          {/* Quantidades */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Quantidades</h4>
            <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Estoque Atual</span>
                  <p className="text-xl font-bold">{item.currentStock} {item.unit}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Disponível</span>
                  <p className="text-xl font-bold text-green-600">{item.availableStock} {item.unit}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Reservado</span>
                  <p className="text-xl font-bold text-orange-600">{item.reservedStock} {item.unit}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Nível de Estoque</span>
                  <span className="font-medium">{stockPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={stockPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {item.minStock}</span>
                  <span>Atual: {item.currentStock}</span>
                  <span>Max: {item.maxStock}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Valores</h4>
            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4 bg-muted/50">
              <div>
                <span className="text-xs text-muted-foreground">Custo Médio</span>
                <p className="font-medium">R$ {item.avgCost.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Valor Total</span>
                <p className="text-lg font-bold">
                  R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Localização e Datas */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Outras Informações</h4>
            <div className="border rounded-lg p-4 space-y-2 bg-muted/50">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Localização:</span>
                <span className="text-sm font-medium">{item.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Última Movimentação:</span>
                <span className="text-sm font-medium">
                  {format(item.lastMovement, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Última Atualização:</span>
                <span className="text-sm font-medium">
                  {format(item.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
