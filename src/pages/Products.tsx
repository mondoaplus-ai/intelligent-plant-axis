import { useState, useMemo } from 'react';
import { Plus, Download, Upload, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductStats } from '@/components/products/ProductStats';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductModal } from '@/components/products/ProductModal';
import { ProductStockAlert } from '@/components/products/ProductStockAlert';
import { ProductImportModal } from '@/components/products/ProductImportModal';
import { ProductMovementHistory } from '@/components/products/ProductMovementHistory';
import { useProductStore } from '@/lib/productStore';
import { useProducts, useCreateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Products() {
  const { filters, sortField, sortDirection } = useProductStore();
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.code.toLowerCase().includes(searchLower) ||
          p.name.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de categoria
    if (filters.category !== 'Todos') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filtro de status
    if (filters.status !== 'Todos') {
      result = result.filter((p) => p.status === filters.status);
    }

    // Filtro de tipo
    if (filters.type !== 'Todos') {
      result = result.filter((p) => p.type === filters.type);
    }

    // Ordenação
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [products, filters, sortField, sortDirection]);

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleExportAll = () => {
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
    link.download = `produtos-completo-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('CSV exportado com sucesso!');
  };

  const handleImport = (importedProducts: any[]) => {
    importedProducts.forEach(product => {
      addProduct(product);
    });
  };

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product);
    setIsHistoryModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Cadastro e controle completo de produtos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button onClick={handleNewProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Alertas de Estoque */}
      <ProductStockAlert products={products} onViewProduct={handleEditProduct} />

      {/* Estatísticas */}
      <ProductStats products={products} />

      {/* Filtros */}
      <ProductFilters filteredCount={filteredProducts.length} />

      {/* Tabela */}
      <ProductTable products={filteredProducts} onEdit={handleEditProduct} />

      {/* Modals */}
      <ProductModal
        open={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />

      <ProductImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImport={handleImport}
      />

      <ProductMovementHistory
        open={isHistoryModalOpen}
        onOpenChange={setIsHistoryModalOpen}
        productId={selectedProduct?.id}
        productName={selectedProduct?.name}
      />
    </motion.div>
  );
}
