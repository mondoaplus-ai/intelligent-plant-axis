export interface SystemSettings {
  general: {
    companyName: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
  production: {
    defaultShift: string;
    shiftDuration: number;
    autoGenerateOP: boolean;
    qualityCheckRequired: boolean;
    minStockAlert: number;
  };
  commercial: {
    defaultPaymentTerms: number;
    maxDiscount: number;
    requireApproval: boolean;
    approvalThreshold: number;
  };
  notifications: {
    emailEnabled: boolean;
    lowStockAlert: boolean;
    orderStatusChange: boolean;
    productionDelay: boolean;
    qualityIssue: boolean;
  };
  integrations: {
    erpEnabled: boolean;
    erpEndpoint?: string;
    apiKey?: string;
  };
}

export const defaultSettings: SystemSettings = {
  general: {
    companyName: 'SmartERP',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    currency: 'BRL',
    language: 'pt-BR',
  },
  production: {
    defaultShift: '1',
    shiftDuration: 8,
    autoGenerateOP: true,
    qualityCheckRequired: true,
    minStockAlert: 10,
  },
  commercial: {
    defaultPaymentTerms: 30,
    maxDiscount: 15,
    requireApproval: true,
    approvalThreshold: 10000,
  },
  notifications: {
    emailEnabled: true,
    lowStockAlert: true,
    orderStatusChange: true,
    productionDelay: true,
    qualityIssue: true,
  },
  integrations: {
    erpEnabled: false,
    erpEndpoint: '',
    apiKey: '',
  },
};
