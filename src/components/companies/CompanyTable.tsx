import { Company } from '@/types/company';
import { useCompanyStore } from '@/lib/companyStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash2, Building2, Building } from 'lucide-react';

interface CompanyTableProps {
  onView: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
}

export const CompanyTable = ({
  onView,
  onEdit,
  onDelete,
  searchTerm,
  statusFilter,
  typeFilter,
}: CompanyTableProps) => {
  const { companies } = useCompanyStore();

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.cnpj.includes(searchTerm) ||
      company.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    const matchesType = typeFilter === 'all' || company.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: Company['status']) => {
    const variants: Record<Company['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      ativa: { variant: 'default', label: 'Ativa' },
      inativa: { variant: 'secondary', label: 'Inativa' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTypeBadge = (type: Company['type']) => {
    return type === 'matriz' ? (
      <Badge variant="outline" className="gap-1">
        <Building2 className="w-3 h-3" />
        Matriz
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <Building className="w-3 h-3" />
        Filial
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome Fantasia</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Cidade/UF</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Nenhuma empresa encontrada
              </TableCell>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.code}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{company.tradeName}</p>
                    <p className="text-sm text-muted-foreground">{company.name}</p>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{company.cnpj}</TableCell>
                <TableCell>{getTypeBadge(company.type)}</TableCell>
                <TableCell>
                  {company.address.city}/{company.address.state}
                </TableCell>
                <TableCell>{getStatusBadge(company.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => onView(company)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onEdit(company)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(company)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
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
