import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MovementFilters } from '@/components/stock/MovementFilters';
import { MovementStats } from '@/components/stock/MovementStats';
import { MovementTable } from '@/components/stock/MovementTable';
import { MovementModal } from '@/components/stock/MovementModal';
import { useStockMovementStore } from '@/lib/stockMovementStore';
import { useProductStore } from '@/lib/productStore';
import { StockMovement, StockMovementFormData } from '@/types/stockMovement';
import { useToast } from '@/hooks/use-toast';

export default function StockMovements() {
  const { toast } = useToast();
  const { movements, addMovement, deleteMovement } = useStockMovementStore();
  const { products } = useProductStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create'>('create');
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | undefined>();

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const matchesSearch =
        movement.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.referenceDocument?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || movement.type === typeFilter;
      const matchesReason = reasonFilter === 'all' || movement.reason === reasonFilter;

      return matchesSearch && matchesType && matchesReason;
    });
  }, [movements, searchTerm, typeFilter, reasonFilter]);

  const handleView = (movement: StockMovement) => {
    setSelectedMovement(movement);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
      deleteMovement(id);
      toast({
        title: 'Movimentação excluída',
        description: 'A movimentação foi excluída com sucesso.',
      });
    }
  };

  const handleSave = (data: StockMovementFormData) => {
    const product = products.find(p => p.id === data.productId);
    
    if (!product) {
      toast({
        title: 'Erro',
        description: 'Produto não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    const newMovement = {
      ...data,
      date: new Date(),
      productCode: product.code,
      productName: product.name,
      totalCost: data.quantity * data.unitCost,
      userId: '1',
      userName: 'Usuário Atual',
    };

    addMovement(newMovement);
    
    toast({
      title: 'Movimentação registrada',
      description: 'A movimentação foi registrada com sucesso.',
    });
  };

  const handleNewMovement = () => {
    setSelectedMovement(undefined);
    setModalMode('create');
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movimentações de Estoque</h1>
          <p className="text-muted-foreground">
            Gerencie entradas, saídas e transferências de estoque
          </p>
        </div>
        <Button onClick={handleNewMovement}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>

      <MovementStats movements={movements} />

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as movimentações de estoque
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MovementFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            reasonFilter={reasonFilter}
            onReasonFilterChange={setReasonFilter}
          />
          <MovementTable
            movements={filteredMovements}
            onView={handleView}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <MovementModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        movement={selectedMovement}
        onSave={handleSave}
        mode={modalMode}
      />
    </div>
  );
}
