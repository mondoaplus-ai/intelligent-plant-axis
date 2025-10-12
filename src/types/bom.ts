export interface BOMComponent {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  waste: number; // percentual de perda
  cost: number;
}

export interface ProductionProcess {
  id: string;
  name: string;
  sequence: number;
  estimatedTime: number; // em minutos
  setupTime: number; // tempo de setup em minutos
  resourceId?: string;
  resourceName?: string;
  description?: string;
}

export interface BOM {
  id: string;
  productId: string;
  productName: string;
  version: string;
  status: 'ativo' | 'inativo' | 'em_revisao';
  components: BOMComponent[];
  processes: ProductionProcess[];
  totalCost: number;
  totalTime: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
