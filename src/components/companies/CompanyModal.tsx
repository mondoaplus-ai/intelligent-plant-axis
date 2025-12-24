import { useState, useEffect } from 'react';
import { Company, CompanyFormData } from '@/types/company';
import { useCompanyStore } from '@/lib/companyStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  mode: 'view' | 'edit' | 'add';
}

const emptyFormData: CompanyFormData = {
  code: '',
  name: '',
  tradeName: '',
  cnpj: '',
  stateRegistration: '',
  municipalRegistration: '',
  type: 'matriz',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  },
  phone: '',
  email: '',
  website: '',
  status: 'ativa',
};

export const CompanyModal = ({ open, onOpenChange, company, mode }: CompanyModalProps) => {
  const { addCompany, updateCompany, companies } = useCompanyStore();
  const [formData, setFormData] = useState<CompanyFormData>(emptyFormData);

  useEffect(() => {
    if (company && (mode === 'edit' || mode === 'view')) {
      setFormData({
        code: company.code,
        name: company.name,
        tradeName: company.tradeName,
        cnpj: company.cnpj,
        stateRegistration: company.stateRegistration,
        municipalRegistration: company.municipalRegistration,
        type: company.type,
        parentCompanyId: company.parentCompanyId,
        address: { ...company.address },
        phone: company.phone,
        email: company.email,
        website: company.website || '',
        status: company.status,
      });
    } else {
      setFormData(emptyFormData);
    }
  }, [company, mode]);

  const handleSubmit = () => {
    if (!formData.name || !formData.cnpj || !formData.code) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (mode === 'add') {
      addCompany(formData);
      toast.success('Empresa cadastrada com sucesso!');
    } else if (mode === 'edit' && company) {
      updateCompany(company.id, formData);
      toast.success('Empresa atualizada com sucesso!');
    }
    onOpenChange(false);
  };

  const isReadOnly = mode === 'view';
  const matrizOptions = companies.filter((c) => c.type === 'matriz');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' && 'Nova Empresa'}
            {mode === 'edit' && 'Editar Empresa'}
            {mode === 'view' && 'Detalhes da Empresa'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Dados Gerais</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={isReadOnly}
                  placeholder="EMP001"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'ativa' | 'inativa') =>
                    setFormData({ ...formData, status: value })
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="inativa">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Razão Social *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isReadOnly}
                placeholder="Razão social completa"
              />
            </div>

            <div className="space-y-2">
              <Label>Nome Fantasia</Label>
              <Input
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                disabled={isReadOnly}
                placeholder="Nome fantasia"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CNPJ *</Label>
                <Input
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  disabled={isReadOnly}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'matriz' | 'filial') =>
                    setFormData({ ...formData, type: value })
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matriz">Matriz</SelectItem>
                    <SelectItem value="filial">Filial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === 'filial' && (
              <div className="space-y-2">
                <Label>Empresa Matriz</Label>
                <Select
                  value={formData.parentCompanyId || ''}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentCompanyId: value })
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a matriz" />
                  </SelectTrigger>
                  <SelectContent>
                    {matrizOptions.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.tradeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Inscrição Estadual</Label>
                <Input
                  value={formData.stateRegistration}
                  onChange={(e) =>
                    setFormData({ ...formData, stateRegistration: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Inscrição Municipal</Label>
                <Input
                  value={formData.municipalRegistration}
                  onChange={(e) =>
                    setFormData({ ...formData, municipalRegistration: e.target.value })
                  }
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isReadOnly}
                  placeholder="(00) 0000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isReadOnly}
                  placeholder="contato@empresa.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={isReadOnly}
                placeholder="www.empresa.com"
              />
            </div>
          </TabsContent>

          <TabsContent value="address" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>CEP</Label>
              <Input
                value={formData.address.zipCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value },
                  })
                }
                disabled={isReadOnly}
                placeholder="00000-000"
                className="max-w-[200px]"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label>Logradouro</Label>
                <Input
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input
                  value={formData.address.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, number: e.target.value },
                    })
                  }
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Complemento</Label>
                <Input
                  value={formData.address.complement}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, complement: e.target.value },
                    })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input
                  value={formData.address.neighborhood}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, neighborhood: e.target.value },
                    })
                  }
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Cidade</Label>
                <Input
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                  disabled={isReadOnly}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {mode !== 'view' && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {mode === 'add' ? 'Cadastrar' : 'Salvar'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
