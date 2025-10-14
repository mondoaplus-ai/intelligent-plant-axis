import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { PriceListItem } from '@/types/priceList';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PriceTableProps {
  prices: PriceListItem[];
  onEdit: (price: PriceListItem) => void;
  onDelete: (id: string) => void;
  onView: (price: PriceListItem) => void;
}

export const PriceTable = ({ prices, onEdit, onDelete, onView }: PriceTableProps) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ativo: 'default',
      inativo: 'secondary',
      agendado: 'outline',
    };
    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getCustomerTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      todos: 'Todos',
      varejo: 'Varejo',
      atacado: 'Atacado',
      distribuidor: 'Distribuidor',
    };
    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Tipo Cliente</TableHead>
            <TableHead>Qtd. Min/Max</TableHead>
            <TableHead>Preço Base</TableHead>
            <TableHead>Desconto</TableHead>
            <TableHead>Preço Final</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prices.map((price) => (
            <TableRow key={price.id}>
              <TableCell className="font-medium">{price.productName}</TableCell>
              <TableCell>{price.productCode}</TableCell>
              <TableCell>{getCustomerTypeBadge(price.customerType)}</TableCell>
              <TableCell>
                {price.minQuantity}{price.maxQuantity ? ` - ${price.maxQuantity}` : '+'}
              </TableCell>
              <TableCell>R$ {price.basePrice.toLocaleString('pt-BR')}</TableCell>
              <TableCell>{price.discount}%</TableCell>
              <TableCell className="font-semibold">
                R$ {price.finalPrice.toLocaleString('pt-BR')}
              </TableCell>
              <TableCell className="text-sm">
                {format(price.validFrom, 'dd/MM/yyyy', { locale: ptBR })}
                {price.validUntil && (
                  <> até {format(price.validUntil, 'dd/MM/yyyy', { locale: ptBR })}</>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(price.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(price)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(price)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(price.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
