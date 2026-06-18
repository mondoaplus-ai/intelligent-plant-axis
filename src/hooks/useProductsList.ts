import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductOption {
  id: string;
  code: string;
  name: string;
  unit: string;
  sale_price: number;
}

export const useProductsList = () =>
  useQuery({
    queryKey: ['products-list'],
    queryFn: async (): Promise<ProductOption[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('id, code, name, unit, sale_price')
        .order('name');
      if (error) throw error;
      return (data || []).map((r: any) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        unit: r.unit ?? 'un',
        sale_price: Number(r.sale_price ?? 0),
      }));
    },
  });
