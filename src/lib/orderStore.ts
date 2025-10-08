import { create } from 'zustand';
import { Order, OrderStatus } from '@/types/order';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrderById: (id: string) => Order | undefined;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'PED-2024-001',
    customerId: '1',
    customerName: 'Indústria Metalúrgica ABC',
    customerDocument: '12.345.678/0001-90',
    status: 'aprovado',
    priority: 'alta',
    orderDate: '2024-03-01',
    expectedDelivery: '2024-03-15',
    items: [
      {
        id: '1',
        productId: '2',
        productCode: 'PA035',
        productName: 'Garrafa 500ml Azul',
        quantity: 1000,
        unit: 'UN',
        unitPrice: 2.50,
        discount: 5,
        total: 2375.00
      },
      {
        id: '2',
        productId: '7',
        productCode: 'PA040',
        productName: 'Garrafa 1L Transparente',
        quantity: 500,
        unit: 'UN',
        unitPrice: 3.20,
        discount: 0,
        total: 1600.00
      }
    ],
    subtotal: 3975.00,
    discount: 50.00,
    shipping: 150.00,
    tax: 715.50,
    total: 4790.50,
    paymentMethod: 'boleto',
    paymentTerm: '30-dias',
    seller: 'Carlos Silva',
    approvedBy: 'Maria Santos',
    approvedAt: '2024-03-01T14:30:00Z',
    notes: 'Cliente antigo, prioridade na entrega',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T14:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'PED-2024-002',
    customerId: '3',
    customerName: 'TechCorp Soluções',
    customerDocument: '23.456.789/0001-01',
    status: 'producao',
    priority: 'normal',
    orderDate: '2024-03-03',
    expectedDelivery: '2024-03-20',
    items: [
      {
        id: '3',
        productId: '11',
        productCode: 'PA055',
        productName: 'Pote 250ml Branco',
        quantity: 2000,
        unit: 'UN',
        unitPrice: 1.80,
        discount: 10,
        total: 3240.00
      }
    ],
    subtotal: 3600.00,
    discount: 360.00,
    shipping: 200.00,
    tax: 691.20,
    total: 4131.20,
    paymentMethod: 'transferencia',
    paymentTerm: '30-dias',
    seller: 'Ana Paula',
    approvedBy: 'João Costa',
    approvedAt: '2024-03-03T16:00:00Z',
    createdAt: '2024-03-03T11:00:00Z',
    updatedAt: '2024-03-05T09:00:00Z'
  },
  {
    id: '3',
    orderNumber: 'PED-2024-003',
    customerId: '5',
    customerName: 'Distribuidora Alpha',
    customerDocument: '34.567.890/0001-12',
    status: 'orcamento',
    priority: 'baixa',
    orderDate: '2024-03-05',
    expectedDelivery: '2024-03-25',
    items: [
      {
        id: '4',
        productId: '15',
        productCode: 'PA062',
        productName: 'Tampa Flip-Top 24mm',
        quantity: 5000,
        unit: 'UN',
        unitPrice: 1.20,
        discount: 0,
        total: 6000.00
      },
      {
        id: '5',
        productId: '2',
        productCode: 'PA035',
        productName: 'Garrafa 500ml Azul',
        quantity: 3000,
        unit: 'UN',
        unitPrice: 2.50,
        discount: 8,
        total: 6900.00
      }
    ],
    subtotal: 13500.00,
    discount: 600.00,
    shipping: 300.00,
    tax: 2412.00,
    total: 15612.00,
    paymentMethod: 'boleto',
    paymentTerm: '60-dias',
    seller: 'Roberto Lima',
    notes: 'Aguardando aprovação do cliente',
    createdAt: '2024-03-05T13:00:00Z',
    updatedAt: '2024-03-05T13:00:00Z'
  },
  {
    id: '4',
    orderNumber: 'PED-2024-004',
    customerId: '2',
    customerName: 'Comércio Beta Ltda',
    customerDocument: '98.765.432/0001-21',
    status: 'entregue',
    priority: 'normal',
    orderDate: '2024-02-20',
    expectedDelivery: '2024-03-05',
    deliveredDate: '2024-03-04',
    items: [
      {
        id: '6',
        productId: '7',
        productCode: 'PA040',
        productName: 'Garrafa 1L Transparente',
        quantity: 800,
        unit: 'UN',
        unitPrice: 3.20,
        discount: 5,
        total: 2432.00
      }
    ],
    subtotal: 2560.00,
    discount: 128.00,
    shipping: 120.00,
    tax: 465.60,
    total: 3017.60,
    paymentMethod: 'pix',
    paymentTerm: 'a-vista',
    seller: 'Carlos Silva',
    approvedBy: 'Maria Santos',
    approvedAt: '2024-02-20T15:00:00Z',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-03-04T16:00:00Z'
  },
  {
    id: '5',
    orderNumber: 'PED-2024-005',
    customerId: '4',
    customerName: 'Varejo Gama S.A.',
    customerDocument: '45.678.901/0001-23',
    status: 'faturado',
    priority: 'alta',
    orderDate: '2024-03-08',
    expectedDelivery: '2024-03-18',
    items: [
      {
        id: '7',
        productId: '11',
        productCode: 'PA055',
        productName: 'Pote 250ml Branco',
        quantity: 1500,
        unit: 'UN',
        unitPrice: 1.80,
        discount: 0,
        total: 2700.00
      },
      {
        id: '8',
        productId: '15',
        productCode: 'PA062',
        productName: 'Tampa Flip-Top 24mm',
        quantity: 1500,
        unit: 'UN',
        unitPrice: 1.20,
        discount: 0,
        total: 1800.00
      }
    ],
    subtotal: 4500.00,
    discount: 0,
    shipping: 180.00,
    tax: 810.00,
    total: 5490.00,
    paymentMethod: 'cartao',
    paymentTerm: '14-dias',
    seller: 'Ana Paula',
    approvedBy: 'João Costa',
    approvedAt: '2024-03-08T10:00:00Z',
    createdAt: '2024-03-08T08:00:00Z',
    updatedAt: '2024-03-10T14:00:00Z'
  },
  {
    id: '6',
    orderNumber: 'PED-2024-006',
    customerId: '1',
    customerName: 'Indústria Metalúrgica ABC',
    customerDocument: '12.345.678/0001-90',
    status: 'aprovado',
    priority: 'urgente',
    orderDate: '2024-03-12',
    expectedDelivery: '2024-03-14',
    items: [
      {
        id: '9',
        productId: '2',
        productCode: 'PA035',
        productName: 'Garrafa 500ml Azul',
        quantity: 500,
        unit: 'UN',
        unitPrice: 2.80,
        discount: 0,
        total: 1400.00
      }
    ],
    subtotal: 1400.00,
    discount: 0,
    shipping: 250.00,
    tax: 252.00,
    total: 1902.00,
    paymentMethod: 'pix',
    paymentTerm: 'a-vista',
    seller: 'Carlos Silva',
    approvedBy: 'Maria Santos',
    approvedAt: '2024-03-12T11:00:00Z',
    notes: 'URGENTE - Reposição de estoque',
    internalNotes: 'Priorizar produção',
    createdAt: '2024-03-12T10:30:00Z',
    updatedAt: '2024-03-12T11:00:00Z'
  },
  {
    id: '7',
    orderNumber: 'PED-2024-007',
    customerId: '6',
    customerName: 'Supermercado Delta',
    customerDocument: '56.789.012/0001-34',
    status: 'cancelado',
    priority: 'normal',
    orderDate: '2024-03-06',
    expectedDelivery: '2024-03-20',
    items: [
      {
        id: '10',
        productId: '16',
        productCode: 'REV008',
        productName: 'Kit Promocional Verão',
        quantity: 100,
        unit: 'UN',
        unitPrice: 95.00,
        discount: 0,
        total: 9500.00
      }
    ],
    subtotal: 9500.00,
    discount: 0,
    shipping: 150.00,
    tax: 1710.00,
    total: 11360.00,
    paymentMethod: 'boleto',
    paymentTerm: '30-dias',
    seller: 'Roberto Lima',
    notes: 'Cancelado a pedido do cliente',
    internalNotes: 'Cliente desistiu da compra',
    createdAt: '2024-03-06T14:00:00Z',
    updatedAt: '2024-03-07T09:00:00Z'
  }
];

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: mockOrders,
  
  addOrder: (order) => {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set((state) => ({
      orders: [newOrder, ...state.orders]
    }));
  },
  
  updateOrder: (id, orderData) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? { ...o, ...orderData, updatedAt: new Date().toISOString() }
          : o
      )
    }));
  },
  
  deleteOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter((o) => o.id !== id)
    }));
  },
  
  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    }));
  },
  
  getOrderById: (id) => {
    return get().orders.find((o) => o.id === id);
  }
}));
