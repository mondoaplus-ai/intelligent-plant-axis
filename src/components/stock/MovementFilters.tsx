import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MovementFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  reasonFilter: string;
  onReasonFilterChange: (value: string) => void;
}

export const MovementFilters = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  reasonFilter,
  onReasonFilterChange,
}: MovementFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por produto, documento..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Tipos</SelectItem>
          <SelectItem value="entrada">Entrada</SelectItem>
          <SelectItem value="saida">Saída</SelectItem>
          <SelectItem value="ajuste">Ajuste</SelectItem>
          <SelectItem value="transferencia">Transferência</SelectItem>
        </SelectContent>
      </Select>

      <Select value={reasonFilter} onValueChange={onReasonFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Motivo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Motivos</SelectItem>
          <SelectItem value="compra">Compra</SelectItem>
          <SelectItem value="venda">Venda</SelectItem>
          <SelectItem value="producao">Produção</SelectItem>
          <SelectItem value="devolucao">Devolução</SelectItem>
          <SelectItem value="perda">Perda</SelectItem>
          <SelectItem value="ajuste_inventario">Ajuste Inventário</SelectItem>
          <SelectItem value="transferencia_deposito">Transferência</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
