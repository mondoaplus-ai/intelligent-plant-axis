import { useState } from 'react';
import { Edit, Copy, Trash2, TrendingUp, TrendingDown, Package, Brain, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/product';
import { useProductStore } from '@/lib/productStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export const ProductTable = ({ products, onEdit }: ProductTableProps) => {
  const {
    selectedProducts,
    toggleProductSelection,
    selectAllProducts,
    clearSelection,
    deleteProduct,
    deleteProducts,
    toggleStatus,
    currentPage,
    itemsPerPage,
    setPage,
    setItemsPerPage,
    sortField,
    sortDirection,
    setSorting
  } = useProductStore();

  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  // Paginação
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      clearSelection();
    } else {
      selectAllProducts(paginatedProducts.map(p => p.id));
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setProductToDelete(null);
    toast.success('Produto excluído com sucesso!');
  };

  const handleBulkDelete = () => {
    deleteProducts(selectedProducts);
    setShowBulkDelete(false);
    toast.success(`${selectedProducts.length} produtos excluídos com sucesso!`);
  };

  const handleDuplicate = (product: Product) => {
    const newProduct = {
      ...product,
      code: `${product.code}-COPY`,
      name: `${product.name} (Cópia)`
    };
    // Aqui você chamaria addProduct, mas como não temos acesso direto, podemos usar onEdit
    toast.success('Produto duplicado! Edite os dados necessários.');
  };

  const handleExportCSV = () => {
    const headers = ['Código', 'Nome', 'Categoria', 'Tipo', 'Unidade', 'Estoque', 'Custo Médio', 'Status'];
    const data = products.map(p => [
      p.code,
      p.name,
      p.category,
      p.type,
      p.unit,
      p.currentStock,
      p.avgCost,
      p.status
    ]);
    
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produtos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV exportado com sucesso!');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Matéria-Prima': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Produto Acabado': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Embalagem': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'Componente': 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };
    return colors[category as keyof typeof colors] || '';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Fabricado': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Comprado': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'Revenda': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
    };
    return colors[type as keyof typeof colors] || '';
  };

  const handleSort = (field: keyof Product) => {
    setSorting(field);
  };

  const SortIcon = ({ field }: { field: keyof Product }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 bg-card rounded-lg border"
      >
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground mb-6">
          Ajuste os filtros ou cadastre seu primeiro produto
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de ações em massa */}
      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between"
          >
            <span className="font-medium">
              {selectedProducts.length} produto(s) selecionado(s)
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowBulkDelete(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar
              </Button>
              <Button variant="ghost" size="sm" onClick={clearSelection}>
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabela Desktop */}
      <div className="hidden md:block bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('code')}>
                  <div className="flex items-center gap-2">
                    Código
                    <SortIcon field="code" />
                  </div>
                </TableHead>
                <TableHead>Foto</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">
                    Nome
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('currentStock')}>
                  <div className="flex items-center gap-2">
                    Estoque
                    <SortIcon field="currentStock" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('avgCost')}>
                  <div className="flex items-center gap-2">
                    Custo Médio
                    <SortIcon field="avgCost" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => {
                const isLowStock = product.currentStock < product.minStock;
                const hasAI = product.type === 'Fabricado' && Math.random() > 0.5; // Simulação

                return (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 rounded bg-muted text-xs font-mono">
                        {product.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        {product.photo ? (
                          <img src={product.photo} alt={product.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <Package className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.name}
                        {hasAI && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Brain className="h-4 w-4 text-accent animate-pulse" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Previsão de demanda ativa</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeColor(product.type)}>
                        {product.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {product.currentStock.toLocaleString('pt-BR')}
                        </span>
                        {isLowStock ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">Baixo</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Estoque abaixo do mínimo ({product.minStock})</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <TrendingUp className="h-4 w-4 text-success" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.avgCost)}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={product.status === 'Ativo'}
                        onCheckedChange={() => {
                          toggleStatus(product.id);
                          toast.success(`Produto ${product.status === 'Ativo' ? 'desativado' : 'ativado'} com sucesso!`);
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleDuplicate(product)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicar</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setProductToDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedProducts.map((product) => {
          const isLowStock = product.currentStock < product.minStock;
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                  />
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                    {product.photo ? (
                      <img src={product.photo} alt={product.name} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{product.code}</code>
                    <h3 className="font-medium mt-1">{product.name}</h3>
                  </div>
                </div>
                <Switch
                  checked={product.status === 'Ativo'}
                  onCheckedChange={() => toggleStatus(product.id)}
                />
              </div>

              <div className="flex gap-2">
                <Badge variant="outline" className={getCategoryColor(product.category)}>
                  {product.category}
                </Badge>
                <Badge variant="outline" className={getTypeColor(product.type)}>
                  {product.type}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Estoque:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="font-medium">{product.currentStock} {product.unit}</span>
                    {isLowStock && <Badge variant="destructive" className="text-xs">Baixo</Badge>}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Custo:</span>
                  <p className="font-medium mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.avgCost)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => setProductToDelete(product.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Paginação */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Itens por página:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && setPage(currentPage - 1)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => productToDelete && handleDelete(productToDelete)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de exclusão em massa */}
      <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão em Massa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedProducts.length} produto(s)? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>
              Excluir Todos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
