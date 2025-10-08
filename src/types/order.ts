export type OrderStatus = 'orcamento' | 'aprovado' | 'producao' | 'faturado' | 'entregue' | 'cancelado';
export type OrderPriority = 'baixa' | 'normal' | 'alta' | 'urgente';
export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao' | 'boleto' | 'transferencia';
export type PaymentTerm = 'a-vista' | '7-dias' | '14-dias' | '30-dias' | '60-dias' | '90-dias';

export interface OrderItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  total: number;
  deliveryDate?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  
  // Cliente
  customerId: string;
  customerName: string;
  customerDocument: string;
  
  // Status e Prioridade
  status: OrderStatus;
  priority: OrderPriority;
  
  // Datas
  orderDate: string;
  expectedDelivery: string;
  deliveredDate?: string;
  
  // Itens
  items: OrderItem[];
  
  // Financeiro
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod?: PaymentMethod;
  paymentTerm?: PaymentTerm;
  
  // Entrega
  shippingAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Observações
  notes?: string;
  internalNotes?: string;
  
  // Rastreamento
  seller?: string;
  approvedBy?: string;
  approvedAt?: string;
  
  // Metadados
  createdAt: string;
  updatedAt: string;
}
