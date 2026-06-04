import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { BOM, BOMComponent, ProductionProcess } from '@/types/bom';
import { useProductsList } from '@/hooks/useProductsList';

interface BOMFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (bom: Omit<BOM, 'id' | 'createdAt' | 'updatedAt'>) => void;
  bom?: BOM;
  saving?: boolean;
}

export const BOMFormModal = ({ open, onClose, onSave, bom, saving }: BOMFormModalProps) => {
  const { data: products = [] } = useProductsList();
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    version: '1.0',
    status: 'em_revisao' as 'ativo' | 'inativo' | 'em_revisao',
    components: [] as BOMComponent[],
    processes: [] as ProductionProcess[],
    totalCost: 0,
    totalTime: 0,
    notes: '',
    createdBy: 'Admin',
  });

  const [newComponent, setNewComponent] = useState<Partial<BOMComponent>>({
    productName: '',
    quantity: 1,
    unit: 'un',
    waste: 0,
    cost: 0,
  });

  const [newProcess, setNewProcess] = useState<Partial<ProductionProcess>>({
    name: '',
    estimatedTime: 0,
    setupTime: 0,
    resourceName: '',
    description: '',
  });

  useEffect(() => {
    if (bom) {
      setFormData({
        productId: bom.productId,
        productName: bom.productName,
        version: bom.version,
        status: bom.status,
        components: bom.components,
        processes: bom.processes,
        totalCost: bom.totalCost,
        totalTime: bom.totalTime,
        notes: bom.notes || '',
        createdBy: bom.createdBy,
      });
    } else {
      setFormData({
        productId: '',
        productName: '',
        version: '1.0',
        status: 'em_revisao',
        components: [],
        processes: [],
        totalCost: 0,
        totalTime: 0,
        notes: '',
        createdBy: '',
      });
    }
  }, [bom, open]);

  const calculateTotals = (components: BOMComponent[], processes: ProductionProcess[]) => {
    const totalCost = components.reduce((sum, c) => sum + c.cost, 0);
    const totalTime = processes.reduce((sum, p) => sum + p.estimatedTime + p.setupTime, 0);
    return { totalCost, totalTime };
  };

  const handleAddComponent = () => {
    if (!newComponent.productName || !newComponent.quantity) return;

    const component: BOMComponent = {
      id: Date.now().toString(),
      productId: Date.now().toString(),
      productName: newComponent.productName || '',
      quantity: newComponent.quantity || 1,
      unit: newComponent.unit || 'un',
      waste: newComponent.waste || 0,
      cost: newComponent.cost || 0,
    };

    const updatedComponents = [...formData.components, component];
    const { totalCost, totalTime } = calculateTotals(updatedComponents, formData.processes);

    setFormData(prev => ({
      ...prev,
      components: updatedComponents,
      totalCost,
      totalTime,
    }));

    setNewComponent({
      productName: '',
      quantity: 1,
      unit: 'un',
      waste: 0,
      cost: 0,
    });
  };

  const handleRemoveComponent = (id: string) => {
    const updatedComponents = formData.components.filter(c => c.id !== id);
    const { totalCost, totalTime } = calculateTotals(updatedComponents, formData.processes);

    setFormData(prev => ({
      ...prev,
      components: updatedComponents,
      totalCost,
      totalTime,
    }));
  };

  const handleAddProcess = () => {
    if (!newProcess.name || !newProcess.estimatedTime) return;

    const process: ProductionProcess = {
      id: Date.now().toString(),
      name: newProcess.name || '',
      sequence: formData.processes.length + 1,
      estimatedTime: newProcess.estimatedTime || 0,
      setupTime: newProcess.setupTime || 0,
      resourceName: newProcess.resourceName,
      description: newProcess.description,
    };

    const updatedProcesses = [...formData.processes, process];
    const { totalCost, totalTime } = calculateTotals(formData.components, updatedProcesses);

    setFormData(prev => ({
      ...prev,
      processes: updatedProcesses,
      totalCost,
      totalTime,
    }));

    setNewProcess({
      name: '',
      estimatedTime: 0,
      setupTime: 0,
      resourceName: '',
      description: '',
    });
  };

  const handleRemoveProcess = (id: string) => {
    const updatedProcesses = formData.processes
      .filter(p => p.id !== id)
      .map((p, index) => ({ ...p, sequence: index + 1 }));
    const { totalCost, totalTime } = calculateTotals(formData.components, updatedProcesses);

    setFormData(prev => ({
      ...prev,
      processes: updatedProcesses,
      totalCost,
      totalTime,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.productName) return;
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{bom ? 'Editar Estrutura de Produto' : 'Nova Estrutura de Produto'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="geral" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
              <TabsTrigger value="componentes">Componentes ({formData.components.length})</TabsTrigger>
              <TabsTrigger value="processos">Processos ({formData.processes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Produto</Label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) => {
                      const p = products.find((x) => x.id === value);
                      setFormData({ ...formData, productId: value, productName: p?.name ?? '' });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.code} — {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Versão</Label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'ativo' | 'inativo' | 'em_revisao') => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_revisao">Em Revisão</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Input
                    value={formData.createdBy}
                    onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Notas sobre esta estrutura de produto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Custo Total Estimado</p>
                  <p className="text-2xl font-bold">R$ {formData.totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Total de Produção</p>
                  <p className="text-2xl font-bold">{formData.totalTime} minutos</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="componentes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Adicionar Componente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Componente/Matéria-Prima</Label>
                      <Input
                        value={newComponent.productName}
                        onChange={(e) => setNewComponent({ ...newComponent, productName: e.target.value })}
                        placeholder="Nome"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Quantidade</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newComponent.quantity}
                        onChange={(e) => setNewComponent({ ...newComponent, quantity: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Unidade</Label>
                      <Select
                        value={newComponent.unit}
                        onValueChange={(value) => setNewComponent({ ...newComponent, unit: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="un">UN</SelectItem>
                          <SelectItem value="kg">KG</SelectItem>
                          <SelectItem value="m">M</SelectItem>
                          <SelectItem value="l">L</SelectItem>
                          <SelectItem value="m2">M²</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Custo (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newComponent.cost}
                        onChange={(e) => setNewComponent({ ...newComponent, cost: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={handleAddComponent} className="w-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Componente</th>
                      <th className="text-right p-2">Quantidade</th>
                      <th className="text-center p-2">Unidade</th>
                      <th className="text-right p-2">Perda (%)</th>
                      <th className="text-right p-2">Custo</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.components.map((component) => (
                      <tr key={component.id} className="border-t">
                        <td className="p-2">{component.productName}</td>
                        <td className="text-right p-2">{component.quantity}</td>
                        <td className="text-center p-2">{component.unit}</td>
                        <td className="text-right p-2">{component.waste}%</td>
                        <td className="text-right p-2 font-medium">R$ {component.cost.toFixed(2)}</td>
                        <td className="p-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveComponent(component.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {formData.components.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-4 text-muted-foreground">
                          Nenhum componente adicionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="processos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Adicionar Processo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Nome do Processo</Label>
                      <Input
                        value={newProcess.name}
                        onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
                        placeholder="Ex: Corte"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tempo Est. (min)</Label>
                      <Input
                        type="number"
                        value={newProcess.estimatedTime}
                        onChange={(e) => setNewProcess({ ...newProcess, estimatedTime: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Setup (min)</Label>
                      <Input
                        type="number"
                        value={newProcess.setupTime}
                        onChange={(e) => setNewProcess({ ...newProcess, setupTime: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Recurso</Label>
                      <Input
                        value={newProcess.resourceName}
                        onChange={(e) => setNewProcess({ ...newProcess, resourceName: e.target.value })}
                        placeholder="Máquina/Operador"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={handleAddProcess} className="w-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-center p-2 w-12">Seq.</th>
                      <th className="text-left p-2">Processo</th>
                      <th className="text-right p-2">Tempo Est.</th>
                      <th className="text-right p-2">Setup</th>
                      <th className="text-left p-2">Recurso</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.processes.map((process) => (
                      <tr key={process.id} className="border-t">
                        <td className="text-center p-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {process.sequence}
                          </span>
                        </td>
                        <td className="p-2">{process.name}</td>
                        <td className="text-right p-2">{process.estimatedTime} min</td>
                        <td className="text-right p-2">{process.setupTime} min</td>
                        <td className="p-2 text-muted-foreground">{process.resourceName || '-'}</td>
                        <td className="p-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveProcess(process.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {formData.processes.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-4 text-muted-foreground">
                          Nenhum processo adicionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.productId || saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {bom ? 'Salvar Alterações' : 'Criar Ficha Técnica'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
