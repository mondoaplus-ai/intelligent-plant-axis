import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Customer, CustomerAddress } from '@/types/customer';
import { useAuth } from './useAuth';

const KEY = ['customers'];

const mapFromDb = (r: any): Customer => {
  const addresses: CustomerAddress[] = r.street || r.city || r.zip_code
    ? [
        {
          id: r.id,
          type: 'Comercial',
          street: r.street ?? '',
          number: r.number ?? '',
          complement: r.complement ?? '',
          neighborhood: r.neighborhood ?? '',
          city: r.city ?? '',
          state: r.state ?? '',
          zipCode: r.zip_code ?? '',
          isDefault: true,
        },
      ]
    : [];

  return {
    id: r.id,
    code: r.code,
    name: r.name,
    tradeName: r.trade_name ?? undefined,
    type: (r.type as Customer['type']) ?? 'Pessoa Jurídica',
    category: (r.category as Customer['category']) ?? 'C',
    status: (r.status as Customer['status']) ?? 'Ativo',
    cpfCnpj: r.cpf_cnpj ?? '',
    ie: r.ie ?? undefined,
    im: undefined,
    email: r.email ?? '',
    phone: r.phone ?? '',
    mobile: r.mobile ?? undefined,
    website: r.website ?? undefined,
    addresses,
    contacts: [],
    salesRep: undefined,
    priceTable: undefined,
    paymentTerm: r.payment_term ?? undefined,
    creditLimit: Number(r.credit_limit ?? 0),
    creditUsed: 0,
    totalPurchases: 0,
    averageTicket: 0,
    lastPurchase: undefined,
    purchases: [],
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
};

const mapToDb = (c: Partial<Customer>) => {
  const addr = c.addresses?.find((a) => a.isDefault) ?? c.addresses?.[0];
  return {
    code: c.code,
    name: c.name,
    trade_name: c.tradeName ?? null,
    type: c.type,
    category: c.category ?? null,
    status: c.status,
    cpf_cnpj: c.cpfCnpj ?? null,
    ie: c.ie ?? null,
    email: c.email ?? null,
    phone: c.phone ?? null,
    mobile: c.mobile ?? null,
    website: c.website ?? null,
    street: addr?.street ?? null,
    number: addr?.number ?? null,
    complement: addr?.complement ?? null,
    neighborhood: addr?.neighborhood ?? null,
    city: addr?.city ?? null,
    state: addr?.state ?? null,
    zip_code: addr?.zipCode ?? null,
    credit_limit: c.creditLimit ?? 0,
    payment_term: c.paymentTerm ?? null,
    notes: c.notes ?? null,
  };
};

export const useCustomers = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<Customer[]> => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []).map(mapFromDb);
    },
  });

const invalidate = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: KEY });
  qc.invalidateQueries({ queryKey: ['customers-list'] });
};

export const useCreateCustomer = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (c: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('customers')
        .insert({ ...mapToDb(c), created_by: user?.id ?? null })
        .select('id')
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => invalidate(qc),
  });
};

export const useUpdateCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Customer> }) => {
      const { error } = await supabase.from('customers').update(mapToDb(data)).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(qc),
  });
};

export const useDeleteCustomer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(qc),
  });
};

export const useDeleteCustomers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('customers').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => invalidate(qc),
  });
};

export const useToggleCustomerStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, current }: { id: string; current: Customer['status'] }) => {
      const next = current === 'Ativo' ? 'Inativo' : 'Ativo';
      const { error } = await supabase.from('customers').update({ status: next }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(qc),
  });
};
