import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export const UserFilters = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
}: UserFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou usuário..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={roleFilter} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Perfil" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Perfis</SelectItem>
          <SelectItem value="admin">Administrador</SelectItem>
          <SelectItem value="manager">Gerente</SelectItem>
          <SelectItem value="operator">Operador</SelectItem>
          <SelectItem value="viewer">Visualizador</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="ativo">Ativo</SelectItem>
          <SelectItem value="inativo">Inativo</SelectItem>
          <SelectItem value="bloqueado">Bloqueado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
