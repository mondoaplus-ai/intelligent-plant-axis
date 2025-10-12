import { create } from 'zustand';
import { BOM } from '@/types/bom';

interface BOMStore {
  boms: BOM[];
  addBOM: (bom: Omit<BOM, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBOM: (id: string, bom: Partial<BOM>) => void;
  deleteBOM: (id: string) => void;
  getBOMByProductId: (productId: string) => BOM | undefined;
}

// Dados de exemplo
const initialBOMs: BOM[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Produto A',
    version: '1.0',
    status: 'ativo',
    components: [
      {
        id: '1',
        productId: '2',
        productName: 'Matéria Prima X',
        quantity: 10,
        unit: 'kg',
        waste: 5,
        cost: 150,
      },
      {
        id: '2',
        productId: '3',
        productName: 'Componente Y',
        quantity: 2,
        unit: 'un',
        waste: 2,
        cost: 80,
      },
    ],
    processes: [
      {
        id: '1',
        name: 'Corte',
        sequence: 1,
        estimatedTime: 30,
        setupTime: 15,
        resourceId: 'REC001',
        resourceName: 'Serra CNC',
        description: 'Corte das peças conforme especificação',
      },
      {
        id: '2',
        name: 'Usinagem',
        sequence: 2,
        estimatedTime: 45,
        setupTime: 20,
        resourceId: 'REC002',
        resourceName: 'Torno CNC',
        description: 'Usinagem de precisão',
      },
      {
        id: '3',
        name: 'Montagem',
        sequence: 3,
        estimatedTime: 25,
        setupTime: 5,
        resourceId: 'REC003',
        resourceName: 'Bancada de Montagem',
        description: 'Montagem final do produto',
      },
    ],
    totalCost: 230,
    totalTime: 100,
    notes: 'Revisão aprovada em 2024-01-15',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'João Silva',
  },
];

export const useBOMStore = create<BOMStore>((set, get) => ({
  boms: initialBOMs,
  
  addBOM: (bom) => {
    const newBOM: BOM = {
      ...bom,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ boms: [...state.boms, newBOM] }));
  },
  
  updateBOM: (id, updatedBOM) => {
    set((state) => ({
      boms: state.boms.map((bom) =>
        bom.id === id
          ? { ...bom, ...updatedBOM, updatedAt: new Date() }
          : bom
      ),
    }));
  },
  
  deleteBOM: (id) => {
    set((state) => ({
      boms: state.boms.filter((bom) => bom.id !== id),
    }));
  },
  
  getBOMByProductId: (productId) => {
    return get().boms.find((bom) => bom.productId === productId && bom.status === 'ativo');
  },
}));
