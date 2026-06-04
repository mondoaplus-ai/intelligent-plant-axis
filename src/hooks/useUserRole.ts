import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'manager' | 'operator' | 'viewer';

export const useUserRole = () => {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['user-role', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<AppRole> => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user!.id);
      if (error) throw error;
      const roles = (data ?? []).map((r) => r.role as AppRole);
      const priority: AppRole[] = ['admin', 'manager', 'operator', 'viewer'];
      return priority.find((p) => roles.includes(p)) ?? 'viewer';
    },
  });
  const role = query.data ?? 'viewer';
  return {
    role,
    isLoading: query.isLoading,
    canEdit: role === 'admin' || role === 'manager' || role === 'operator',
    canDelete: role === 'admin' || role === 'manager',
  };
};
