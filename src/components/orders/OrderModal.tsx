import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Order, OrderItem, OrderStatus, OrderPriority, PaymentMethod, PaymentTerm } from '@/types/order';
import { useCustomersList } from '@/hooks/useCustomersList';
import { useProductsList } from '@/hooks/useProductsList';

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  order?: Order;
}

const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PED-${year}-${random}`;
};

export const OrderModal = ({ open, onClose, onSave, order }: OrderModalProps) => {
  const { data: customers = [] } = useCustomersList();
  const { data: products = [] } = useProductsList();
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerId: '',
    customerName: '',
    customerDocument: '',
    status: 'orcamento' as OrderStatus,
    priority: 'normal' as OrderPriority,
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    items: [] as OrderItem[],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    paymentMethod: undefined as PaymentMethod | undefined,
    paymentTerm: undefined as PaymentTerm | undefined,
    shippingAddress: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
    notes: '',
    internalNotes: '',
    seller: '',
  });

  const [newItem, setNewItem] = useState<Partial<OrderItem>>({
    productCode: '',
    productName: '',
    quantity: 1,
    unit: 'un',
    unitPrice: 0,
    discount: 0,
  });

  useEffect(() => {
    if (order) {
      setFormData({
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        customerName: order.customerName,
        customerDocument: order.customerDocument,
        status: order.status,
        priority: order.priority,
        orderDate: order.orderDate,
        expectedDelivery: order.expectedDelivery,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentTerm: order.paymentTerm,
        shippingAddress: {
          street: order.shippingAddress?.street || '',
          number: order.shippingAddress?.number || '',
          complement: order.shippingAddress?.complement || '',
          neighborhood: order.shippingAddress?.neighborhood || '',
          city: order.shippingAddress?.city || '',
          state: order.shippingAddress?.state || '',
          zipCode: order.shippingAddress?.zipCode || '',
        },
        notes: order.notes || '',
        internalNotes: order.internalNotes || '',
        seller: order.seller || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        orderNumber: generateOrderNumber(),
        items: [],
        subtotal: 0,
        discount: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      }));
    }
  }, [order, open]);

  const calculateTotals = (items: OrderItem[], discount: number, shipping: number, tax: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal - discount + shipping + tax;
    return { subtotal, total };
  };

  const handleAddItem = () => {
    if (!newItem.productName || !newItem.quantity || !newItem.unitPrice) return;

    const itemTotal = (newItem.quantity || 0) * (newItem.unitPrice || 0) * (1 - (newItem.discount || 0) / 100);
    const item: OrderItem = {
      id: Date.now().toString(),
      productId: (newItem as any).productId || Date.now().toString(),
      productCode: newItem.productCode || '',
      productName: newItem.productName || '',
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'un',
      unitPrice: newItem.unitPrice || 0,
      discount: newItem.discount || 0,
      total: itemTotal,
    };

    const updatedItems = [...formData.items, item];
    const { subtotal, total } = calculateTotals(updatedItems, formData.discount, formData.shipping, formData.tax);

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total,
    }));

    setNewItem({
      productCode: '',
      productName: '',
      quantity: 1,
      unit: 'un',
      unitPrice: 0,
      discount: 0,
    } as any);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = formData.items.filter(item => item.id !== itemId);
    const { subtotal, total } = calculateTotals(updatedItems, formData.discount, formData.shipping, formData.tax);

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? 'Editar Pedido' : 'Novo Pedido'} - {formData.orderNumber}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="dados" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dados">Dados Gerais</TabsTrigger>
              <TabsTrigger value="itens">Itens</TabsTrigger>
              <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
              <TabsTrigger value="entrega">Entrega</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => {
                      const c = customers.find((x) => x.id === value);
                      if (!c) return;
                      setFormData({
                        ...formData,
                        customerId: c.id,
                        customerName: c.name,
                        customerDocument: c.cpf_cnpj || '',
                        shippingAddress: {
                          street: c.street || '',
                          number: c.number || '',
                          complement: c.complement || '',
                          neighborhood: c.neighborhood || '',
                          city: c.city || '',
                          state: c.state || '',
                          zipCode: c.zip_code || '',
                        },
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={customers.length ? 'Selecione um cliente cadastrado' : 'Nenhum cliente cadastrado'} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}{c.cpf_cnpj ? ` — ${c.cpf_cnpj}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>CPF/CNPJ</Label>
                  <Input
                    value={formData.customerDocument}
                    onChange={(e) => setFormData({ ...formData, customerDocument: e.target.value })}
                    placeholder="000.000.000-00"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: OrderStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orcamento">Orçamento</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="producao">Em Produção</SelectItem>
                      <SelectItem value="faturado">Faturado</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: OrderPriority) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vendedor</Label>
                  <Input
                    value={formData.seller}
                    onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                    placeholder="Nome do vendedor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data do Pedido</Label>
                  <Input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Previsão de Entrega</Label>
                  <Input
                    type="date"
                    value={formData.expectedDelivery}
                    onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Observações do cliente"
                />
              </div>

              <div className="space-y-2">
                <Label>Observações Internas</Label>
                <Textarea
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  rows={2}
                  placeholder="Notas internas (não visíveis ao cliente)"
                />
              </div>
            </TabsContent>

            <TabsContent value="itens" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Adicionar Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-3 space-y-1">
                      <Label className="text-xs">Produto</Label>
                      <Select
                        value={(newItem as any).productId || ''}
                        onValueChange={(value) => {
                          const p = products.find((x) => x.id === value);
                          if (!p) return;
                          setNewItem({
                            ...newItem,
                            productId: p.id,
                            productCode: p.code,
                            productName: p.name,
                            unit: p.unit,
                            unitPrice: p.sale_price,
                          } as any);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={products.length ? 'Selecione um produto cadastrado' : 'Nenhum produto cadastrado'} />
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
                    <div className="space-y-1">
                      <Label className="text-xs">Qtd</Label>
                      <Input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Preço Unit.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={handleAddItem} className="w-full">
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
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Produto</th>
                      <th className="text-right p-2">Qtd</th>
                      <th className="text-right p-2">Preço Unit.</th>
                      <th className="text-right p-2">Total</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2">{item.productCode}</td>
                        <td className="p-2">{item.productName}</td>
                        <td className="text-right p-2">{item.quantity}</td>
                        <td className="text-right p-2">R$ {item.unitPrice.toFixed(2)}</td>
                        <td className="text-right p-2 font-medium">R$ {item.total.toFixed(2)}</td>
                        <td className="p-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {formData.items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-4 text-muted-foreground">
                          Nenhum item adicionado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {formData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Desconto:</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.discount}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0;
                        const { total } = calculateTotals(formData.items, discount, formData.shipping, formData.tax);
                        setFormData({ ...formData, discount, total });
                      }}
                      className="w-24 h-7 text-right"
                    />
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                    <span>Total:</span>
                    <span>R$ {formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pagamento" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Forma de Pagamento</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value: PaymentMethod) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prazo de Pagamento</Label>
                  <Select
                    value={formData.paymentTerm}
                    onValueChange={(value: PaymentTerm) => setFormData({ ...formData, paymentTerm: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a-vista">À Vista</SelectItem>
                      <SelectItem value="7-dias">7 Dias</SelectItem>
                      <SelectItem value="14-dias">14 Dias</SelectItem>
                      <SelectItem value="30-dias">30 Dias</SelectItem>
                      <SelectItem value="60-dias">60 Dias</SelectItem>
                      <SelectItem value="90-dias">90 Dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frete (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.shipping}
                    onChange={(e) => {
                      const shipping = parseFloat(e.target.value) || 0;
                      const { total } = calculateTotals(formData.items, formData.discount, shipping, formData.tax);
                      setFormData({ ...formData, shipping, total });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Impostos (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.tax}
                    onChange={(e) => {
                      const tax = parseFloat(e.target.value) || 0;
                      const { total } = calculateTotals(formData.items, formData.discount, formData.shipping, tax);
                      setFormData({ ...formData, tax, total });
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="entrega" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rua/Avenida</Label>
                  <Input
                    value={formData.shippingAddress.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, street: e.target.value }
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Número</Label>
                    <Input
                      value={formData.shippingAddress.number}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, number: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input
                      value={formData.shippingAddress.complement}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, complement: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    value={formData.shippingAddress.neighborhood}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, neighborhood: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={formData.shippingAddress.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>UF</Label>
                    <Input
                      value={formData.shippingAddress.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, state: e.target.value }
                      })}
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input
                      value={formData.shippingAddress.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress, zipCode: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={formData.items.length === 0}>
              {order ? 'Salvar Alterações' : 'Criar Pedido'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
