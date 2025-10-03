import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Product, ProductCategory, ProductType, ProductUnit, ProductSupplier } from '@/types/product';
import { useProductStore } from '@/lib/productStore';
import { toast } from 'sonner';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const ProductModal = ({ open, onClose, product }: ProductModalProps) => {
  const { addProduct, updateProduct } = useProductStore();
  const isEditing = !!product;

  const [formData, setFormData] = useState<Partial<Product>>({
    code: '',
    name: '',
    category: 'Produto Acabado',
    type: 'Fabricado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    avgCost: 0,
    suppliers: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      // Gerar código automático para novo produto
      setFormData({
        code: `PROD${Date.now().toString().slice(-6)}`,
        name: '',
        category: 'Produto Acabado',
        type: 'Fabricado',
        unit: 'UN',
        status: 'Ativo',
        currentStock: 0,
        minStock: 0,
        maxStock: 0,
        avgCost: 0,
        suppliers: []
      });
    }
    setErrors({});
  }, [product, open]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo é obrigatório';
    }

    if (formData.minStock && formData.maxStock && formData.minStock > formData.maxStock) {
      newErrors.minStock = 'Estoque mínimo não pode ser maior que o máximo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    if (isEditing && product) {
      updateProduct(product.id, formData);
      toast.success('Produto atualizado com sucesso!');
    } else {
      addProduct(formData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Produto cadastrado com sucesso!');
    }

    onClose();
  };

  const handleAddSupplier = () => {
    const newSupplier: ProductSupplier = {
      id: Date.now().toString(),
      supplierId: '',
      supplierName: '',
      supplierCode: '',
      price: 0,
      deliveryDays: 0
    };
    
    setFormData(prev => ({
      ...prev,
      suppliers: [...(prev.suppliers || []), newSupplier]
    }));
  };

  const handleRemoveSupplier = (id: string) => {
    setFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers?.filter(s => s.id !== id) || []
    }));
  };

  const handleSupplierChange = (id: string, field: keyof ProductSupplier, value: any) => {
    setFormData(prev => ({
      ...prev,
      suppliers: prev.suppliers?.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ) || []
    }));
  };

  const showProductionTab = formData.type === 'Fabricado';
  const showSuppliersTab = formData.type === 'Comprado' || formData.type === 'Revenda';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
            <TabsTrigger value="estoque">Estoque & Custos</TabsTrigger>
            {showProductionTab && <TabsTrigger value="producao">Produção</TabsTrigger>}
            {showSuppliersTab && <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>}
          </TabsList>

          <TabsContent value="geral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                <div>
                  <Label>Foto do Produto</Label>
                  <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Arraste uma imagem ou clique para selecionar
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Código *</Label>
                  <Input
                    value={formData.code}
                    disabled={isEditing}
                    onChange={(e) => handleChange('code', e.target.value)}
                    className="mt-2 font-mono"
                  />
                </div>

                <div>
                  <Label>Nome do Produto *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-2"
                    placeholder="Digite o nome do produto"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => handleChange('category', v as ProductCategory)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matéria-Prima">Matéria-Prima</SelectItem>
                      <SelectItem value="Produto Acabado">Produto Acabado</SelectItem>
                      <SelectItem value="Embalagem">Embalagem</SelectItem>
                      <SelectItem value="Componente">Componente</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <Label>Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => handleChange('type', v as ProductType)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fabricado">Fabricado</SelectItem>
                      <SelectItem value="Comprado">Comprado</SelectItem>
                      <SelectItem value="Revenda">Revenda</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive mt-1">{errors.type}</p>
                  )}
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                <div>
                  <Label>Unidade de Medida</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(v) => handleChange('unit', v as ProductUnit)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">UN - Unidade</SelectItem>
                      <SelectItem value="KG">KG - Quilograma</SelectItem>
                      <SelectItem value="M">M - Metro</SelectItem>
                      <SelectItem value="L">L - Litro</SelectItem>
                      <SelectItem value="M²">M² - Metro Quadrado</SelectItem>
                      <SelectItem value="M³">M³ - Metro Cúbico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>NCM</Label>
                  <Input
                    value={formData.ncm || ''}
                    onChange={(e) => handleChange('ncm', e.target.value)}
                    className="mt-2"
                    placeholder="0000.00.00"
                    maxLength={10}
                  />
                </div>

                <div>
                  <Label>Código de Barras</Label>
                  <Input
                    value={formData.barcode || ''}
                    onChange={(e) => handleChange('barcode', e.target.value)}
                    className="mt-2"
                    placeholder="7891234567890"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Label htmlFor="status">Status</Label>
                  <Switch
                    id="status"
                    checked={formData.status === 'Ativo'}
                    onCheckedChange={(checked) => handleChange('status', checked ? 'Ativo' : 'Inativo')}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="estoque" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Estoque Mínimo
                </Label>
                <Input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleChange('minStock', Number(e.target.value))}
                  className="mt-2"
                />
                {errors.minStock && (
                  <p className="text-sm text-destructive mt-1">{errors.minStock}</p>
                )}
              </div>

              <div>
                <Label>Estoque Máximo</Label>
                <Input
                  type="number"
                  value={formData.maxStock}
                  onChange={(e) => handleChange('maxStock', Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Estoque Atual</Label>
                <Input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => handleChange('currentStock', Number(e.target.value))}
                  className="mt-2"
                  readOnly={isEditing}
                />
                {isEditing && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Altere via movimentações de estoque
                  </p>
                )}
              </div>

              <div>
                <Label>Custo Médio (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.avgCost}
                  onChange={(e) => handleChange('avgCost', Number(e.target.value))}
                  className="mt-2"
                  readOnly={isEditing}
                />
                {isEditing && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculado automaticamente
                  </p>
                )}
              </div>

              <div>
                <Label>Peso Líquido</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.netWeight || ''}
                    onChange={(e) => handleChange('netWeight', Number(e.target.value))}
                    className="flex-1"
                  />
                  <Select
                    value={formData.weightUnit || 'KG'}
                    onValueChange={(v) => handleChange('weightUnit', v)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="G">G</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Peso Bruto</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.grossWeight || ''}
                    onChange={(e) => handleChange('grossWeight', Number(e.target.value))}
                    className="flex-1"
                  />
                  <Select
                    value={formData.weightUnit || 'KG'}
                    onValueChange={(v) => handleChange('weightUnit', v)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="G">G</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {showProductionTab && (
            <TabsContent value="producao" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tempo de Produção</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="number"
                      value={formData.productionTime || ''}
                      onChange={(e) => handleChange('productionTime', Number(e.target.value))}
                      className="flex-1"
                    />
                    <Select
                      value={formData.productionTimeUnit || 'min'}
                      onValueChange={(v) => handleChange('productionTimeUnit', v)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="min">Minutos</SelectItem>
                        <SelectItem value="hora">Horas</SelectItem>
                        <SelectItem value="dia">Dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Rendimento (%)</Label>
                  <Input
                    type="number"
                    max="100"
                    value={formData.yield || ''}
                    onChange={(e) => handleChange('yield', Number(e.target.value))}
                    className="mt-2"
                    placeholder="Quanto 1kg MP gera de PA"
                  />
                </div>

                <div>
                  <Label>Lead Time (dias)</Label>
                  <Input
                    type="number"
                    value={formData.leadTime || ''}
                    onChange={(e) => handleChange('leadTime', Number(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Setup de Máquina (minutos)</Label>
                  <Input
                    type="number"
                    value={formData.setupTime || ''}
                    onChange={(e) => handleChange('setupTime', Number(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Observações de Produção</Label>
                  <Textarea
                    value={formData.productionNotes || ''}
                    onChange={(e) => handleChange('productionNotes', e.target.value)}
                    className="mt-2"
                    rows={4}
                    placeholder="Informações adicionais sobre o processo produtivo..."
                  />
                </div>
              </div>
            </TabsContent>
          )}

          {showSuppliersTab && (
            <TabsContent value="fornecedores" className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Fornecedores Vinculados</Label>
                <Button onClick={handleAddSupplier} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Fornecedor
                </Button>
              </div>

              {formData.suppliers && formData.suppliers.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Prazo</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.suppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell>
                            <Input
                              value={supplier.supplierName}
                              onChange={(e) => handleSupplierChange(supplier.id, 'supplierName', e.target.value)}
                              placeholder="Nome do fornecedor"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={supplier.supplierCode}
                              onChange={(e) => handleSupplierChange(supplier.id, 'supplierCode', e.target.value)}
                              placeholder="Código"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              step="0.01"
                              value={supplier.price}
                              onChange={(e) => handleSupplierChange(supplier.id, 'price', Number(e.target.value))}
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={supplier.deliveryDays}
                              onChange={(e) => handleSupplierChange(supplier.id, 'deliveryDays', Number(e.target.value))}
                              placeholder="Dias"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSupplier(supplier.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <p className="text-muted-foreground">Nenhum fornecedor adicionado</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Atualizar' : 'Cadastrar'} Produto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
