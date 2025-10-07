export interface Appointment {
  id: string;
  orderNumber: string;
  productionOrderId: string;
  productName: string;
  productCode: string;
  machine: string;
  operator: string;
  shift: 'Manhã' | 'Tarde' | 'Noite';
  date: string;
  startTime: string;
  endTime?: string;
  quantityProduced: number;
  quantityRejected: number;
  setupTime?: number;
  productionTime?: number;
  stopTime?: number;
  stopReason?: string;
  notes?: string;
  efficiency?: number;
  oee?: number;
  availability?: number;
  performance?: number;
  quality?: number;
  status: 'Em Andamento' | 'Concluído' | 'Pausado';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface OEEMetrics {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export interface EfficiencyData {
  machine: string;
  efficiency: number;
  oee: number;
  totalProduced: number;
  totalRejected: number;
}
