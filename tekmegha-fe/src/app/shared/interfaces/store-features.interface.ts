export interface StoreFeatures {
  storeId: string;
  storeCode: string;
  storeName: string;
  storeType: string;
  enableProducts: boolean;
  enableCart: boolean;
  enablePayments: boolean;
  enableInventory: boolean;
  enableInvoices: boolean;
  enableCustomers: boolean;
  enableReports: boolean;
}

export interface StoreFeatureCheck {
  isEnabled: boolean;
  feature: string;
  storeCode: string;
}

export type StoreFeatureType = 
  | 'products' 
  | 'cart' 
  | 'payments' 
  | 'inventory' 
  | 'invoices' 
  | 'customers' 
  | 'reports';
