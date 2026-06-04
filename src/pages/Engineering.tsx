import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { BOMFilters } from '@/components/engineering/BOMFilters';
import { BOMStats } from '@/components/engineering/BOMStats';
import { BOMTable } from '@/components/engineering/BOMTable';
import { BOMModal } from '@/components/engineering/BOMModal';
import { BOMFormModal } from '@/components/engineering/BOMFormModal';
import { useBOMs, useCreateBOM, useUpdateBOM, useDeleteBOM } from '@/hooks/useBOMs';
import { useUserRole } from '@/hooks/useUserRole';
import { BOM } from '@/types/bom';
import { toast } from 'sonner';

export default function Engineering() {
  const { data: boms = [], isLoading } = useBOMs();
  const createBOM = useCreateBOM();
  const updateBOM = useUpdateBOM();
  const deleteBOM = useDeleteBOM();
  const { canEdit, canDelete } = useUserRole();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingBOM, setEditingBOM] = useState<BOM | undefined>();

  const filteredBOMs = boms.filter((bom) => {
    const matchesSearch = bom.productName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bom.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (bom: BOM) => {
    setSelectedBOM(bom);
    setViewModalOpen(true);
  };

  const handleEdit = (bom: BOM) => {
    if (!canEdit) return toast.error('Você não tem permissão para editar fichas técnicas');
    setEditingBOM(bom);
    setFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!canDelete) return toast.error('Você não tem permissão para excluir fichas técnicas');
    if (!confirm('Tem certeza que deseja excluir esta ficha técnica?')) return;
    deleteBOM.mutate(id, {
      onSuccess: () => toast.success('Ficha técnica excluída'),
      onError: (e: any) => toast.error(e?.message ?? 'Erro ao excluir'),
    });
  };

  const handleAdd = () => {
    if (!canEdit) return toast.error('Você não tem permissão para criar fichas técnicas');
    setEditingBOM(undefined);
    setFormModalOpen(true);
  };

  const handleSave = (bomData: Omit<BOM, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!bomData.productId) {
      toast.error('Selecione um produto');
      return;
    }
    if (bomData.components.some((c) => c.quantity <= 0 || c.cost < 0)) {
      toast.error('Quantidades devem ser positivas e custos não-negativos');
      return;
    }
    const opts = {
      onSuccess: () => {
        toast.success(editingBOM ? 'Ficha técnica atualizada' : 'Ficha técnica criada');
        setEditingBOM(undefined);
        setFormModalOpen(false);
      },
      onError: (e: any) => toast.error(e?.message ?? 'Erro ao salvar'),
    };
    if (editingBOM) {
      updateBOM.mutate({ id: editingBOM.id, data: bomData }, opts);
    } else {
      createBOM.mutate(bomData, opts);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ficha Técnica (BOM)</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as fichas técnicas dos produtos, insumos e processos de fabricação
          </p>
        </div>
        {canEdit && (
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Ficha Técnica
          </Button>
        )}
      </div>

      <BOMStats boms={boms} />

      <div className="space-y-4">
        <BOMFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <BOMTable
            boms={filteredBOMs}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <BOMModal
        bom={selectedBOM}
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedBOM(null);
        }}
      />

      <BOMFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingBOM(undefined);
        }}
        onSave={handleSave}
        bom={editingBOM}
        saving={createBOM.isPending || updateBOM.isPending}
      />
    </div>
  );
}
