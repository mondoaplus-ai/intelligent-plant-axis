import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { CustomerFilters as ICustomerFilters } from "@/types/customer";

interface CustomerFiltersProps {
  filters: ICustomerFilters;
  onFilterChange: (filters: Partial<ICustomerFilters>) => void;
  onClearFilters: () => void;
}

export const CustomerFilters = ({ filters, onFilterChange, onClearFilters }: CustomerFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, código, CPF/CNPJ..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.category}
        onValueChange={(value) => onFilterChange({ category: value as any })}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todas Categorias</SelectItem>
          <SelectItem value="A">Categoria A</SelectItem>
          <SelectItem value="B">Categoria B</SelectItem>
          <SelectItem value="C">Categoria C</SelectItem>
          <SelectItem value="D">Categoria D</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange({ status: value as any })}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos Status</SelectItem>
          <SelectItem value="Ativo">Ativo</SelectItem>
          <SelectItem value="Inativo">Inativo</SelectItem>
          <SelectItem value="Bloqueado">Bloqueado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) => onFilterChange({ type: value as any })}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todos">Todos Tipos</SelectItem>
          <SelectItem value="Pessoa Física">Pessoa Física</SelectItem>
          <SelectItem value="Pessoa Jurídica">Pessoa Jurídica</SelectItem>
        </SelectContent>
      </Select>

      {(filters.search || filters.category !== 'Todos' || filters.status !== 'Todos' || filters.type !== 'Todos') && (
        <Button variant="outline" onClick={onClearFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
