export interface InvoiceItem {
  id?: number;
  itemName: string;
  rate: number;
  quantity: number;
  amount: number;
}

export interface Invoice {
  id?: number;
  invoiceNumber: string;
  date: string;
  storeId: number;
  storeName: string;
  storeAddress: string;
  storeContact: string;
  storeGstin: string;
  buyerName: string;
  buyerAddress: string;
  buyerContact: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  sgst: number;
  cgst: number;
  total: number;
  balanceDue: number;
  paymentMode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceSummary {
  totalInvoices: number;
  totalRevenue: number;
  averageInvoiceValue: number;
  pendingAmount: number;
}

export interface InvoiceFilter {
  dateFrom?: string;
  dateTo?: string;
  storeId?: number;
  buyerName?: string;
  paymentMode?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface StoreTypeConfig {
  defaultItems: {
    itemName: string;
    rate: number;
    quantity: number;
  }[];
  taxRate?: number;
  currency?: string;
  defaultPaymentMode?: string;
}
