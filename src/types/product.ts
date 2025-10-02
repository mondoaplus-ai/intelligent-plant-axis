export type ProductCategory = 'Matéria-Prima' | 'Produto Acabado' | 'Embalagem' | 'Componente';
export type ProductType = 'Fabricado' | 'Comprado' | 'Revenda';
export type ProductUnit = 'UN' | 'KG' | 'M' | 'L' | 'M²' | 'M³';
export type ProductStatus = 'Ativo' | 'Inativo';

export interface ProductSupplier {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCode: string;
  price: number;
  deliveryDays: number;
  lastPurchase?: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: ProductCategory;
  type: ProductType;
  unit: ProductUnit;
  status: ProductStatus;
  photo?: string;
  ncm?: string;
  barcode?: string;
  
  // Estoque
  currentStock: number;
  minStock: number;
  maxStock: number;
  avgCost: number;
  netWeight?: number;
  grossWeight?: number;
  weightUnit?: 'KG' | 'G';
  
  // Produção (para Fabricado)
  productionTime?: number;
  productionTimeUnit?: 'min' | 'hora' | 'dia';
  yield?: number;
  leadTime?: number;
  setupTime?: number;
  productionNotes?: string;
  
  // Fornecedores (para Comprado/Revenda)
  suppliers?: ProductSupplier[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search: string;
  category: ProductCategory | 'Todos';
  status: ProductStatus | 'Todos';
  type: ProductType | 'Todos';
}

export interface ProductStore {
  products: Product[];
  filters: ProductFilters;
  selectedProducts: string[];
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Product | null;
  sortDirection: 'asc' | 'desc';
  
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteProducts: (ids: string[]) => void;
  toggleStatus: (id: string) => void;
  toggleProductSelection: (id: string) => void;
  selectAllProducts: (productIds: string[]) => void;
  clearSelection: () => void;
  setPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSorting: (field: keyof Product) => void;
}
