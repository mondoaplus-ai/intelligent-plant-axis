import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductionOrder, ProductionOrderStatus } from '@/types/productionOrder';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingOrder?: ProductionOrder | null;
}

export const OrderModal = ({ open, onClose, onSave, editingOrder }: OrderModalProps) => {
  const [formData, setFormData] = useState({
    orderNumber: '',
    productId: '1',
    productName: 'Parafuso M8x50',
    productCode: 'PAR-M8-50',
    quantityPlanned: 1000,
    quantityProduced: 0,
    quantityRejected: 0,
    unit: 'UN',
    status: 'Planejada' as ProductionOrderStatus,
    priority: 'Normal' as 'Baixa' | 'Normal' | 'Alta' | 'Urgente',
    machine: 'Torno CNC 01',
    operator: '',
    startDate: new Date().toISOString().slice(0, 16),
    expectedEndDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16),
    actualEndDate: '',
    setupTime: 0,
    productionTime: 0,
    stopTime: 0,
    efficiency: 0,
    aiOptimized: false,
    rawMaterials: [],
    appointments: [],
    timeline: [],
    notes: '',
    createdBy: 'Carlos Silva'
  });

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        orderNumber: editingOrder.orderNumber,
        productId: editingOrder.productId,
        productName: editingOrder.productName,
        productCode: editingOrder.productCode,
        quantityPlanned: editingOrder.quantityPlanned,
        quantityProduced: editingOrder.quantityProduced,
        quantityRejected: editingOrder.quantityRejected,
        unit: editingOrder.unit,
        status: editingOrder.status,
        priority: editingOrder.priority,
        machine: editingOrder.machine,
        operator: editingOrder.operator || '',
        startDate: editingOrder.startDate.slice(0, 16),
        expectedEndDate: editingOrder.expectedEndDate.slice(0, 16),
        actualEndDate: editingOrder.actualEndDate?.slice(0, 16) || '',
        setupTime: editingOrder.setupTime || 0,
        productionTime: editingOrder.productionTime || 0,
        stopTime: editingOrder.stopTime || 0,
        efficiency: editingOrder.efficiency || 0,
        aiOptimized: editingOrder.aiOptimized || false,
        rawMaterials: editingOrder.rawMaterials,
        appointments: editingOrder.appointments,
        timeline: editingOrder.timeline,
        notes: editingOrder.notes || '',
        createdBy: editingOrder.createdBy
      });
    } else {
      const nextNumber = `OP-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
      setFormData(prev => ({ ...prev, orderNumber: nextNumber }));
    }
  }, [editingOrder, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.orderNumber || !formData.productName || formData.quantityPlanned <= 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onSave(formData);
    toast.success(editingOrder ? 'OP atualizada com sucesso!' : 'OP criada com sucesso!');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {editingOrder ? 'Editar Ordem de Produção' : 'Nova Ordem de Produção'}
            {formData.aiOptimized && <Sparkles className="h-5 w-5 text-primary" />}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Dados Gerais</TabsTrigger>
              <TabsTrigger value="production">Produção</TabsTrigger>
              <TabsTrigger value="materials">Matéria-Prima</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Número OP *</Label>
                  <Input
                    id="orderNumber"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ProductionOrderStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planejada">Planejada</SelectItem>
                      <SelectItem value="Em Setup">Em Setup</SelectItem>
                      <SelectItem value="Produzindo">Produzindo</SelectItem>
                      <SelectItem value="Pausada">Pausada</SelectItem>
                      <SelectItem value="Concluída">Concluída</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">Produto *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productCode">Código</Label>
                  <Input
                    id="productCode"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantityPlanned">Qtd Planejada *</Label>
                  <Input
                    id="quantityPlanned"
                    type="number"
                    min="1"
                    value={formData.quantityPlanned}
                    onChange={(e) => setFormData({ ...formData, quantityPlanned: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">UN</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="machine">Máquina</Label>
                  <Input
                    id="machine"
                    value={formData.machine}
                    onChange={(e) => setFormData({ ...formData, machine: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operator">Operador</Label>
                  <Input
                    id="operator"
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Início</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedEndDate">Previsão Término</Label>
                  <Input
                    id="expectedEndDate"
                    type="datetime-local"
                    value={formData.expectedEndDate}
                    onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantityProduced">Qtd Produzida</Label>
                  <Input
                    id="quantityProduced"
                    type="number"
                    min="0"
                    value={formData.quantityProduced}
                    onChange={(e) => setFormData({ ...formData, quantityProduced: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantityRejected">Qtd Refugo</Label>
                  <Input
                    id="quantityRejected"
                    type="number"
                    min="0"
                    value={formData.quantityRejected}
                    onChange={(e) => setFormData({ ...formData, quantityRejected: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="setupTime">Tempo Setup (min)</Label>
                  <Input
                    id="setupTime"
                    type="number"
                    min="0"
                    value={formData.setupTime}
                    onChange={(e) => setFormData({ ...formData, setupTime: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productionTime">Tempo Produção (min)</Label>
                  <Input
                    id="productionTime"
                    type="number"
                    min="0"
                    value={formData.productionTime}
                    onChange={(e) => setFormData({ ...formData, productionTime: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopTime">Tempo Paradas (min)</Label>
                  <Input
                    id="stopTime"
                    type="number"
                    min="0"
                    value={formData.stopTime}
                    onChange={(e) => setFormData({ ...formData, stopTime: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efficiency">Eficiência (%)</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.efficiency}
                    onChange={(e) => setFormData({ ...formData, efficiency: Number(e.target.value) })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4 mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <p>Gerenciamento de matéria-prima será implementado em breve</p>
                <p className="text-sm mt-2">Por enquanto, use a aba de Dados Gerais</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingOrder ? 'Atualizar' : 'Criar'} OP
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
