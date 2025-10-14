export interface PriceListItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  basePrice: number;
  discount: number;
  finalPrice: number;
  minQuantity: number;
  maxQuantity?: number;
  customerType: 'todos' | 'varejo' | 'atacado' | 'distribuidor';
  validFrom: Date;
  validUntil?: Date;
  status: 'ativo' | 'inativo' | 'agendado';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  notes?: string;
}

export interface PriceRule {
  id: string;
  name: string;
  type: 'desconto_percentual' | 'desconto_valor' | 'preco_fixo' | 'margem';
  value: number;
  conditions: {
    minQuantity?: number;
    maxQuantity?: number;
    customerType?: string;
    productCategory?: string;
  };
  priority: number;
  status: 'ativo' | 'inativo';
}
