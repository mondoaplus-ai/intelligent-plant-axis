import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductionOrder } from '@/types/productionOrder';

interface ProductionOrderState {
  orders: ProductionOrder[];
  addOrder: (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (id: string, order: Partial<ProductionOrder>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => ProductionOrder | undefined;
}

const mockOrders: ProductionOrder[] = [
  {
    id: '1',
    orderNumber: 'OP-2025-001',
    productId: '1',
    productName: 'Parafuso M8x50',
    productCode: 'PAR-M8-50',
    quantityPlanned: 5000,
    quantityProduced: 4200,
    quantityRejected: 80,
    unit: 'UN',
    status: 'Produzindo',
    priority: 'Alta',
    machine: 'Torno CNC 01',
    operator: 'João Santos',
    startDate: '2025-01-15T08:00:00',
    expectedEndDate: '2025-01-18T17:00:00',
    setupTime: 45,
    productionTime: 1680,
    stopTime: 30,
    efficiency: 92.5,
    aiOptimized: true,
    rawMaterials: [
      {
        id: 'rm1',
        productId: '11',
        productName: 'Aço 1020 Ø8mm',
        quantityRequired: 25,
        quantityUsed: 21,
        unit: 'KG',
        available: 150
      }
    ],
    appointments: [
      {
        id: 'app1',
        timestamp: '2025-01-15T08:45:00',
        operator: 'João Santos',
        quantityProduced: 500,
        quantityRejected: 10,
        notes: 'Setup concluído'
      },
      {
        id: 'app2',
        timestamp: '2025-01-15T14:00:00',
        operator: 'João Santos',
        quantityProduced: 1200,
        quantityRejected: 20,
        stopReason: 'Troca Ferramenta',
        stopDuration: 15
      }
    ],
    timeline: [
      {
        id: 't1',
        timestamp: '2025-01-15T07:30:00',
        type: 'status_change',
        description: 'OP criada',
        user: 'Carlos Silva'
      },
      {
        id: 't2',
        timestamp: '2025-01-15T08:00:00',
        type: 'status_change',
        description: 'Iniciado setup',
        user: 'João Santos'
      }
    ],
    notes: 'Cliente urgente - priorizar',
    createdAt: '2025-01-15T07:30:00',
    updatedAt: '2025-01-15T14:15:00',
    createdBy: 'Carlos Silva'
  },
  {
    id: '2',
    orderNumber: 'OP-2025-002',
    productId: '2',
    productName: 'Porca Sextavada M8',
    productCode: 'POR-M8',
    quantityPlanned: 10000,
    quantityProduced: 10000,
    quantityRejected: 150,
    unit: 'UN',
    status: 'Concluída',
    priority: 'Normal',
    machine: 'Prensa Excêntrica 02',
    operator: 'Maria Oliveira',
    startDate: '2025-01-10T08:00:00',
    expectedEndDate: '2025-01-12T17:00:00',
    actualEndDate: '2025-01-12T15:30:00',
    setupTime: 30,
    productionTime: 1200,
    stopTime: 45,
    efficiency: 95.8,
    aiOptimized: false,
    rawMaterials: [
      {
        id: 'rm2',
        productId: '12',
        productName: 'Chapa Aço 1020 3mm',
        quantityRequired: 50,
        quantityUsed: 51,
        unit: 'KG',
        available: 200
      }
    ],
    appointments: [],
    timeline: [],
    createdAt: '2025-01-10T07:00:00',
    updatedAt: '2025-01-12T15:30:00',
    createdBy: 'Carlos Silva'
  },
  {
    id: '3',
    orderNumber: 'OP-2025-003',
    productId: '3',
    productName: 'Arruela Lisa M10',
    productCode: 'ARR-M10',
    quantityPlanned: 8000,
    quantityProduced: 0,
    quantityRejected: 0,
    unit: 'UN',
    status: 'Planejada',
    priority: 'Baixa',
    machine: 'Prensa Excêntrica 01',
    startDate: '2025-01-20T08:00:00',
    expectedEndDate: '2025-01-22T17:00:00',
    aiOptimized: true,
    rawMaterials: [
      {
        id: 'rm3',
        productId: '13',
        productName: 'Arame Aço 1010 Ø3mm',
        quantityRequired: 40,
        quantityUsed: 0,
        unit: 'KG',
        available: 80
      }
    ],
    appointments: [],
    timeline: [
      {
        id: 't3',
        timestamp: '2025-01-13T10:00:00',
        type: 'status_change',
        description: 'OP planejada pela IA',
        user: 'Sistema IA'
      }
    ],
    notes: 'Aguardando liberação de matéria-prima',
    createdAt: '2025-01-13T10:00:00',
    updatedAt: '2025-01-13T10:00:00',
    createdBy: 'Sistema IA'
  },
  {
    id: '4',
    orderNumber: 'OP-2025-004',
    productId: '4',
    productName: 'Eixo Transmissão X50',
    productCode: 'EIX-X50',
    quantityPlanned: 200,
    quantityProduced: 0,
    quantityRejected: 0,
    unit: 'UN',
    status: 'Em Setup',
    priority: 'Urgente',
    machine: 'Torno CNC 02',
    operator: 'Pedro Costa',
    startDate: '2025-01-15T16:00:00',
    expectedEndDate: '2025-01-17T17:00:00',
    setupTime: 60,
    aiOptimized: true,
    rawMaterials: [
      {
        id: 'rm4',
        productId: '14',
        productName: 'Aço 4340 Ø50mm',
        quantityRequired: 100,
        quantityUsed: 0,
        unit: 'KG',
        available: 120
      }
    ],
    appointments: [],
    timeline: [
      {
        id: 't4',
        timestamp: '2025-01-15T16:00:00',
        type: 'status_change',
        description: 'Setup iniciado',
        user: 'Pedro Costa'
      }
    ],
    notes: 'Material especial - atenção ao tratamento térmico',
    createdAt: '2025-01-15T14:00:00',
    updatedAt: '2025-01-15T16:00:00',
    createdBy: 'Carlos Silva'
  },
  {
    id: '5',
    orderNumber: 'OP-2025-005',
    productId: '5',
    productName: 'Engrenagem Z24',
    productCode: 'ENG-Z24',
    quantityPlanned: 500,
    quantityProduced: 280,
    quantityRejected: 15,
    unit: 'UN',
    status: 'Pausada',
    priority: 'Normal',
    machine: 'Fresadora CNC 01',
    operator: 'Ana Lima',
    startDate: '2025-01-14T08:00:00',
    expectedEndDate: '2025-01-16T17:00:00',
    setupTime: 90,
    productionTime: 840,
    stopTime: 180,
    efficiency: 78.5,
    aiOptimized: false,
    rawMaterials: [
      {
        id: 'rm5',
        productId: '15',
        productName: 'Aço SAE 1045',
        quantityRequired: 75,
        quantityUsed: 42,
        unit: 'KG',
        available: 50
      }
    ],
    appointments: [
      {
        id: 'app3',
        timestamp: '2025-01-14T12:00:00',
        operator: 'Ana Lima',
        quantityProduced: 280,
        quantityRejected: 15,
        stopReason: 'Manutenção',
        stopDuration: 180,
        notes: 'Manutenção preventiva - retorno previsto 15/01'
      }
    ],
    timeline: [],
    notes: 'Parada para manutenção preventiva',
    createdAt: '2025-01-14T07:00:00',
    updatedAt: '2025-01-14T12:00:00',
    createdBy: 'Carlos Silva'
  }
];

export const useProductionOrderStore = create<ProductionOrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      
      addOrder: (orderData) => {
        const newOrder: ProductionOrder = {
          ...orderData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
      },
      
      updateOrder: (id, orderData) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? { ...order, ...orderData, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },
      
      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }));
      },
      
      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },
    }),
    {
      name: 'production-orders-storage',
    }
  )
);
