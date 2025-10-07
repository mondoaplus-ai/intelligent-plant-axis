export type CustomerCategory = 'A' | 'B' | 'C' | 'D';
export type CustomerType = 'Pessoa Física' | 'Pessoa Jurídica';
export type CustomerStatus = 'Ativo' | 'Inativo' | 'Bloqueado';

export interface CustomerAddress {
  id: string;
  type: 'Comercial' | 'Entrega' | 'Cobrança';
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface CustomerContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isMain: boolean;
}

export interface CustomerPurchase {
  id: string;
  orderId: string;
  date: string;
  total: number;
  status: 'Orçamento' | 'Aprovado' | 'Em Produção' | 'Faturado' | 'Entregue';
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  tradeName?: string;
  type: CustomerType;
  category: CustomerCategory;
  status: CustomerStatus;
  
  // Dados fiscais
  cpfCnpj: string;
  ie?: string;
  im?: string;
  
  // Contato
  email: string;
  phone: string;
  mobile?: string;
  website?: string;
  
  // Endereços e contatos
  addresses: CustomerAddress[];
  contacts: CustomerContact[];
  
  // Comercial
  salesRep?: string;
  priceTable?: string;
  paymentTerm?: string;
  creditLimit: number;
  creditUsed: number;
  
  // Estatísticas
  totalPurchases: number;
  averageTicket: number;
  lastPurchase?: string;
  purchases: CustomerPurchase[];
  
  // Sistema
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  search: string;
  category: CustomerCategory | 'Todos';
  status: CustomerStatus | 'Todos';
  type: CustomerType | 'Todos';
}

export interface CustomerStore {
  customers: Customer[];
  filters: CustomerFilters;
  selectedCustomers: string[];
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Customer | null;
  sortDirection: 'asc' | 'desc';
  
  setFilters: (filters: Partial<CustomerFilters>) => void;
  clearFilters: () => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  deleteCustomers: (ids: string[]) => void;
  toggleStatus: (id: string) => void;
  toggleCustomerSelection: (id: string) => void;
  selectAllCustomers: (customerIds: string[]) => void;
  clearSelection: () => void;
  setPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSorting: (field: keyof Customer) => void;
}
