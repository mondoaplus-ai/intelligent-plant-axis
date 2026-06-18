import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CustomerOption {
  id: string;
  name: string;
  cpf_cnpj: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
}

export const useCustomersList = () =>
  useQuery({
    queryKey: ['customers-list'],
    queryFn: async (): Promise<CustomerOption[]> => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, cpf_cnpj, street, number, complement, neighborhood, city, state, zip_code')
        .eq('status', 'ativo')
        .order('name');
      if (error) throw error;
      return (data || []) as CustomerOption[];
    },
  });
