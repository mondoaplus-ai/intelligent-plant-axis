import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PriceListItem } from '@/types/priceList';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PriceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (price: Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  price?: PriceListItem;
}

export const PriceModal = ({ open, onClose, onSave, price }: PriceModalProps) => {
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    productCode: '',
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
    minQuantity: 1,
    maxQuantity: undefined as number | undefined,
    customerType: 'todos' as 'todos' | 'varejo' | 'atacado' | 'distribuidor',
    validFrom: new Date(),
    validUntil: undefined as Date | undefined,
    status: 'ativo' as 'ativo' | 'inativo' | 'agendado',
    createdBy: 'Admin',
    notes: '',
  });

  useEffect(() => {
    if (price) {
      setFormData({
        productId: price.productId,
        productName: price.productName,
        productCode: price.productCode,
        basePrice: price.basePrice,
        discount: price.discount,
        finalPrice: price.finalPrice,
        minQuantity: price.minQuantity,
        maxQuantity: price.maxQuantity,
        customerType: price.customerType,
        validFrom: price.validFrom,
        validUntil: price.validUntil,
        status: price.status,
        createdBy: price.createdBy,
        notes: price.notes || '',
      });
    }
  }, [price]);

  useEffect(() => {
    const finalPrice = formData.basePrice * (1 - formData.discount / 100);
    setFormData(prev => ({ ...prev, finalPrice }));
  }, [formData.basePrice, formData.discount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{price ? 'Editar Preço' : 'Novo Preço'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome do Produto</Label>
              <Input
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Código do Produto</Label>
              <Input
                value={formData.productCode}
                onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Preço Base (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Desconto (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label>Preço Final (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.finalPrice.toFixed(2)}
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Qtd. Mínima</Label>
              <Input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Qtd. Máxima</Label>
              <Input
                type="number"
                value={formData.maxQuantity || ''}
                onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="Ilimitado"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Cliente</Label>
              <Select
                value={formData.customerType}
                onValueChange={(value: any) => setFormData({ ...formData, customerType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="varejo">Varejo</SelectItem>
                  <SelectItem value="atacado">Atacado</SelectItem>
                  <SelectItem value="distribuidor">Distribuidor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Válido de</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.validFrom, 'dd/MM/yyyy', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.validFrom}
                    onSelect={(date) => date && setFormData({ ...formData, validFrom: date })}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Válido até</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.validUntil ? format(formData.validUntil, 'dd/MM/yyyy', { locale: ptBR }) : 'Sem limite'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.validUntil}
                    onSelect={(date) => setFormData({ ...formData, validUntil: date })}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="agendado">Agendado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {price ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
