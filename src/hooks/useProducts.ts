import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductFilters } from '@/types/product';

const KEY = ['products'];

const mapFromDb = (r: any): Product => ({
  id: r.id,
  code: r.code,
  name: r.name,
  category: r.category,
  type: r.type,
  unit: r.unit,
  status: r.status,
  photo: r.photo_url ?? undefined,
  ncm: r.ncm ?? undefined,
  barcode: r.barcode ?? undefined,
  currentStock: Number(r.current_stock ?? 0),
  minStock: Number(r.min_stock ?? 0),
  maxStock: Number(r.max_stock ?? 0),
  avgCost: Number(r.avg_cost ?? 0),
  netWeight: r.net_weight != null ? Number(r.net_weight) : undefined,
  grossWeight: r.gross_weight != null ? Number(r.gross_weight) : undefined,
  weightUnit: r.weight_unit ?? undefined,
  productionTime: r.production_time != null ? Number(r.production_time) : undefined,
  productionTimeUnit: r.production_time_unit ?? undefined,
  yield: r.yield_pct != null ? Number(r.yield_pct) : undefined,
  leadTime: r.lead_time ?? undefined,
  setupTime: r.setup_time != null ? Number(r.setup_time) : undefined,
  productionNotes: r.production_notes ?? undefined,
  suppliers: [],
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const mapToDb = (p: Partial<Product>) => ({
  code: p.code,
  name: p.name,
  category: p.category,
  type: p.type,
  unit: p.unit,
  status: p.status,
  photo_url: p.photo ?? null,
  ncm: p.ncm ?? null,
  barcode: p.barcode ?? null,
  current_stock: p.currentStock ?? 0,
  min_stock: p.minStock ?? 0,
  max_stock: p.maxStock ?? 0,
  avg_cost: p.avgCost ?? 0,
  net_weight: p.netWeight ?? null,
  gross_weight: p.grossWeight ?? null,
  weight_unit: p.weightUnit ?? null,
  production_time: p.productionTime ?? null,
  production_time_unit: p.productionTimeUnit ?? null,
  yield_pct: p.yield ?? null,
  lead_time: p.leadTime ?? null,
  setup_time: p.setupTime ?? null,
  production_notes: p.productionNotes ?? null,
});

export const useProducts = (filters?: Partial<ProductFilters>) =>
  useQuery({
    queryKey: [...KEY, filters ?? {}],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      let list = (data ?? []).map(mapFromDb);
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.code.toLowerCase().includes(s) ||
            p.name.toLowerCase().includes(s) ||
            p.category.toLowerCase().includes(s)
        );
      }
      if (filters?.category && filters.category !== 'Todos')
        list = list.filter((p) => p.category === filters.category);
      if (filters?.status && filters.status !== 'Todos')
        list = list.filter((p) => p.status === filters.status);
      if (filters?.type && filters.type !== 'Todos')
        list = list.filter((p) => p.type === filters.type);
      return list;
    },
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase.from('products').insert(mapToDb(p)).select('id').single();
      if (error) throw error;
      return data.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...p }: Partial<Product> & { id: string }) => {
      const { error } = await supabase.from('products').update(mapToDb(p)).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
