import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PriceFilters } from '@/components/prices/PriceFilters';
import { PriceStats } from '@/components/prices/PriceStats';
import { PriceTable } from '@/components/prices/PriceTable';
import { PriceModal } from '@/components/prices/PriceModal';
import { usePriceListStore } from '@/lib/priceListStore';
import { PriceListItem } from '@/types/priceList';
import { useToast } from '@/hooks/use-toast';

const PriceList = () => {
  const { toast } = useToast();
  const { prices, addPrice, updatePrice, deletePrice } = usePriceListStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceListItem | undefined>();

  const filteredPrices = prices.filter((price) => {
    const matchesSearch =
      price.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || price.status === statusFilter;
    const matchesCustomerType = customerTypeFilter === 'todos' || price.customerType === customerTypeFilter;
    
    return matchesSearch && matchesStatus && matchesCustomerType;
  });

  const handleEdit = (price: PriceListItem) => {
    setSelectedPrice(price);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deletePrice(id);
    toast({
      title: 'Preço excluído',
      description: 'O preço foi removido com sucesso.',
    });
  };

  const handleView = (price: PriceListItem) => {
    setSelectedPrice(price);
    setModalOpen(true);
  };

  const handleSave = (priceData: Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedPrice) {
      updatePrice(selectedPrice.id, priceData);
      toast({
        title: 'Preço atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    } else {
      addPrice(priceData);
      toast({
        title: 'Preço criado',
        description: 'O novo preço foi adicionado à tabela.',
      });
    }
    setSelectedPrice(undefined);
  };

  const handleNewPrice = () => {
    setSelectedPrice(undefined);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tabela de Preços</h1>
          <p className="text-muted-foreground">
            Gerencie preços, descontos e condições comerciais
          </p>
        </div>
        <Button onClick={handleNewPrice}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Preço
        </Button>
      </div>

      <PriceStats prices={prices} />

      <Card>
        <CardHeader>
          <CardTitle>Preços Cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PriceFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            customerTypeFilter={customerTypeFilter}
            onCustomerTypeFilterChange={setCustomerTypeFilter}
          />
          
          <PriceTable
            prices={filteredPrices}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </CardContent>
      </Card>

      <PriceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPrice(undefined);
        }}
        onSave={handleSave}
        price={selectedPrice}
      />
    </div>
  );
};

export default PriceList;
