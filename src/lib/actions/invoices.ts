"use server";

import { InvoiceFormValues } from "@/lib/validation/invoice";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculateInvoiceTotals } from "@/lib/invoice/calc";
import { InvoiceStatus } from "@/lib/data/types";
import { createClient } from "@/lib/supabase/server";

export async function saveInvoice(data: InvoiceFormValues, action: "save_draft" | "send", invoiceId?: string, invoiceNumber?: string | null) {
  const totals = calculateInvoiceTotals(data.items, data.discountType, data.discountValue, data.taxRate);
  
  const status: InvoiceStatus = action === "send" ? "sent" : "draft";
  const number = invoiceNumber || (status === "sent" ? `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, "0")}` : null);
  
  const supabase = await createClient();
  
  // Find company to link to the invoice if needed, though mostly client_id is required
  const { data: companies } = await supabase.from('companies').select('id').limit(1);
  const company_id = companies && companies.length > 0 ? companies[0].id : null;

  const invoiceData = {
    client_id: data.clientId,
    company_id,
    number,
    status,
    issue_date: data.issueDate,
    due_date: data.dueDate,
    tax_rate: data.taxRate,
    discount_type: data.discountType,
    discount_value: data.discountValue,
    subtotal: totals.subtotal,
    discount_amount: totals.discountAmount,
    tax_amount: totals.taxAmount,
    total: totals.total,
    amount_paid: 0,
    notes: data.notes,
    terms: data.terms,
  };

  let actualInvoiceId = invoiceId;

  if (invoiceId) {
    await supabase.from('invoices').update(invoiceData).eq('id', invoiceId);
    // Delete old items
    await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId);
  } else {
    const { data: newInvoice } = await supabase.from('invoices').insert([invoiceData]).select().single();
    if (newInvoice) {
      actualInvoiceId = newInvoice.id;
    }
  }

  if (actualInvoiceId && data.items.length > 0) {
    const itemsData = data.items.map((item, index) => ({
      invoice_id: actualInvoiceId,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: Math.round(item.quantity * item.unitPrice),
      position: index,
    }));
    await supabase.from('invoice_items').insert(itemsData);
  }

  revalidatePath("/", "layout");
  
  // Redirect to invoices list
  redirect("/factures");
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient();
  await supabase.from('invoice_items').delete().eq('invoice_id', id);
  await supabase.from('invoices').delete().eq('id', id);
  revalidatePath("/", "layout");
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus) {
  const supabase = await createClient();
  await supabase.from('invoices').update({ status }).eq('id', id);
  revalidatePath("/", "layout");
}
