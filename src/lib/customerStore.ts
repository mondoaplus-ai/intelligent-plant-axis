import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, CustomerFilters, CustomerStore } from '@/types/customer';

const mockCustomers: Customer[] = [
  {
    id: '1',
    code: 'CLI001',
    name: 'Indústria Metalúrgica São Paulo Ltda',
    tradeName: 'Metalúrgica SP',
    type: 'Pessoa Jurídica',
    category: 'A',
    status: 'Ativo',
    cpfCnpj: '12.345.678/0001-90',
    ie: '123.456.789.012',
    email: 'contato@metalurgicasp.com.br',
    phone: '(11) 3456-7890',
    mobile: '(11) 98765-4321',
    website: 'www.metalurgicasp.com.br',
    addresses: [
      {
        id: 'addr1',
        type: 'Comercial',
        street: 'Av. Paulista',
        number: '1500',
        complement: 'Sala 1201',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        isDefault: true
      }
    ],
    contacts: [
      {
        id: 'cont1',
        name: 'João Silva',
        role: 'Gerente de Compras',
        email: 'joao.silva@metalurgicasp.com.br',
        phone: '(11) 3456-7891',
        isMain: true
      }
    ],
    salesRep: 'Carlos Santos',
    priceTable: 'Tabela A',
    paymentTerm: '30/60 dias',
    creditLimit: 500000,
    creditUsed: 125000,
    totalPurchases: 850000,
    averageTicket: 85000,
    lastPurchase: '2024-10-01',
    purchases: [
      {
        id: 'p1',
        orderId: 'PV001',
        date: '2024-10-01',
        total: 95000,
        status: 'Entregue'
      },
      {
        id: 'p2',
        orderId: 'PV045',
        date: '2024-09-15',
        total: 78000,
        status: 'Entregue'
      }
    ],
    notes: 'Cliente estratégico - prioridade máxima',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-10-01T14:30:00Z'
  },
  {
    id: '2',
    code: 'CLI002',
    name: 'Autopeças Central do Brasil S.A.',
    tradeName: 'Central Autopeças',
    type: 'Pessoa Jurídica',
    category: 'A',
    status: 'Ativo',
    cpfCnpj: '98.765.432/0001-10',
    ie: '987.654.321.098',
    email: 'vendas@centralautopecas.com.br',
    phone: '(11) 2345-6789',
    mobile: '(11) 99876-5432',
    addresses: [
      {
        id: 'addr2',
        type: 'Comercial',
        street: 'Rua da Consolação',
        number: '2500',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01416-000',
        isDefault: true
      }
    ],
    contacts: [
      {
        id: 'cont2',
        name: 'Maria Oliveira',
        role: 'Diretora Comercial',
        email: 'maria@centralautopecas.com.br',
        phone: '(11) 2345-6790',
        isMain: true
      }
    ],
    salesRep: 'Ana Costa',
    priceTable: 'Tabela A',
    paymentTerm: '30 dias',
    creditLimit: 400000,
    creditUsed: 180000,
    totalPurchases: 720000,
    averageTicket: 72000,
    lastPurchase: '2024-09-28',
    purchases: [
      {
        id: 'p3',
        orderId: 'PV002',
        date: '2024-09-28',
        total: 82000,
        status: 'Em Produção'
      }
    ],
    createdAt: '2023-02-20T09:00:00Z',
    updatedAt: '2024-09-28T11:15:00Z'
  },
  {
    id: '3',
    code: 'CLI003',
    name: 'Transportadora Rápida Express Ltda',
    tradeName: 'Rápida Express',
    type: 'Pessoa Jurídica',
    category: 'B',
    status: 'Ativo',
    cpfCnpj: '45.678.901/0001-23',
    ie: '456.789.012.345',
    email: 'compras@rapidaexpress.com.br',
    phone: '(21) 3456-7890',
    addresses: [
      {
        id: 'addr3',
        type: 'Comercial',
        street: 'Av. Brasil',
        number: '8000',
        neighborhood: 'Penha',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '21012-000',
        isDefault: true
      }
    ],
    contacts: [
      {
        id: 'cont3',
        name: 'Pedro Santos',
        role: 'Gerente de Manutenção',
        email: 'pedro@rapidaexpress.com.br',
        phone: '(21) 3456-7891',
        isMain: true
      }
    ],
    salesRep: 'Carlos Santos',
    priceTable: 'Tabela B',
    paymentTerm: '45 dias',
    creditLimit: 250000,
    creditUsed: 95000,
    totalPurchases: 420000,
    averageTicket: 42000,
    lastPurchase: '2024-09-20',
    purchases: [
      {
        id: 'p4',
        orderId: 'PV015',
        date: '2024-09-20',
        total: 45000,
        status: 'Faturado'
      }
    ],
    createdAt: '2023-03-10T14:00:00Z',
    updatedAt: '2024-09-20T16:45:00Z'
  },
  {
    id: '4',
    code: 'CLI004',
    name: 'Construtora Alicerce Forte S.A.',
    tradeName: 'Alicerce Construtora',
    type: 'Pessoa Jurídica',
    category: 'B',
    status: 'Ativo',
    cpfCnpj: '78.901.234/0001-56',
    ie: '789.012.345.678',
    email: 'suprimentos@alicerce.com.br',
    phone: '(31) 3456-7890',
    addresses: [
      {
        id: 'addr4',
        type: 'Comercial',
        street: 'Av. Afonso Pena',
        number: '3500',
        neighborhood: 'Centro',
        city: 'Belo Horizonte',
        state: 'MG',
        zipCode: '30130-009',
        isDefault: true
      }
    ],
    contacts: [
      {
        id: 'cont4',
        name: 'Fernanda Lima',
        role: 'Coordenadora de Compras',
        email: 'fernanda@alicerce.com.br',
        phone: '(31) 3456-7892',
        isMain: true
      }
    ],
    salesRep: 'Ana Costa',
    priceTable: 'Tabela B',
    paymentTerm: '60 dias',
    creditLimit: 300000,
    creditUsed: 120000,
    totalPurchases: 380000,
    averageTicket: 38000,
    lastPurchase: '2024-09-12',
    purchases: [
      {
        id: 'p5',
        orderId: 'PV028',
        date: '2024-09-12',
        total: 52000,
        status: 'Entregue'
      }
    ],
    createdAt: '2023-04-05T11:00:00Z',
    updatedAt: '2024-09-12T10:20:00Z'
  },
  {
    id: '5',
    code: 'CLI005',
    name: 'João Carlos Pereira',
    type: 'Pessoa Física',
    category: 'C',
    status: 'Ativo',
    cpfCnpj: '123.456.789-00',
    email: 'joao.pereira@email.com',
    phone: '(11) 98765-4321',
    addresses: [
      {
        id: 'addr5',
        type: 'Comercial',
        street: 'Rua das Flores',
        number: '150',
        neighborhood: 'Jardim Paulista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01420-000',
        isDefault: true
      }
    ],
    contacts: [],
    priceTable: 'Tabela C',
    paymentTerm: 'À vista',
    creditLimit: 50000,
    creditUsed: 15000,
    totalPurchases: 95000,
    averageTicket: 9500,
    lastPurchase: '2024-08-30',
    purchases: [
      {
        id: 'p6',
        orderId: 'PV042',
        date: '2024-08-30',
        total: 12000,
        status: 'Entregue'
      }
    ],
    createdAt: '2023-06-15T13:00:00Z',
    updatedAt: '2024-08-30T15:30:00Z'
  },
  {
    id: '6',
    code: 'CLI006',
    name: 'Oficina Mecânica Irmãos Silva Ltda',
    tradeName: 'Oficina Silva',
    type: 'Pessoa Jurídica',
    category: 'C',
    status: 'Ativo',
    cpfCnpj: '23.456.789/0001-90',
    ie: '234.567.890.123',
    email: 'contato@oficinasiva.com.br',
    phone: '(19) 3456-7890',
    addresses: [
      {
        id: 'addr6',
        type: 'Comercial',
        street: 'Rua Barão de Jaguara',
        number: '850',
        neighborhood: 'Centro',
        city: 'Campinas',
        state: 'SP',
        zipCode: '13015-000',
        isDefault: true
      }
    ],
    contacts: [
      {
        id: 'cont5',
        name: 'Roberto Silva',
        role: 'Proprietário',
        email: 'roberto@oficinasiva.com.br',
        phone: '(19) 3456-7890',
        isMain: true
      }
    ],
    salesRep: 'Carlos Santos',
    priceTable: 'Tabela C',
    paymentTerm: '30 dias',
    creditLimit: 80000,
    creditUsed: 25000,
    totalPurchases: 150000,
    averageTicket: 15000,
    lastPurchase: '2024-09-05',
    purchases: [
      {
        id: 'p7',
        orderId: 'PV035',
        date: '2024-09-05',
        total: 18000,
        status: 'Entregue'
      }
    ],
    createdAt: '2023-07-20T10:00:00Z',
    updatedAt: '2024-09-05T12:00:00Z'
  },
  {
    id: '7',
    code: 'CLI007',
    name: 'Distribuidora Nacional de Peças S.A.',
    tradeName: 'Nacional Peças',
    type: 'Pessoa Jurídica',
    category: 'A',
    status: 'Ativo',
    cpfCnpj: '34.567.890/0001-12',
    ie: '345.678.901.234',
    email: 'vendas@nacionalpecas.com.br',
    phone: '(41) 3456-7890',
    mobile: '(41) 99876-5432',
    website: 'www.nacionalpecas.com.br',
    addresses: [
      {
        id: 'addr7',
        type: 'Comercial',
        street: 'Av. Sete de Setembro',
        number: '4500',
        neighborhood: 'Batel',
        city: 'Curitiba',
        state: 'PR',
        zipCode: '80240-000',
        isDefault: true
      }
    ],
    contacts: [
      {
        id: 'cont6',
        name: 'Carla Mendes',
        role: 'Gerente de Compras',
        email: 'carla@nacionalpecas.com.br',
        phone: '(41) 3456-7891',
        isMain: true
      }
    ],
    salesRep: 'Ana Costa',
    priceTable: 'Tabela A',
    paymentTerm: '30/60 dias',
    creditLimit: 600000,
    creditUsed: 220000,
    totalPurchases: 920000,
    averageTicket: 92000,
    lastPurchase: '2024-10-03',
    purchases: [
      {
        id: 'p8',
        orderId: 'PV003',
        date: '2024-10-03',
        total: 105000,
        status: 'Aprovado'
      }
    ],
    notes: 'Distribuidor nacional - volume alto',
    createdAt: '2023-01-25T08:00:00Z',
    updatedAt: '2024-10-03T09:45:00Z'
  },
  {
    id: '8',
    code: 'CLI008',
    name: 'Maria Fernanda Costa',
    type: 'Pessoa Física',
    category: 'D',
    status: 'Ativo',
    cpfCnpj: '987.654.321-00',
    email: 'mfcosta@email.com',
    phone: '(11) 97654-3210',
    addresses: [
      {
        id: 'addr8',
        type: 'Comercial',
        street: 'Rua Augusta',
        number: '2200',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01412-000',
        isDefault: true
      }
    ],
    contacts: [],
    priceTable: 'Tabela Padrão',
    paymentTerm: 'À vista',
    creditLimit: 20000,
    creditUsed: 5000,
    totalPurchases: 28000,
    averageTicket: 2800,
    lastPurchase: '2024-07-15',
    purchases: [
      {
        id: 'p9',
        orderId: 'PV058',
        date: '2024-07-15',
        total: 3500,
        status: 'Entregue'
      }
    ],
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-07-15T16:20:00Z'
  },
  {
    id: '9',
    code: 'CLI009',
    name: 'Fábrica de Móveis Modernos Ltda',
    tradeName: 'Móveis Modernos',
    type: 'Pessoa Jurídica',
    category: 'B',
    status: 'Ativo',
    cpfCnpj: '56.789.012/0001-34',
    ie: '567.890.123.456',
    email: 'compras@moveismodernos.com.br',
    phone: '(47) 3456-7890',
    addresses: [
      {
        id: 'addr9',
        type: 'Comercial',
        street: 'Rua XV de Novembro',
        number: '1200',
        neighborhood: 'Centro',
        city: 'Joinville',
        state: 'SC',
        zipCode: '89201-600',
        isDefault: true
      }
    ],
    contacts: [
      {
        id: 'cont7',
        name: 'Marcos Antônio',
        role: 'Gerente de Produção',
        email: 'marcos@moveismodernos.com.br',
        phone: '(47) 3456-7891',
        isMain: true
      }
    ],
    salesRep: 'Carlos Santos',
    priceTable: 'Tabela B',
    paymentTerm: '45 dias',
    creditLimit: 200000,
    creditUsed: 85000,
    totalPurchases: 340000,
    averageTicket: 34000,
    lastPurchase: '2024-09-18',
    purchases: [
      {
        id: 'p10',
        orderId: 'PV022',
        date: '2024-09-18',
        total: 38000,
        status: 'Faturado'
      }
    ],
    createdAt: '2023-05-12T11:00:00Z',
    updatedAt: '2024-09-18T13:30:00Z'
  },
  {
    id: '10',
    code: 'CLI010',
    name: 'Serviços Industriais Prime S.A.',
    tradeName: 'Prime Industrial',
    type: 'Pessoa Jurídica',
    category: 'C',
    status: 'Bloqueado',
    cpfCnpj: '67.890.123/0001-45',
    ie: '678.901.234.567',
    email: 'financeiro@primeindustrial.com.br',
    phone: '(51) 3456-7890',
    addresses: [
      {
        id: 'addr10',
        type: 'Comercial',
        street: 'Av. Ipiranga',
        number: '6500',
        neighborhood: 'Partenon',
        city: 'Porto Alegre',
        state: 'RS',
        zipCode: '90610-000',
        isDefault: true
      }
    ],
    contacts: [
      {
        id: 'cont8',
        name: 'Juliana Rodrigues',
        role: 'Diretora Financeira',
        email: 'juliana@primeindustrial.com.br',
        phone: '(51) 3456-7891',
        isMain: true
      }
    ],
    salesRep: 'Ana Costa',
    priceTable: 'Tabela C',
    paymentTerm: '30 dias',
    creditLimit: 150000,
    creditUsed: 150000,
    totalPurchases: 280000,
    averageTicket: 28000,
    lastPurchase: '2024-05-10',
    purchases: [
      {
        id: 'p11',
        orderId: 'PV072',
        date: '2024-05-10',
        total: 32000,
        status: 'Entregue'
      }
    ],
    notes: 'Cliente bloqueado por inadimplência - crédito excedido',
    createdAt: '2023-08-18T09:00:00Z',
    updatedAt: '2024-06-20T10:00:00Z'
  }
];

const defaultFilters: CustomerFilters = {
  search: '',
  category: 'Todos',
  status: 'Todos',
  type: 'Todos'
};

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      filters: defaultFilters,
      selectedCustomers: [],
      currentPage: 1,
      itemsPerPage: 10,
      sortField: null,
      sortDirection: 'asc',

      setFilters: (filters) => 
        set({ filters: { ...get().filters, ...filters }, currentPage: 1 }),

      clearFilters: () => 
        set({ filters: defaultFilters, currentPage: 1 }),

      addCustomer: (customer) => 
        set((state) => ({
          customers: [
            ...state.customers,
            {
              ...customer,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
              : customer
          ),
        })),

      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
          selectedCustomers: state.selectedCustomers.filter((cId) => cId !== id),
        })),

      deleteCustomers: (ids) =>
        set((state) => ({
          customers: state.customers.filter((customer) => !ids.includes(customer.id)),
          selectedCustomers: [],
        })),

      toggleStatus: (id) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? {
                  ...customer,
                  status: customer.status === 'Ativo' ? 'Inativo' : 'Ativo',
                  updatedAt: new Date().toISOString(),
                }
              : customer
          ),
        })),

      toggleCustomerSelection: (id) =>
        set((state) => ({
          selectedCustomers: state.selectedCustomers.includes(id)
            ? state.selectedCustomers.filter((cId) => cId !== id)
            : [...state.selectedCustomers, id],
        })),

      selectAllCustomers: (customerIds) =>
        set({ selectedCustomers: customerIds }),

      clearSelection: () => 
        set({ selectedCustomers: [] }),

      setPage: (page) => 
        set({ currentPage: page }),

      setItemsPerPage: (items) =>
        set({ itemsPerPage: items, currentPage: 1 }),

      setSorting: (field) =>
        set((state) => ({
          sortField: field,
          sortDirection:
            state.sortField === field && state.sortDirection === 'asc' ? 'desc' : 'asc',
        })),
    }),
    {
      name: 'customer-storage',
    }
  )
);
