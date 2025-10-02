import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductStore, ProductFilters } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: '1',
    code: 'MP001',
    name: 'Resina PET',
    category: 'Matéria-Prima',
    type: 'Comprado',
    unit: 'KG',
    status: 'Ativo',
    currentStock: 1847,
    minStock: 500,
    maxStock: 3000,
    avgCost: 8.5,
    ncm: '3907.60.00',
    suppliers: [
      { id: '1', supplierId: 'F001', supplierName: 'Petroquímica Sul', supplierCode: 'PET-CLEAR', price: 8.5, deliveryDays: 7, lastPurchase: '2024-01-15' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    code: 'PA035',
    name: 'Garrafa 500ml Azul',
    category: 'Produto Acabado',
    type: 'Fabricado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 5420,
    minStock: 1000,
    maxStock: 10000,
    avgCost: 1.85,
    barcode: '7891234567890',
    productionTime: 45,
    productionTimeUnit: 'min',
    yield: 92,
    leadTime: 2,
    setupTime: 15,
    netWeight: 25,
    grossWeight: 30,
    weightUnit: 'G',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-20T16:45:00Z'
  },
  {
    id: '3',
    code: 'EMB012',
    name: 'Caixa Papelão 30x30',
    category: 'Embalagem',
    type: 'Comprado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 890,
    minStock: 500,
    maxStock: 2000,
    avgCost: 2.3,
    suppliers: [
      { id: '2', supplierId: 'F002', supplierName: 'Embalagens Premium', supplierCode: 'CX-30-OND', price: 2.3, deliveryDays: 5, lastPurchase: '2024-01-18' }
    ],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-18T11:20:00Z'
  },
  {
    id: '4',
    code: 'COMP08',
    name: 'Tampa Rosca 28mm',
    category: 'Componente',
    type: 'Comprado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 12450,
    minStock: 5000,
    maxStock: 20000,
    avgCost: 0.15,
    suppliers: [
      { id: '3', supplierId: 'F003', supplierName: 'Plásticos BR', supplierCode: 'TMP-28-BCO', price: 0.15, deliveryDays: 3, lastPurchase: '2024-01-22' }
    ],
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z'
  },
  {
    id: '5',
    code: 'REV003',
    name: 'Produto XYZ Terceiros',
    category: 'Produto Acabado',
    type: 'Revenda',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 234,
    minStock: 100,
    maxStock: 500,
    avgCost: 45.0,
    barcode: '7899876543210',
    suppliers: [
      { id: '4', supplierId: 'F004', supplierName: 'Distribuidor ABC', supplierCode: 'XYZ-REV', price: 45.0, deliveryDays: 10, lastPurchase: '2024-01-10' }
    ],
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-10T13:40:00Z'
  },
  {
    id: '6',
    code: 'MP002',
    name: 'Pigmento Azul Cobalto',
    category: 'Matéria-Prima',
    type: 'Comprado',
    unit: 'KG',
    status: 'Ativo',
    currentStock: 145,
    minStock: 50,
    maxStock: 300,
    avgCost: 125.5,
    ncm: '3204.17.00',
    suppliers: [
      { id: '5', supplierId: 'F005', supplierName: 'Química Cores', supplierCode: 'PIG-AZUL-COB', price: 125.5, deliveryDays: 15, lastPurchase: '2024-01-05' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-05T10:20:00Z'
  },
  {
    id: '7',
    code: 'PA040',
    name: 'Garrafa 1L Transparente',
    category: 'Produto Acabado',
    type: 'Fabricado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 3200,
    minStock: 1500,
    maxStock: 8000,
    avgCost: 2.45,
    barcode: '7891234567891',
    productionTime: 60,
    productionTimeUnit: 'min',
    yield: 90,
    leadTime: 3,
    setupTime: 20,
    netWeight: 45,
    grossWeight: 50,
    weightUnit: 'G',
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '8',
    code: 'COMP12',
    name: 'Rótulo Adesivo Premium',
    category: 'Componente',
    type: 'Comprado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 8500,
    minStock: 3000,
    maxStock: 15000,
    avgCost: 0.25,
    suppliers: [
      { id: '6', supplierId: 'F006', supplierName: 'Gráfica FastPrint', supplierCode: 'ROT-PREM-A4', price: 0.25, deliveryDays: 7, lastPurchase: '2024-01-19' }
    ],
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-19T14:10:00Z'
  },
  {
    id: '9',
    code: 'EMB015',
    name: 'Pallet PBR',
    category: 'Embalagem',
    type: 'Comprado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    avgCost: 85.0,
    suppliers: [
      { id: '7', supplierId: 'F007', supplierName: 'Madeireira Sul', supplierCode: 'PLT-PBR-STD', price: 85.0, deliveryDays: 5, lastPurchase: '2024-01-12' }
    ],
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-12T16:30:00Z'
  },
  {
    id: '10',
    code: 'MP005',
    name: 'Resina PP Copolímero',
    category: 'Matéria-Prima',
    type: 'Comprado',
    unit: 'KG',
    status: 'Ativo',
    currentStock: 2340,
    minStock: 1000,
    maxStock: 5000,
    avgCost: 6.8,
    ncm: '3902.10.20',
    suppliers: [
      { id: '8', supplierId: 'F001', supplierName: 'Petroquímica Sul', supplierCode: 'PP-COPO', price: 6.8, deliveryDays: 7, lastPurchase: '2024-01-16' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-16T11:45:00Z'
  },
  {
    id: '11',
    code: 'PA055',
    name: 'Pote 250ml Branco',
    category: 'Produto Acabado',
    type: 'Fabricado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 4800,
    minStock: 2000,
    maxStock: 10000,
    avgCost: 1.25,
    barcode: '7891234567892',
    productionTime: 30,
    productionTimeUnit: 'min',
    yield: 94,
    leadTime: 1,
    setupTime: 10,
    netWeight: 18,
    grossWeight: 22,
    weightUnit: 'G',
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-21T10:15:00Z'
  },
  {
    id: '12',
    code: 'COMP15',
    name: 'Lacre de Segurança',
    category: 'Componente',
    type: 'Comprado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 15200,
    minStock: 8000,
    maxStock: 25000,
    avgCost: 0.08,
    suppliers: [
      { id: '9', supplierId: 'F008', supplierName: 'Segurança Plus', supplierCode: 'LAC-SEG-STD', price: 0.08, deliveryDays: 10, lastPurchase: '2024-01-14' }
    ],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-14T13:25:00Z'
  },
  {
    id: '13',
    code: 'EMB020',
    name: 'Filme Stretch 500mm',
    category: 'Embalagem',
    type: 'Comprado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 28,
    minStock: 15,
    maxStock: 50,
    avgCost: 45.5,
    suppliers: [
      { id: '10', supplierId: 'F002', supplierName: 'Embalagens Premium', supplierCode: 'STR-500-17MC', price: 45.5, deliveryDays: 5, lastPurchase: '2024-01-17' }
    ],
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-17T15:50:00Z'
  },
  {
    id: '14',
    code: 'MP008',
    name: 'Aditivo UV Proteção',
    category: 'Matéria-Prima',
    type: 'Comprado',
    unit: 'KG',
    status: 'Inativo',
    currentStock: 35,
    minStock: 50,
    maxStock: 200,
    avgCost: 185.0,
    ncm: '3812.30.00',
    suppliers: [
      { id: '11', supplierId: 'F005', supplierName: 'Química Cores', supplierCode: 'ADT-UV-PRO', price: 185.0, deliveryDays: 20, lastPurchase: '2023-12-10' }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2023-12-10T09:30:00Z'
  },
  {
    id: '15',
    code: 'PA062',
    name: 'Tampa Flip-Top 24mm',
    category: 'Produto Acabado',
    type: 'Fabricado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 6700,
    minStock: 3000,
    maxStock: 12000,
    avgCost: 0.95,
    barcode: '7891234567893',
    productionTime: 25,
    productionTimeUnit: 'min',
    yield: 96,
    leadTime: 1,
    setupTime: 8,
    netWeight: 12,
    grossWeight: 15,
    weightUnit: 'G',
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-22T12:40:00Z'
  },
  {
    id: '16',
    code: 'REV008',
    name: 'Kit Promocional Verão',
    category: 'Produto Acabado',
    type: 'Revenda',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 180,
    minStock: 100,
    maxStock: 400,
    avgCost: 78.5,
    barcode: '7899876543211',
    suppliers: [
      { id: '12', supplierId: 'F009', supplierName: 'Marketing Produtos', supplierCode: 'KIT-VER-2024', price: 78.5, deliveryDays: 12, lastPurchase: '2024-01-11' }
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-11T16:20:00Z'
  },
  {
    id: '17',
    code: 'COMP18',
    name: 'Válvula Dosadora',
    category: 'Componente',
    type: 'Comprado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 4200,
    minStock: 2000,
    maxStock: 8000,
    avgCost: 1.85,
    suppliers: [
      { id: '13', supplierId: 'F010', supplierName: 'Componentes Tech', supplierCode: 'VLV-DOS-28', price: 1.85, deliveryDays: 8, lastPurchase: '2024-01-20' }
    ],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-20T14:55:00Z'
  },
  {
    id: '18',
    code: 'EMB025',
    name: 'Sacola Kraft 30x40',
    category: 'Embalagem',
    type: 'Comprado',
    unit: 'UN',
    status: 'Ativo',
    currentStock: 1250,
    minStock: 500,
    maxStock: 3000,
    avgCost: 0.85,
    suppliers: [
      { id: '14', supplierId: 'F002', supplierName: 'Embalagens Premium', supplierCode: 'SAC-KFT-30', price: 0.85, deliveryDays: 5, lastPurchase: '2024-01-21' }
    ],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-21T11:30:00Z'
  }
];

const defaultFilters: ProductFilters = {
  search: '',
  category: 'Todos',
  status: 'Todos',
  type: 'Todos'
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      filters: defaultFilters,
      selectedProducts: [],
      currentPage: 1,
      itemsPerPage: 10,
      sortField: null,
      sortDirection: 'asc',

      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
        currentPage: 1
      })),

      clearFilters: () => set({
        filters: defaultFilters,
        currentPage: 1
      }),

      addProduct: (product) => set((state) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return { products: [newProduct, ...state.products] };
      }),

      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map((p) =>
          p.id === id
            ? { ...p, ...updates, updatedAt: new Date().toISOString() }
            : p
        )
      })),

      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        selectedProducts: state.selectedProducts.filter((sid) => sid !== id)
      })),

      deleteProducts: (ids) => set((state) => ({
        products: state.products.filter((p) => !ids.includes(p.id)),
        selectedProducts: []
      })),

      toggleStatus: (id) => set((state) => ({
        products: state.products.map((p) =>
          p.id === id
            ? { ...p, status: p.status === 'Ativo' ? 'Inativo' : 'Ativo', updatedAt: new Date().toISOString() }
            : p
        )
      })),

      toggleProductSelection: (id) => set((state) => ({
        selectedProducts: state.selectedProducts.includes(id)
          ? state.selectedProducts.filter((sid) => sid !== id)
          : [...state.selectedProducts, id]
      })),

      selectAllProducts: (productIds) => set({ selectedProducts: productIds }),

      clearSelection: () => set({ selectedProducts: [] }),

      setPage: (page) => set({ currentPage: page }),

      setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),

      setSorting: (field) => set((state) => ({
        sortField: field,
        sortDirection: state.sortField === field && state.sortDirection === 'asc' ? 'desc' : 'asc'
      }))
    }),
    {
      name: 'product-storage'
    }
  )
);
