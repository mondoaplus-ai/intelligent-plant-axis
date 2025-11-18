import { useState, useMemo } from 'react';
import { FileDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryFilters } from '@/components/stock/InventoryFilters';
import { InventoryStats } from '@/components/stock/InventoryStats';
import { InventoryTable } from '@/components/stock/InventoryTable';
import { InventoryDetailModal } from '@/components/stock/InventoryDetailModal';
import { InventoryAdjustmentModal } from '@/components/stock/InventoryAdjustmentModal';
import { useInventoryStore } from '@/lib/inventoryStore';
import { InventoryItem, InventoryAdjustment } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';

export default function StockInventory() {
  const { toast } = useToast();
  const { items, adjustInventory } = useInventoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || item.productCategory === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, searchTerm, statusFilter, categoryFilter]);

  const lowStockCount = items.filter(i => i.status === 'low' || i.status === 'critical').length;

  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustModalOpen(true);
  };

  const handleSaveAdjustment = (adjustment: InventoryAdjustment) => {
    adjustInventory(adjustment);
    
    const diffText = adjustment.difference > 0 
      ? `+${adjustment.difference}` 
      : adjustment.difference.toString();
    
    toast({
      title: 'Estoque ajustado',
      description: `Ajuste de ${diffText} unidades registrado com sucesso.`,
    });
  };

  const handleExport = () => {
    toast({
      title: 'Exportar inventário',
      description: 'Funcionalidade de exportação em desenvolvimento.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventário</h1>
          <p className="text-muted-foreground">
            Controle de estoque e níveis de produtos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {lowStockCount > 0 && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-base">Atenção: Produtos com Estoque Baixo</CardTitle>
            </div>
            <CardDescription>
              {lowStockCount} {lowStockCount === 1 ? 'produto precisa' : 'produtos precisam'} de reposição
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <InventoryStats items={items} />

      <Card>
        <CardHeader>
          <CardTitle>Controle de Inventário</CardTitle>
          <CardDescription>
            Visualize e gerencie os níveis de estoque de todos os produtos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InventoryFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
          />
          <InventoryTable
            items={filteredItems}
            onView={handleView}
            onAdjust={handleAdjust}
          />
        </CardContent>
      </Card>

      <InventoryDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        item={selectedItem}
      />

      <InventoryAdjustmentModal
        open={adjustModalOpen}
        onOpenChange={setAdjustModalOpen}
        item={selectedItem}
        onSave={handleSaveAdjustment}
      />
    </div>
  );
}
