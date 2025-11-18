export type InventoryStatus = 'normal' | 'low' | 'critical' | 'overstock';

export interface InventoryItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productCategory: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  avgCost: number;
  totalValue: number;
  location: string;
  lastMovement: Date;
  status: InventoryStatus;
  unit: string;
  reservedStock: number;
  availableStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryAdjustment {
  productId: string;
  physicalCount: number;
  systemCount: number;
  difference: number;
  reason: string;
  notes?: string;
}
