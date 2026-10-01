import { InvoiceData, ClientData, CompanySettings, InvoiceItem } from "./types";

export function mapInvoiceFromDB(dbInvoice: any): InvoiceData {
  return {
    id: dbInvoice.id,
    number: dbInvoice.number,
    clientId: dbInvoice.client_id,
    status: dbInvoice.status,
    issueDate: dbInvoice.issue_date,
    dueDate: dbInvoice.due_date,
    createdAt: dbInvoice.created_at ? new Date(dbInvoice.created_at).getTime() : undefined,
    items: (dbInvoice.invoice_items || []).map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.line_total
    })),
    taxRate: dbInvoice.tax_rate || 0,
    discountType: dbInvoice.discount_type,
    discountValue: dbInvoice.discount_value || 0,
    subtotal: dbInvoice.subtotal || 0,
    discountAmount: dbInvoice.discount_amount || 0,
    taxAmount: dbInvoice.tax_amount || 0,
    total: dbInvoice.total || 0,
    amountPaid: dbInvoice.amount_paid || 0,
    notes: dbInvoice.notes || "",
    terms: dbInvoice.terms || "",
  };
}

export function mapClientFromDB(dbClient: any): ClientData {
  return {
    id: dbClient.id,
    name: dbClient.name,
    email: dbClient.email || "",
    phone: dbClient.phone || "",
    address: dbClient.address || "",
    city: dbClient.city || "",
    country: dbClient.country || "",
    contactName: dbClient.contact_name || "",
    notes: dbClient.notes || "",
  };
}

export function mapCompanyFromDB(dbCompany: any): CompanySettings {
  return {
    name: dbCompany.name,
    taxId: dbCompany.tax_id || "",
    email: dbCompany.email || "",
    phone: dbCompany.phone || "",
    address: dbCompany.address || "",
    city: dbCompany.city || "",
    country: dbCompany.country || "",
    website: dbCompany.website || "",
    currency: dbCompany.currency || "FCFA",
    defaultTaxRate: dbCompany.default_tax_rate || 18,
    bankName: dbCompany.bank_name || "",
    bankAccount: dbCompany.bank_account || "",
    notes: dbCompany.notes || "",
  };
}
