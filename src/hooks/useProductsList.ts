import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductOption {
  id: string;
  code: string;
  name: string;
}

export const useProductsList = () =>
  useQuery({
    queryKey: ['products-list'],
    queryFn: async (): Promise<ProductOption[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('id, code, name')
        .order('name');
      if (error) throw error;
      return data as ProductOption[];
    },
  });
