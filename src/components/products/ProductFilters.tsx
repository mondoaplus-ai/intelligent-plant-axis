import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProductStore } from '@/lib/productStore';
import { ProductCategory, ProductStatus, ProductType } from '@/types/product';

interface ProductFiltersProps {
  filteredCount: number;
}

export const ProductFilters = ({ filteredCount }: ProductFiltersProps) => {
  const { filters, setFilters, clearFilters } = useProductStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ category: value as ProductCategory | 'Todos' });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ status: value as ProductStatus | 'Todos' });
  };

  const handleTypeChange = (value: string) => {
    setFilters({ type: value as ProductType | 'Todos' });
  };

  const hasActiveFilters = filters.search || filters.category !== 'Todos' || filters.status !== 'Todos' || filters.type !== 'Todos';

  return (
    <div className="bg-card rounded-lg border p-4 mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, nome ou categoria..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas as Categorias</SelectItem>
            <SelectItem value="Matéria-Prima">Matéria-Prima</SelectItem>
            <SelectItem value="Produto Acabado">Produto Acabado</SelectItem>
            <SelectItem value="Embalagem">Embalagem</SelectItem>
            <SelectItem value="Componente">Componente</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Tipos</SelectItem>
            <SelectItem value="Fabricado">Fabricado</SelectItem>
            <SelectItem value="Comprado">Comprado</SelectItem>
            <SelectItem value="Revenda">Revenda</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredCount} {filteredCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </Badge>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
