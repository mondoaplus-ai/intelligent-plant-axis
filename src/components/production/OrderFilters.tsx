import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ProductionOrderStatus } from '@/types/productionOrder';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProductionOrderStatus | 'all';
  onStatusFilterChange: (value: ProductionOrderStatus | 'all') => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
}

export const OrderFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange
}: OrderFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por OP, produto, máquina..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="Planejada">Planejada</SelectItem>
          <SelectItem value="Em Setup">Em Setup</SelectItem>
          <SelectItem value="Produzindo">Produzindo</SelectItem>
          <SelectItem value="Pausada">Pausada</SelectItem>
          <SelectItem value="Concluída">Concluída</SelectItem>
          <SelectItem value="Cancelada">Cancelada</SelectItem>
        </SelectContent>
      </Select>

      <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Prioridades</SelectItem>
          <SelectItem value="Urgente">Urgente</SelectItem>
          <SelectItem value="Alta">Alta</SelectItem>
          <SelectItem value="Normal">Normal</SelectItem>
          <SelectItem value="Baixa">Baixa</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
