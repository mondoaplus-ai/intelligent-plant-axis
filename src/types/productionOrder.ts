export type ProductionOrderStatus = 
  | 'Planejada' 
  | 'Em Setup' 
  | 'Produzindo' 
  | 'Pausada' 
  | 'Concluída' 
  | 'Cancelada';

export type StopReason = 
  | 'Setup' 
  | 'Manutenção' 
  | 'Troca Ferramenta' 
  | 'Falta Material' 
  | 'Qualidade' 
  | 'Outros';

export interface RawMaterial {
  id: string;
  productId: string;
  productName: string;
  quantityRequired: number;
  quantityUsed: number;
  unit: string;
  available: number;
}

export interface ProductionAppointment {
  id: string;
  timestamp: string;
  operator: string;
  quantityProduced: number;
  quantityRejected: number;
  stopReason?: StopReason;
  stopDuration?: number; // minutos
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'status_change' | 'appointment' | 'stop' | 'note';
  description: string;
  user: string;
  icon?: string;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productCode: string;
  quantityPlanned: number;
  quantityProduced: number;
  quantityRejected: number;
  unit: string;
  status: ProductionOrderStatus;
  priority: 'Baixa' | 'Normal' | 'Alta' | 'Urgente';
  machine: string;
  operator?: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  setupTime?: number; // minutos
  productionTime?: number; // minutos
  stopTime?: number; // minutos
  efficiency?: number; // %
  aiOptimized?: boolean;
  rawMaterials: RawMaterial[];
  appointments: ProductionAppointment[];
  timeline: TimelineEvent[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
