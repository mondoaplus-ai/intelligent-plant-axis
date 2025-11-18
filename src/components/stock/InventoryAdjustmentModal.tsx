import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InventoryItem, InventoryAdjustment } from '@/types/inventory';

const adjustmentSchema = z.object({
  physicalCount: z.coerce.number().min(0, 'Quantidade deve ser maior ou igual a 0'),
  reason: z.string().min(1, 'Selecione um motivo'),
  notes: z.string().optional(),
});

interface InventoryAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InventoryItem;
  onSave: (adjustment: InventoryAdjustment) => void;
}

export const InventoryAdjustmentModal = ({
  open,
  onOpenChange,
  item,
  onSave,
}: InventoryAdjustmentModalProps) => {
  const [difference, setDifference] = useState(0);

  const form = useForm<z.infer<typeof adjustmentSchema>>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      physicalCount: item?.currentStock || 0,
      reason: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        physicalCount: item.currentStock,
        reason: '',
        notes: '',
      });
      setDifference(0);
    }
  }, [item, form]);

  const watchPhysicalCount = form.watch('physicalCount');

  useEffect(() => {
    if (item) {
      const diff = watchPhysicalCount - item.currentStock;
      setDifference(diff);
    }
  }, [watchPhysicalCount, item]);

  const onSubmit = (data: z.infer<typeof adjustmentSchema>) => {
    if (!item) return;

    const adjustment: InventoryAdjustment = {
      productId: item.productId,
      physicalCount: data.physicalCount,
      systemCount: item.currentStock,
      difference,
      reason: data.reason,
      notes: data.notes,
    };

    onSave(adjustment);
    onOpenChange(false);
    form.reset();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajustar Estoque</DialogTitle>
          <DialogDescription>
            Realize o ajuste de estoque para o produto {item.productCode}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 border rounded-lg p-4 bg-muted/50">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Produto:</span>
            <span className="text-sm">{item.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Estoque Atual (Sistema):</span>
            <span className="text-sm font-bold">{item.currentStock} {item.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Localização:</span>
            <span className="text-sm">{item.location}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="physicalCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contagem Física *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantidade contada"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {difference !== 0 && (
              <div className={`p-3 rounded-lg ${difference > 0 ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'}`}>
                <div className="text-sm font-medium">
                  Diferença: {difference > 0 ? '+' : ''}{difference} {item.unit}
                </div>
                <div className="text-xs mt-1">
                  {difference > 0 ? 'Entrada será registrada' : 'Saída será registrada'}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do Ajuste *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inventario">Inventário Físico</SelectItem>
                      <SelectItem value="divergencia">Correção de Divergência</SelectItem>
                      <SelectItem value="perda">Perda/Quebra</SelectItem>
                      <SelectItem value="devolucao">Devolução</SelectItem>
                      <SelectItem value="erro_sistema">Erro de Sistema</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações sobre o ajuste..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={difference === 0}>
                Confirmar Ajuste
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
