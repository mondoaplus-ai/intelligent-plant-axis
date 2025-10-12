import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, FileText } from 'lucide-react';
import { BOM } from '@/types/bom';
import { format } from 'date-fns';

interface BOMTableProps {
  boms: BOM[];
  onView: (bom: BOM) => void;
  onEdit: (bom: BOM) => void;
  onDelete: (id: string) => void;
}

export const BOMTable = ({ boms, onView, onEdit, onDelete }: BOMTableProps) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ativo: 'default',
      inativo: 'secondary',
      em_revisao: 'outline',
    };
    
    const labels: Record<string, string> = {
      ativo: 'Ativo',
      inativo: 'Inativo',
      em_revisao: 'Em Revisão',
    };
    
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Versão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Componentes</TableHead>
            <TableHead className="text-right">Processos</TableHead>
            <TableHead className="text-right">Custo Total</TableHead>
            <TableHead className="text-right">Tempo Total</TableHead>
            <TableHead>Atualizado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {boms.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma estrutura de produto encontrada</p>
              </TableCell>
            </TableRow>
          ) : (
            boms.map((bom) => (
              <TableRow key={bom.id}>
                <TableCell className="font-medium">{bom.productName}</TableCell>
                <TableCell>{bom.version}</TableCell>
                <TableCell>{getStatusBadge(bom.status)}</TableCell>
                <TableCell className="text-right">{bom.components.length}</TableCell>
                <TableCell className="text-right">{bom.processes.length}</TableCell>
                <TableCell className="text-right">R$ {bom.totalCost.toFixed(2)}</TableCell>
                <TableCell className="text-right">{bom.totalTime} min</TableCell>
                <TableCell>{format(new Date(bom.updatedAt), 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(bom)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(bom)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(bom.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
