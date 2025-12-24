import { useState, useEffect } from 'react';
import { User, UserFormData, roleLabels } from '@/types/user';
import { useUserStore } from '@/lib/userStore';
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
import { toast } from 'sonner';

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  mode: 'view' | 'edit' | 'add';
}

const emptyFormData: UserFormData = {
  name: '',
  email: '',
  username: '',
  role: 'operator',
  department: '',
  companyId: '',
  phone: '',
  status: 'ativo',
};

export const UserModal = ({ open, onOpenChange, user, mode }: UserModalProps) => {
  const { addUser, updateUser } = useUserStore();
  const { companies } = useCompanyStore();
  const [formData, setFormData] = useState<UserFormData>(emptyFormData);

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department,
        companyId: user.companyId,
        phone: user.phone || '',
        status: user.status,
      });
    } else {
      setFormData(emptyFormData);
    }
  }, [user, mode]);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.username) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (mode === 'add') {
      addUser(formData);
      toast.success('Usuário cadastrado com sucesso!');
    } else if (mode === 'edit' && user) {
      updateUser(user.id, formData);
      toast.success('Usuário atualizado com sucesso!');
    }
    onOpenChange(false);
  };

  const isReadOnly = mode === 'view';

  const departments = [
    'TI',
    'Produção',
    'Estoque',
    'Comercial',
    'Financeiro',
    'RH',
    'Qualidade',
    'Engenharia',
    'Logística',
    'Administrativo',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' && 'Novo Usuário'}
            {mode === 'edit' && 'Editar Usuário'}
            {mode === 'view' && 'Detalhes do Usuário'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Nome Completo *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isReadOnly}
              placeholder="Nome completo do usuário"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isReadOnly}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Usuário *</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={isReadOnly}
                placeholder="nome.sobrenome"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Perfil de Acesso</Label>
              <Select
                value={formData.role}
                onValueChange={(value: User['role']) =>
                  setFormData({ ...formData, role: value })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: User['status']) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.tradeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isReadOnly}
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

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
