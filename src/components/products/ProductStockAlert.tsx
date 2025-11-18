import { AlertTriangle, TrendingDown, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

interface ProductStockAlertProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
}

export const ProductStockAlert = ({ products, onViewProduct }: ProductStockAlertProps) => {
  const criticalProducts = products.filter(p => p.currentStock < p.minStock * 0.5);
  const lowStockProducts = products.filter(p => 
    p.currentStock >= p.minStock * 0.5 && p.currentStock < p.minStock
  );

  if (criticalProducts.length === 0 && lowStockProducts.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-500/50 bg-orange-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-base">Alertas de Estoque</CardTitle>
        </div>
        <CardDescription>
          {criticalProducts.length > 0 && (
            <span className="text-red-600 dark:text-red-400 font-medium">
              {criticalProducts.length} {criticalProducts.length === 1 ? 'produto' : 'produtos'} em nível crítico
            </span>
          )}
          {criticalProducts.length > 0 && lowStockProducts.length > 0 && ' • '}
          {lowStockProducts.length > 0 && (
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              {lowStockProducts.length} {lowStockProducts.length === 1 ? 'produto' : 'produtos'} com estoque baixo
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {criticalProducts.slice(0, 3).map(product => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-center gap-3">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div>
                <div className="font-medium text-sm">{product.code} - {product.name}</div>
                <div className="text-xs text-muted-foreground">
                  Estoque: {product.currentStock} {product.unit} (Mín: {product.minStock})
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">Crítico</Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewProduct(product)}
              >
                Ver
              </Button>
            </div>
          </div>
        ))}
        {lowStockProducts.slice(0, 3).map(product => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20"
          >
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-orange-500" />
              <div>
                <div className="font-medium text-sm">{product.code} - {product.name}</div>
                <div className="text-xs text-muted-foreground">
                  Estoque: {product.currentStock} {product.unit} (Mín: {product.minStock})
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Baixo</Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewProduct(product)}
              >
                Ver
              </Button>
            </div>
          </div>
        ))}
        {(criticalProducts.length + lowStockProducts.length) > 6 && (
          <div className="text-center text-sm text-muted-foreground pt-2">
            E mais {(criticalProducts.length + lowStockProducts.length) - 6} produtos...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
