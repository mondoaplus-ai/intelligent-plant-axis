import { create } from 'zustand';
import { StockMovement } from '@/types/stockMovement';

interface StockMovementStore {
  movements: StockMovement[];
  addMovement: (movement: Omit<StockMovement, 'id' | 'createdAt'>) => void;
  updateMovement: (id: string, movement: Partial<StockMovement>) => void;
  deleteMovement: (id: string) => void;
  getMovementById: (id: string) => StockMovement | undefined;
}

// Mock data
const mockMovements: StockMovement[] = [
  {
    id: '1',
    date: new Date('2024-03-15'),
    type: 'entrada',
    reason: 'compra',
    productId: '1',
    productCode: 'PROD-001',
    productName: 'Parafuso M8',
    quantity: 1000,
    unitCost: 0.5,
    totalCost: 500,
    toLocation: 'Depósito Principal',
    referenceDocument: 'NF-12345',
    notes: 'Compra para reposição de estoque',
    userId: '1',
    userName: 'João Silva',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    date: new Date('2024-03-16'),
    type: 'saida',
    reason: 'producao',
    productId: '1',
    productCode: 'PROD-001',
    productName: 'Parafuso M8',
    quantity: 200,
    unitCost: 0.5,
    totalCost: 100,
    fromLocation: 'Depósito Principal',
    referenceDocument: 'OP-789',
    notes: 'Utilização na ordem de produção',
    userId: '1',
    userName: 'João Silva',
    createdAt: new Date('2024-03-16'),
  },
  {
    id: '3',
    date: new Date('2024-03-17'),
    type: 'ajuste',
    reason: 'ajuste_inventario',
    productId: '2',
    productCode: 'PROD-002',
    productName: 'Porca M8',
    quantity: -50,
    unitCost: 0.3,
    totalCost: -15,
    toLocation: 'Depósito Principal',
    notes: 'Ajuste após inventário - divergência identificada',
    userId: '2',
    userName: 'Maria Santos',
    createdAt: new Date('2024-03-17'),
  },
  {
    id: '4',
    date: new Date('2024-03-18'),
    type: 'transferencia',
    reason: 'transferencia_deposito',
    productId: '3',
    productCode: 'PROD-003',
    productName: 'Chapa de Aço',
    quantity: 100,
    unitCost: 25,
    totalCost: 2500,
    fromLocation: 'Depósito Principal',
    toLocation: 'Depósito Secundário',
    referenceDocument: 'TRANS-456',
    notes: 'Transferência para linha de produção',
    userId: '1',
    userName: 'João Silva',
    createdAt: new Date('2024-03-18'),
  },
  {
    id: '5',
    date: new Date('2024-03-19'),
    type: 'saida',
    reason: 'venda',
    productId: '4',
    productCode: 'PROD-004',
    productName: 'Produto Final A',
    quantity: 50,
    unitCost: 100,
    totalCost: 5000,
    fromLocation: 'Depósito de Produtos Acabados',
    referenceDocument: 'PV-1001',
    notes: 'Venda para cliente XYZ',
    userId: '2',
    userName: 'Maria Santos',
    createdAt: new Date('2024-03-19'),
  },
];

export const useStockMovementStore = create<StockMovementStore>((set, get) => ({
  movements: mockMovements,
  
  addMovement: (movement) => {
    const newMovement: StockMovement = {
      ...movement,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    set((state) => ({
      movements: [newMovement, ...state.movements],
    }));
  },
  
  updateMovement: (id, updatedMovement) => {
    set((state) => ({
      movements: state.movements.map((movement) =>
        movement.id === id ? { ...movement, ...updatedMovement } : movement
      ),
    }));
  },
  
  deleteMovement: (id) => {
    set((state) => ({
      movements: state.movements.filter((movement) => movement.id !== id),
    }));
  },
  
  getMovementById: (id) => {
    return get().movements.find((movement) => movement.id === id);
  },
}));
