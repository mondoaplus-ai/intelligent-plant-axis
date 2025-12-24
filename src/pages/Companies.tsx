import { useState } from 'react';
import { Company } from '@/types/company';
import { useCompanyStore } from '@/lib/companyStore';
import { CompanyTable } from '@/components/companies/CompanyTable';
import { CompanyFilters } from '@/components/companies/CompanyFilters';
import { CompanyStats } from '@/components/companies/CompanyStats';
import { CompanyModal } from '@/components/companies/CompanyModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const Companies = () => {
  const { deleteCompany } = useCompanyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('add');

  const handleAdd = () => {
    setSelectedCompany(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (company: Company) => {
    deleteCompany(company.id);
    toast.success('Empresa excluída com sucesso!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empresas</h1>
          <p className="text-muted-foreground">Gerencie as empresas do sistema</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      <CompanyStats />

      <CompanyFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      <CompanyTable
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CompanyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        company={selectedCompany}
        mode={modalMode}
      />
    </div>
  );
};

export default Companies;
