export type MovementType = 'entrada' | 'saida' | 'ajuste' | 'transferencia';
export type MovementReason = 
  | 'compra' 
  | 'venda' 
  | 'producao' 
  | 'devolucao' 
  | 'perda' 
  | 'ajuste_inventario'
  | 'transferencia_deposito';

export interface StockMovement {
  id: string;
  date: Date;
  type: MovementType;
  reason: MovementReason;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  fromLocation?: string;
  toLocation?: string;
  referenceDocument?: string;
  notes?: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface StockMovementFormData {
  type: MovementType;
  reason: MovementReason;
  productId: string;
  quantity: number;
  unitCost: number;
  fromLocation?: string;
  toLocation?: string;
  referenceDocument?: string;
  notes?: string;
}
