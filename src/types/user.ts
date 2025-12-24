export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  department: string;
  companyId: string;
  phone?: string;
  avatar?: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>;

export const roleLabels: Record<User['role'], string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  operator: 'Operador',
  viewer: 'Visualizador',
};

export const statusLabels: Record<User['status'], string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  bloqueado: 'Bloqueado',
};
