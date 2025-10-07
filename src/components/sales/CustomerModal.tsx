import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer, CustomerCategory, CustomerType, CustomerStatus } from "@/types/customer";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  customer?: Customer | null;
}

export const CustomerModal = ({ open, onClose, onSave, customer }: CustomerModalProps) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>({
    code: customer?.code || '',
    name: customer?.name || '',
    tradeName: customer?.tradeName || '',
    type: customer?.type || 'Pessoa Jurídica',
    category: customer?.category || 'C',
    status: customer?.status || 'Ativo',
    cpfCnpj: customer?.cpfCnpj || '',
    ie: customer?.ie || '',
    im: customer?.im || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    mobile: customer?.mobile || '',
    website: customer?.website || '',
    addresses: customer?.addresses || [],
    contacts: customer?.contacts || [],
    salesRep: customer?.salesRep || '',
    priceTable: customer?.priceTable || 'Tabela Padrão',
    paymentTerm: customer?.paymentTerm || 'À vista',
    creditLimit: customer?.creditLimit || 0,
    creditUsed: customer?.creditUsed || 0,
    totalPurchases: customer?.totalPurchases || 0,
    averageTicket: customer?.averageTicket || 0,
    lastPurchase: customer?.lastPurchase || undefined,
    purchases: customer?.purchases || [],
    notes: customer?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cpfCnpj || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onSave(formData);
    toast.success(customer ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
    onClose();
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'Comercial',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
          isDefault: formData.addresses.length === 0
        }
      ]
    });
  };

  const removeAddress = (id: string) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter(addr => addr.id !== id)
    });
  };

  const updateAddress = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.map(addr =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
              <TabsTrigger value="enderecos">Endereços</TabsTrigger>
              <TabsTrigger value="comercial">Comercial</TabsTrigger>
              <TabsTrigger value="observacoes">Observações</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: CustomerType) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
                      <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {formData.type === 'Pessoa Física' ? 'Nome Completo' : 'Razão Social'} *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {formData.type === 'Pessoa Jurídica' && (
                  <div className="space-y-2">
                    <Label htmlFor="tradeName">Nome Fantasia</Label>
                    <Input
                      id="tradeName"
                      value={formData.tradeName || ''}
                      onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">
                    {formData.type === 'Pessoa Física' ? 'CPF' : 'CNPJ'} *
                  </Label>
                  <Input
                    id="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                    required
                  />
                </div>

                {formData.type === 'Pessoa Jurídica' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="ie">Inscrição Estadual</Label>
                      <Input
                        id="ie"
                        value={formData.ie || ''}
                        onChange={(e) => setFormData({ ...formData, ie: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="im">Inscrição Municipal</Label>
                      <Input
                        id="im"
                        value={formData.im || ''}
                        onChange={(e) => setFormData({ ...formData, im: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Celular</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile || ''}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: CustomerCategory) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - Alto Valor</SelectItem>
                      <SelectItem value="B">B - Médio Valor</SelectItem>
                      <SelectItem value="C">C - Baixo Valor</SelectItem>
                      <SelectItem value="D">D - Mínimo Valor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: CustomerStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="enderecos" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Endereços</h3>
                <Button type="button" onClick={addAddress} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Endereço
                </Button>
              </div>

              {formData.addresses.map((address, index) => (
                <div key={address.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Endereço {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <Select
                        value={address.type}
                        onValueChange={(value) => updateAddress(address.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                          <SelectItem value="Entrega">Entrega</SelectItem>
                          <SelectItem value="Cobrança">Cobrança</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>CEP</Label>
                      <Input
                        value={address.zipCode}
                        onChange={(e) => updateAddress(address.id, 'zipCode', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Rua</Label>
                      <Input
                        value={address.street}
                        onChange={(e) => updateAddress(address.id, 'street', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Número</Label>
                      <Input
                        value={address.number}
                        onChange={(e) => updateAddress(address.id, 'number', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Complemento</Label>
                      <Input
                        value={address.complement || ''}
                        onChange={(e) => updateAddress(address.id, 'complement', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input
                        value={address.neighborhood}
                        onChange={(e) => updateAddress(address.id, 'neighborhood', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input
                        value={address.city}
                        onChange={(e) => updateAddress(address.id, 'city', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="comercial" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salesRep">Representante</Label>
                  <Input
                    id="salesRep"
                    value={formData.salesRep || ''}
                    onChange={(e) => setFormData({ ...formData, salesRep: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceTable">Tabela de Preços</Label>
                  <Select
                    value={formData.priceTable}
                    onValueChange={(value) => setFormData({ ...formData, priceTable: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tabela Padrão">Tabela Padrão</SelectItem>
                      <SelectItem value="Tabela A">Tabela A</SelectItem>
                      <SelectItem value="Tabela B">Tabela B</SelectItem>
                      <SelectItem value="Tabela C">Tabela C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerm">Condição de Pagamento</Label>
                  <Select
                    value={formData.paymentTerm}
                    onValueChange={(value) => setFormData({ ...formData, paymentTerm: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="À vista">À vista</SelectItem>
                      <SelectItem value="30 dias">30 dias</SelectItem>
                      <SelectItem value="30/60 dias">30/60 dias</SelectItem>
                      <SelectItem value="45 dias">45 dias</SelectItem>
                      <SelectItem value="60 dias">60 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Limite de Crédito (R$)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="observacoes" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={8}
                  placeholder="Adicione observações sobre o cliente..."
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {customer ? 'Atualizar' : 'Criar'} Cliente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
