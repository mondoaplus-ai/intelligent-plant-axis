import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CashAccount {
  id: string;
  name: string;
  type: string;
  bank?: string;
  agency?: string;
  account_number?: string;
  opening_balance: number;
  current_balance: number;
  is_active: boolean;
}

export interface CashCategory {
  id: string;
  name: string;
  type: 'receita' | 'despesa';
  color?: string;
  icon?: string;
  is_active: boolean;
}

export interface CashEntry {
  id: string;
  cash_account_id: string;
  category_id?: string | null;
  type: 'receita' | 'despesa';
  status: 'pendente' | 'confirmado' | 'cancelado';
  description: string;
  amount: number;
  date: string;
  due_date?: string | null;
  payment_date?: string | null;
  payment_method?: string | null;
  document_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CashEntryFilters {
  type?: 'receita' | 'despesa' | 'all';
  status?: 'pendente' | 'confirmado' | 'cancelado' | 'all';
  accountId?: string;
  from?: string;
  to?: string;
}

const ENTRIES_KEY = ['cash_entries'];
const ACCOUNTS_KEY = ['cash_accounts'];
const CATEGORIES_KEY = ['cash_categories'];

export const useCashAccounts = () =>
  useQuery({
    queryKey: ACCOUNTS_KEY,
    queryFn: async (): Promise<CashAccount[]> => {
      const { data, error } = await supabase
        .from('cash_accounts')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        ...r,
        opening_balance: Number(r.opening_balance),
        current_balance: Number(r.current_balance),
      }));
    },
  });

export const useCashCategories = () =>
  useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: async (): Promise<CashCategory[]> => {
      const { data, error } = await supabase
        .from('cash_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []) as CashCategory[];
    },
  });

export const useCashEntries = (filters?: CashEntryFilters) =>
  useQuery({
    queryKey: [...ENTRIES_KEY, filters ?? {}],
    queryFn: async (): Promise<CashEntry[]> => {
      let q = supabase.from('cash_entries').select('*').order('date', { ascending: false });
      if (filters?.type && filters.type !== 'all') q = q.eq('type', filters.type);
      if (filters?.status && filters.status !== 'all') q = q.eq('status', filters.status);
      if (filters?.accountId) q = q.eq('cash_account_id', filters.accountId);
      if (filters?.from) q = q.gte('date', filters.from);
      if (filters?.to) q = q.lte('date', filters.to);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((r: any) => ({ ...r, amount: Number(r.amount) }));
    },
  });

export const useCashSummary = () => {
  const { data: accounts = [] } = useCashAccounts();
  const { data: entries = [] } = useCashEntries();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const totalBalance = accounts.reduce((s, a) => s + a.current_balance, 0);
  const monthEntries = entries.filter(
    (e) => e.date >= monthStart && e.status === 'confirmado'
  );
  const revenue = monthEntries.filter((e) => e.type === 'receita').reduce((s, e) => s + e.amount, 0);
  const expense = monthEntries.filter((e) => e.type === 'despesa').reduce((s, e) => s + e.amount, 0);
  const pending = entries.filter((e) => e.status === 'pendente').reduce((s, e) => s + e.amount, 0);
  return { totalBalance, revenue, expense, netResult: revenue - expense, pending };
};

export type CreateCashEntry = Omit<CashEntry, 'id' | 'created_at' | 'updated_at'>;

export const useCreateCashEntry = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (e: CreateCashEntry) => {
      const { error } = await supabase
        .from('cash_entries')
        .insert({ ...e, created_by: user?.id ?? null });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENTRIES_KEY });
      qc.invalidateQueries({ queryKey: ACCOUNTS_KEY });
    },
  });
};

export const useUpdateCashEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...e }: Partial<CashEntry> & { id: string }) => {
      const { error } = await supabase.from('cash_entries').update(e).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENTRIES_KEY });
      qc.invalidateQueries({ queryKey: ACCOUNTS_KEY });
    },
  });
};

export const useDeleteCashEntry = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cash_entries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ENTRIES_KEY });
      qc.invalidateQueries({ queryKey: ACCOUNTS_KEY });
    },
  });
};
