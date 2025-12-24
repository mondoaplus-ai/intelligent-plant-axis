import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserFormData } from '@/types/user';

interface UserState {
  users: User[];
  addUser: (data: UserFormData) => void;
  updateUser: (id: string, data: Partial<UserFormData>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@smarterp.com.br',
    username: 'admin',
    role: 'admin',
    department: 'TI',
    companyId: '1',
    phone: '(11) 99999-0001',
    status: 'ativo',
    lastLogin: new Date(),
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Carlos Silva',
    email: 'carlos.silva@smarterp.com.br',
    username: 'carlos.silva',
    role: 'manager',
    department: 'Produção',
    companyId: '1',
    phone: '(11) 99999-0002',
    status: 'ativo',
    lastLogin: new Date('2024-01-10'),
    createdAt: new Date('2021-03-15'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria.santos@smarterp.com.br',
    username: 'maria.santos',
    role: 'operator',
    department: 'Estoque',
    companyId: '1',
    phone: '(11) 99999-0003',
    status: 'ativo',
    lastLogin: new Date('2024-01-12'),
    createdAt: new Date('2022-06-01'),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'João Oliveira',
    email: 'joao.oliveira@smarterp.com.br',
    username: 'joao.oliveira',
    role: 'viewer',
    department: 'Comercial',
    companyId: '2',
    phone: '(19) 99999-0004',
    status: 'inativo',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date(),
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      addUser: (data) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              ...data,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, ...data, updatedAt: new Date() }
              : user
          ),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
      getUserById: (id) => get().users.find((u) => u.id === id),
    }),
    {
      name: 'user-storage',
    }
  )
);
