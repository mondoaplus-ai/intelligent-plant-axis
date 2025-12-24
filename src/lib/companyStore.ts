import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Company, CompanyFormData } from '@/types/company';

interface CompanyState {
  companies: Company[];
  addCompany: (data: CompanyFormData) => void;
  updateCompany: (id: string, data: Partial<CompanyFormData>) => void;
  deleteCompany: (id: string) => void;
  getCompanyById: (id: string) => Company | undefined;
}

const initialCompanies: Company[] = [
  {
    id: '1',
    code: 'EMP001',
    name: 'Indústria SmartERP Ltda',
    tradeName: 'SmartERP',
    cnpj: '12.345.678/0001-90',
    stateRegistration: '123.456.789.012',
    municipalRegistration: '12345678',
    type: 'matriz',
    address: {
      street: 'Av. Industrial',
      number: '1000',
      complement: 'Bloco A',
      neighborhood: 'Distrito Industrial',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    phone: '(11) 3456-7890',
    email: 'contato@smarterp.com.br',
    website: 'www.smarterp.com.br',
    status: 'ativa',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    code: 'EMP002',
    name: 'SmartERP Filial Campinas',
    tradeName: 'SmartERP Campinas',
    cnpj: '12.345.678/0002-71',
    stateRegistration: '123.456.789.013',
    municipalRegistration: '12345679',
    type: 'filial',
    parentCompanyId: '1',
    address: {
      street: 'Rua das Indústrias',
      number: '500',
      neighborhood: 'Jardim Industrial',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13030-000',
    },
    phone: '(19) 3456-7890',
    email: 'campinas@smarterp.com.br',
    status: 'ativa',
    createdAt: new Date('2021-06-15'),
    updatedAt: new Date(),
  },
];

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companies: initialCompanies,
      addCompany: (data) =>
        set((state) => ({
          companies: [
            ...state.companies,
            {
              ...data,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateCompany: (id, data) =>
        set((state) => ({
          companies: state.companies.map((company) =>
            company.id === id
              ? { ...company, ...data, updatedAt: new Date() }
              : company
          ),
        })),
      deleteCompany: (id) =>
        set((state) => ({
          companies: state.companies.filter((company) => company.id !== id),
        })),
      getCompanyById: (id) => get().companies.find((c) => c.id === id),
    }),
    {
      name: 'company-storage',
    }
  )
);
