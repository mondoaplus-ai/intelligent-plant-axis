import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BOMFilters } from '@/components/engineering/BOMFilters';
import { BOMStats } from '@/components/engineering/BOMStats';
import { BOMTable } from '@/components/engineering/BOMTable';
import { BOMModal } from '@/components/engineering/BOMModal';
import { useBOMStore } from '@/lib/bomStore';
import { BOM } from '@/types/bom';
import { toast } from 'sonner';

export default function Engineering() {
  const { boms, deleteBOM } = useBOMStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredBOMs = boms.filter((bom) => {
    const matchesSearch = bom.productName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bom.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (bom: BOM) => {
    setSelectedBOM(bom);
    setModalOpen(true);
  };

  const handleEdit = (bom: BOM) => {
    toast.info('Função de edição será implementada em breve');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta estrutura de produto?')) {
      deleteBOM(id);
      toast.success('Estrutura de produto excluída com sucesso');
    }
  };

  const handleAdd = () => {
    toast.info('Função de adicionar BOM será implementada em breve');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Engenharia de Produto</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie estruturas de produto (BOM) e processos de fabricação
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Estrutura
        </Button>
      </div>

      <BOMStats boms={boms} />

      <div className="space-y-4">
        <BOMFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <BOMTable
          boms={filteredBOMs}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <BOMModal
        bom={selectedBOM}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBOM(null);
        }}
      />
    </div>
  );
}
