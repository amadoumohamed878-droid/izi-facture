export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type DiscountType = 'percent' | 'amount' | null;

export interface InvoiceItem {
  id: string; // local id for form, uuid in db
  description: string;
  quantity: number;
  unitPrice: number; // integer (FCFA)
  lineTotal: number; // integer (FCFA)
}

export interface InvoiceData {
  id?: string;
  number?: string | null;
  clientId: string | null;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  createdAt?: number;
  
  items: InvoiceItem[];
  
  taxRate: number; // e.g. 18.00
  discountType: DiscountType;
  discountValue: number;
  
  // Computed values
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  
  notes?: string;
  terms?: string;
}

export interface CompanySettings {
  name: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website: string;
  currency: string;
  defaultTaxRate: number;
  bankName: string;
  bankAccount: string;
  notes: string;
}

export interface ClientData {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  notes?: string;
}

