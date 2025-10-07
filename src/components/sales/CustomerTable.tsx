import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@/types/customer";
import { MoreHorizontal, Pencil, Trash2, Eye, Power, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CustomerTableProps {
  customers: Customer[];
  selectedCustomers: string[];
  onToggleSelection: (id: string) => void;
  onSelectAll: (customerIds: string[]) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onViewHistory: (customer: Customer) => void;
}

export const CustomerTable = ({
  customers,
  selectedCustomers,
  onToggleSelection,
  onSelectAll,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewHistory
}: CustomerTableProps) => {
  const allSelected = customers.length > 0 && selectedCustomers.length === customers.length;

  const getCategoryColor = (category: string) => {
    const colors = {
      'A': 'bg-green-500',
      'B': 'bg-blue-500',
      'C': 'bg-amber-500',
      'D': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Ativo': 'bg-green-500',
      'Inativo': 'bg-gray-500',
      'Bloqueado': 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const calculateCreditPercentage = (creditUsed: number, creditLimit: number) => {
    if (creditLimit === 0) return 0;
    return Math.round((creditUsed / creditLimit) * 100);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectAll(customers.map(c => c.id));
                  } else {
                    onSelectAll([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-center">Categoria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Faturamento</TableHead>
            <TableHead className="text-right">Crédito Usado</TableHead>
            <TableHead>Última Compra</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center h-32 text-muted-foreground">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => {
              const creditPercentage = calculateCreditPercentage(customer.creditUsed, customer.creditLimit);
              
              return (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => onToggleSelection(customer.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{customer.code}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      {customer.tradeName && (
                        <div className="text-xs text-muted-foreground">{customer.tradeName}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{customer.cpfCnpj}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {customer.type === 'Pessoa Física' ? 'PF' : 'PJ'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getCategoryColor(customer.category)} text-white`}>
                      {customer.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(customer.status)} text-white`}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {customer.totalPurchases.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm">
                        R$ {customer.creditUsed.toLocaleString('pt-BR')}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${creditPercentage > 80 ? 'bg-red-500' : creditPercentage > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(creditPercentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{creditPercentage}%</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.lastPurchase ? (
                      <div className="text-sm">
                        {format(new Date(customer.lastPurchase), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewHistory(customer)}>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Ver Histórico
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(customer)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(customer.id)}>
                          <Power className="mr-2 h-4 w-4" />
                          {customer.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(customer.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
