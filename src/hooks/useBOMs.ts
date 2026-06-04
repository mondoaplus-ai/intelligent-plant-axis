import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BOM, BOMComponent, ProductionProcess } from '@/types/bom';
import { useAuth } from './useAuth';

const KEY = ['boms'];

type DbBom = {
  id: string;
  product_id: string;
  product_name: string;
  version: string;
  status: string;
  total_cost: number | null;
  total_time: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  bom_components: any[];
  bom_processes: any[];
};

const mapBom = (row: DbBom): BOM => ({
  id: row.id,
  productId: row.product_id,
  productName: row.product_name,
  version: row.version,
  status: (row.status as BOM['status']) || 'em_revisao',
  totalCost: Number(row.total_cost ?? 0),
  totalTime: Number(row.total_time ?? 0),
  notes: row.notes ?? '',
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  createdBy: row.created_by ?? '',
  components: (row.bom_components || [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((c): BOMComponent => ({
      id: c.id,
      productId: c.product_id ?? '',
      productName: c.component_name,
      quantity: Number(c.quantity),
      unit: c.unit,
      waste: Number(c.waste_pct ?? 0),
      cost: Number(c.total_cost ?? Number(c.unit_cost) * Number(c.quantity)),
    })),
  processes: (row.bom_processes || [])
    .sort((a, b) => a.sequence - b.sequence)
    .map((p): ProductionProcess => ({
      id: p.id,
      name: p.name,
      sequence: p.sequence,
      estimatedTime: p.estimated_time,
      setupTime: p.setup_time ?? 0,
      resourceName: p.resource_name ?? undefined,
      description: p.description ?? undefined,
    })),
});

export const useBOMs = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<BOM[]> => {
      const { data, error } = await supabase
        .from('boms')
        .select('*, bom_components(*), bom_processes(*)')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data as unknown as DbBom[]).map(mapBom);
    },
  });

type SaveInput = Omit<BOM, 'id' | 'createdAt' | 'updatedAt'>;

const insertChildren = async (bomId: string, b: SaveInput) => {
  if (b.components.length) {
    const rows = b.components.map((c, i) => ({
      bom_id: bomId,
      product_id: null, // free-text components; link explicitly if needed
      component_name: c.productName,
      quantity: c.quantity,
      unit: c.unit,
      unit_cost: c.quantity > 0 ? c.cost / c.quantity : c.cost,
      waste_pct: c.waste,
      sort_order: i,
    }));
    const { error } = await supabase.from('bom_components').insert(rows);
    if (error) throw error;
  }
  if (b.processes.length) {
    const rows = b.processes.map((p) => ({
      bom_id: bomId,
      name: p.name,
      sequence: p.sequence,
      estimated_time: p.estimatedTime,
      setup_time: p.setupTime,
      resource_name: p.resourceName ?? null,
      description: p.description ?? null,
    }));
    const { error } = await supabase.from('bom_processes').insert(rows);
    if (error) throw error;
  }
};

export const useCreateBOM = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (b: SaveInput) => {
      const { data, error } = await supabase
        .from('boms')
        .insert({
          product_id: b.productId,
          product_name: b.productName,
          version: b.version,
          status: b.status,
          notes: b.notes ?? null,
          created_by: user?.id ?? null,
        })
        .select('id')
        .single();
      if (error) throw error;
      await insertChildren(data.id, b);
      return data.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useUpdateBOM = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: b }: { id: string; data: SaveInput }) => {
      const { error } = await supabase
        .from('boms')
        .update({
          product_id: b.productId,
          product_name: b.productName,
          version: b.version,
          status: b.status,
          notes: b.notes ?? null,
        })
        .eq('id', id);
      if (error) throw error;
      // Replace children
      await supabase.from('bom_components').delete().eq('bom_id', id);
      await supabase.from('bom_processes').delete().eq('bom_id', id);
      await insertChildren(id, b);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useDeleteBOM = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('boms').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
