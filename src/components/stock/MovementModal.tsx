import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StockMovement, StockMovementFormData } from '@/types/stockMovement';
import { Badge } from '@/components/ui/badge';

interface MovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement?: StockMovement;
  onSave: (data: StockMovementFormData) => void;
  mode: 'view' | 'create';
}

export const MovementModal = ({ open, onOpenChange, movement, onSave, mode }: MovementModalProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<StockMovementFormData>();
  const selectedType = watch('type');

  useEffect(() => {
    if (movement && mode === 'view') {
      reset({
        type: movement.type,
        reason: movement.reason,
        productId: movement.productId,
        quantity: movement.quantity,
        unitCost: movement.unitCost,
        fromLocation: movement.fromLocation,
        toLocation: movement.toLocation,
        referenceDocument: movement.referenceDocument,
        notes: movement.notes,
      });
    } else if (mode === 'create') {
      reset({
        type: 'entrada',
        reason: 'compra',
        quantity: 0,
        unitCost: 0,
      });
    }
  }, [movement, mode, reset]);

  const onSubmit = (data: StockMovementFormData) => {
    onSave(data);
    onOpenChange(false);
    reset();
  };

  const isViewMode = mode === 'view';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isViewMode ? 'Detalhes da Movimentação' : 'Nova Movimentação'}
          </DialogTitle>
          <DialogDescription>
            {isViewMode
              ? 'Visualize os detalhes da movimentação de estoque'
              : 'Registre uma nova movimentação de estoque'}
          </DialogDescription>
        </DialogHeader>

        {isViewMode && movement ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data</Label>
                <p className="text-sm font-medium mt-1">
                  {format(movement.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div>
                <Label>Tipo</Label>
                <div className="mt-1">
                  <Badge>{movement.type}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Produto</Label>
                <p className="text-sm font-medium mt-1">{movement.productCode}</p>
                <p className="text-sm text-muted-foreground">{movement.productName}</p>
              </div>
              <div>
                <Label>Motivo</Label>
                <p className="text-sm font-medium mt-1">{movement.reason}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Quantidade</Label>
                <p className="text-sm font-medium mt-1">{movement.quantity}</p>
              </div>
              <div>
                <Label>Custo Unitário</Label>
                <p className="text-sm font-medium mt-1">
                  R$ {movement.unitCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <Label>Custo Total</Label>
                <p className="text-sm font-medium mt-1">
                  R$ {movement.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {(movement.fromLocation || movement.toLocation) && (
              <div className="grid grid-cols-2 gap-4">
                {movement.fromLocation && (
                  <div>
                    <Label>De</Label>
                    <p className="text-sm font-medium mt-1">{movement.fromLocation}</p>
                  </div>
                )}
                {movement.toLocation && (
                  <div>
                    <Label>Para</Label>
                    <p className="text-sm font-medium mt-1">{movement.toLocation}</p>
                  </div>
                )}
              </div>
            )}

            {movement.referenceDocument && (
              <div>
                <Label>Documento de Referência</Label>
                <p className="text-sm font-medium mt-1">{movement.referenceDocument}</p>
              </div>
            )}

            {movement.notes && (
              <div>
                <Label>Observações</Label>
                <p className="text-sm mt-1">{movement.notes}</p>
              </div>
            )}

            <div>
              <Label>Usuário</Label>
              <p className="text-sm font-medium mt-1">{movement.userName}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Movimentação *</Label>
                <Select onValueChange={(value) => setValue('type', value as any)} defaultValue="entrada">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                    <SelectItem value="ajuste">Ajuste</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo *</Label>
                <Select onValueChange={(value) => setValue('reason', value as any)} defaultValue="compra">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compra">Compra</SelectItem>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="producao">Produção</SelectItem>
                    <SelectItem value="devolucao">Devolução</SelectItem>
                    <SelectItem value="perda">Perda</SelectItem>
                    <SelectItem value="ajuste_inventario">Ajuste Inventário</SelectItem>
                    <SelectItem value="transferencia_deposito">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productId">ID do Produto *</Label>
              <Input id="productId" {...register('productId')} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  {...register('quantity', { valueAsNumber: true })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitCost">Custo Unitário *</Label>
                <Input
                  id="unitCost"
                  type="number"
                  step="0.01"
                  {...register('unitCost', { valueAsNumber: true })}
                  required
                />
              </div>
            </div>

            {(selectedType === 'saida' || selectedType === 'transferencia') && (
              <div className="space-y-2">
                <Label htmlFor="fromLocation">De (Localização)</Label>
                <Input id="fromLocation" {...register('fromLocation')} />
              </div>
            )}

            {(selectedType === 'entrada' || selectedType === 'transferencia' || selectedType === 'ajuste') && (
              <div className="space-y-2">
                <Label htmlFor="toLocation">Para (Localização)</Label>
                <Input id="toLocation" {...register('toLocation')} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="referenceDocument">Documento de Referência</Label>
              <Input id="referenceDocument" {...register('referenceDocument')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea id="notes" {...register('notes')} rows={3} />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Movimentação</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
