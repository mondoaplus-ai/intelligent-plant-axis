import { create } from 'zustand';
import { PriceListItem } from '@/types/priceList';

interface PriceListStore {
  prices: PriceListItem[];
  addPrice: (price: Omit<PriceListItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrice: (id: string, price: Partial<PriceListItem>) => void;
  deletePrice: (id: string) => void;
}

const initialPrices: PriceListItem[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Produto A',
    productCode: 'PROD-001',
    basePrice: 1500,
    discount: 10,
    finalPrice: 1350,
    minQuantity: 1,
    maxQuantity: 10,
    customerType: 'varejo',
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    status: 'ativo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'Admin',
    notes: 'Preço promocional para varejo',
  },
  {
    id: '2',
    productId: '1',
    productName: 'Produto A',
    productCode: 'PROD-001',
    basePrice: 1500,
    discount: 20,
    finalPrice: 1200,
    minQuantity: 11,
    maxQuantity: 50,
    customerType: 'atacado',
    validFrom: new Date('2024-01-01'),
    validUntil: new Date('2024-12-31'),
    status: 'ativo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'Admin',
    notes: 'Desconto para atacado',
  },
  {
    id: '3',
    productId: '2',
    productName: 'Produto B',
    productCode: 'PROD-002',
    basePrice: 850,
    discount: 5,
    finalPrice: 807.5,
    minQuantity: 1,
    customerType: 'todos',
    validFrom: new Date('2024-02-01'),
    status: 'ativo',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'Admin',
  },
];

export const usePriceListStore = create<PriceListStore>((set) => ({
  prices: initialPrices,
  
  addPrice: (price) => {
    const newPrice: PriceListItem = {
      ...price,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ prices: [...state.prices, newPrice] }));
  },
  
  updatePrice: (id, updatedPrice) => {
    set((state) => ({
      prices: state.prices.map((price) =>
        price.id === id
          ? { ...price, ...updatedPrice, updatedAt: new Date() }
          : price
      ),
    }));
  },
  
  deletePrice: (id) => {
    set((state) => ({
      prices: state.prices.filter((price) => price.id !== id),
    }));
  },
}));
