import { User, roleLabels, statusLabels } from '@/types/user';
import { useUserStore } from '@/lib/userStore';
import { useCompanyStore } from '@/lib/companyStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserTableProps {
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

export const UserTable = ({
  onView,
  onEdit,
  onDelete,
  searchTerm,
  roleFilter,
  statusFilter,
}: UserTableProps) => {
  const { users } = useUserStore();
  const { getCompanyById } = useCompanyStore();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: User['status']) => {
    const variants: Record<User['status'], 'default' | 'secondary' | 'destructive'> = {
      ativo: 'default',
      inativo: 'secondary',
      bloqueado: 'destructive',
    };
    return <Badge variant={variants[status]}>{statusLabels[status]}</Badge>;
  };

  const getRoleBadge = (role: User['role']) => {
    const colors: Record<User['role'], string> = {
      admin: 'bg-red-500/10 text-red-500',
      manager: 'bg-blue-500/10 text-blue-500',
      operator: 'bg-green-500/10 text-green-500',
      viewer: 'bg-gray-500/10 text-gray-500',
    };
    return (
      <Badge variant="outline" className={colors[role]}>
        {roleLabels[role]}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => {
              const company = getCompanyById(user.companyId);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{company?.tradeName || '-'}</TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? format(new Date(user.lastLogin), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                      : 'Nunca acessou'}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => onView(user)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(user)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDelete(user)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
