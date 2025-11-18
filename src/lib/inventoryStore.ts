import { create } from 'zustand';
import { InventoryItem, InventoryAdjustment } from '@/types/inventory';

interface InventoryStore {
  items: InventoryItem[];
  updateInventory: (id: string, item: Partial<InventoryItem>) => void;
  adjustInventory: (adjustment: InventoryAdjustment) => void;
  getInventoryById: (id: string) => InventoryItem | undefined;
  getLowStockItems: () => InventoryItem[];
}

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: '1',
    productId: '1',
    productCode: 'PROD-001',
    productName: 'Parafuso M8',
    productCategory: 'Fixação',
    currentStock: 850,
    minStock: 500,
    maxStock: 2000,
    avgCost: 0.5,
    totalValue: 425,
    location: 'Depósito Principal - A1',
    lastMovement: new Date('2024-03-19'),
    status: 'normal',
    unit: 'UN',
    reservedStock: 50,
    availableStock: 800,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-19'),
  },
  {
    id: '2',
    productId: '2',
    productCode: 'PROD-002',
    productName: 'Porca M8',
    productCategory: 'Fixação',
    currentStock: 320,
    minStock: 400,
    maxStock: 1500,
    avgCost: 0.3,
    totalValue: 96,
    location: 'Depósito Principal - A2',
    lastMovement: new Date('2024-03-17'),
    status: 'low',
    unit: 'UN',
    reservedStock: 20,
    availableStock: 300,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-17'),
  },
  {
    id: '3',
    productId: '3',
    productCode: 'PROD-003',
    productName: 'Chapa de Aço',
    productCategory: 'Matéria-Prima',
    currentStock: 45,
    minStock: 100,
    maxStock: 500,
    avgCost: 25,
    totalValue: 1125,
    location: 'Depósito Principal - B1',
    lastMovement: new Date('2024-03-18'),
    status: 'critical',
    unit: 'UN',
    reservedStock: 10,
    availableStock: 35,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-18'),
  },
  {
    id: '4',
    productId: '4',
    productCode: 'PROD-004',
    productName: 'Produto Final A',
    productCategory: 'Produto Acabado',
    currentStock: 150,
    minStock: 50,
    maxStock: 200,
    avgCost: 100,
    totalValue: 15000,
    location: 'Depósito de Produtos Acabados',
    lastMovement: new Date('2024-03-19'),
    status: 'normal',
    unit: 'UN',
    reservedStock: 30,
    availableStock: 120,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-19'),
  },
  {
    id: '5',
    productId: '5',
    productCode: 'PROD-005',
    productName: 'Tinta Automotiva',
    productCategory: 'Acabamento',
    currentStock: 2500,
    minStock: 200,
    maxStock: 1000,
    avgCost: 15,
    totalValue: 37500,
    location: 'Depósito Secundário',
    lastMovement: new Date('2024-03-15'),
    status: 'overstock',
    unit: 'L',
    reservedStock: 0,
    availableStock: 2500,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '6',
    productId: '6',
    productCode: 'PROD-006',
    productName: 'Arruela M8',
    productCategory: 'Fixação',
    currentStock: 180,
    minStock: 300,
    maxStock: 1000,
    avgCost: 0.15,
    totalValue: 27,
    location: 'Depósito Principal - A3',
    lastMovement: new Date('2024-03-16'),
    status: 'low',
    unit: 'UN',
    reservedStock: 30,
    availableStock: 150,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-16'),
  },
];

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: mockInventory,
  
  updateInventory: (id, updatedItem) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem, updatedAt: new Date() } : item
      ),
    }));
  },
  
  adjustInventory: (adjustment) => {
    const item = get().items.find(i => i.productId === adjustment.productId);
    if (item) {
      const newStock = adjustment.physicalCount;
      const availableStock = newStock - item.reservedStock;
      let status: 'normal' | 'low' | 'critical' | 'overstock' = 'normal';
      
      if (newStock <= item.minStock * 0.5) status = 'critical';
      else if (newStock <= item.minStock) status = 'low';
      else if (newStock >= item.maxStock) status = 'overstock';
      
      get().updateInventory(item.id, {
        currentStock: newStock,
        availableStock,
        status,
        totalValue: newStock * item.avgCost,
        lastMovement: new Date(),
      });
    }
  },
  
  getInventoryById: (id) => {
    return get().items.find((item) => item.id === id);
  },
  
  getLowStockItems: () => {
    return get().items.filter((item) => 
      item.status === 'low' || item.status === 'critical'
    );
  },
}));
