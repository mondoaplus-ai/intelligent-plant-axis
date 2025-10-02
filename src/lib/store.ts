import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AppState {
  user: User | null;
  sidebarCollapsed: boolean;
  notifications: number;
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setNotifications: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos.silva@smarterp.com',
    role: 'Gerente de Produção',
  },
  sidebarCollapsed: false,
  notifications: 3,
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setNotifications: (count) => set({ notifications: count }),
}));
