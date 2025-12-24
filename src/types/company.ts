export interface Company {
  id: string;
  code: string;
  name: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  type: 'matriz' | 'filial';
  parentCompanyId?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  email: string;
  website?: string;
  status: 'ativa' | 'inativa';
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyFormData = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>;
