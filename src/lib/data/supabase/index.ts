import { createClient } from "@/lib/supabase/client";
import { InvoiceData, CompanySettings, InvoiceStatus } from "../types";
import { ClientData } from "../types";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-ref") &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith("eyJ")
  );
}

export async function getCompanySettingsSupabase(): Promise<CompanySettings | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("companies").select("*").limit(1).maybeSingle();
    if (error || !data) return null;

    return {
      name: data.name || "",
      taxId: data.tax_id || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      country: data.country || "Sénégal",
      website: data.website || "",
      currency: data.currency || "FCFA",
      defaultTaxRate: Number(data.default_tax_rate ?? 18),
      bankName: data.bank_name || "",
      bankAccount: data.bank_account || "",
      notes: data.notes || "",
    };
  } catch (err) {
    console.error("Error fetching company settings from Supabase:", err);
    return null;
  }
}

export async function saveCompanySettingsSupabase(settings: CompanySettings): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createClient();
    const { data: existing } = await supabase.from("companies").select("id").limit(1).maybeSingle();
    
    const payload = {
      name: settings.name,
      tax_id: settings.taxId,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      city: settings.city,
      country: settings.country,
      website: settings.website,
      currency: settings.currency,
      default_tax_rate: settings.defaultTaxRate,
      bank_name: settings.bankName,
      bank_account: settings.bankAccount,
      notes: settings.notes,
    };

    if (existing?.id) {
      const { error } = await supabase.from("companies").update(payload).eq("id", existing.id);
      return !error;
    } else {
      const { error } = await supabase.from("companies").insert(payload);
      return !error;
    }
  } catch (err) {
    console.error("Error saving company settings to Supabase:", err);
    return false;
  }
}

export async function getClientsSupabase(): Promise<ClientData[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("clients").select("*").order("name", { ascending: true });
    if (error || !data) return null;

    return data.map(c => ({
      id: c.id,
      name: c.name,
      contactName: c.contact_name || undefined,
      email: c.email || undefined,
      phone: c.phone || undefined,
      address: c.address || undefined,
      city: c.city || undefined,
      country: c.country || undefined,
      taxId: c.tax_id || undefined,
      notes: c.notes || undefined,
    }));
  } catch (err) {
    console.error("Error fetching clients from Supabase:", err);
    return null;
  }
}

export async function saveClientSupabase(client: ClientData): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createClient();
    const payload = {
      name: client.name,
      contact_name: client.contactName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      country: client.country,
      tax_id: client.taxId,
      notes: client.notes,
    };

    const isUuid = client.id && client.id.length > 20 && client.id.includes("-");
    if (isUuid) {
      const { error } = await supabase.from("clients").update(payload).eq("id", client.id);
      return !error;
    } else {
      const { error } = await supabase.from("clients").insert(payload);
      return !error;
    }
  } catch (err) {
    console.error("Error saving client to Supabase:", err);
    return false;
  }
}

export async function deleteClientSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createClient();
    const { error } = await supabase.from("clients").delete().eq("id", id);
    return !error;
  } catch (err) {
    console.error("Error deleting client from Supabase:", err);
    return false;
  }
}

export async function getInvoicesSupabase(): Promise<InvoiceData[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createClient();
    const { data: invoices, error: invErr } = await supabase
      .from("invoices")
      .select("*, invoice_items(*)")
      .order("created_at", { ascending: false });

    if (invErr || !invoices) return null;

    return invoices.map(i => ({
      id: i.id,
      number: i.number,
      clientId: i.client_id,
      status: i.status as InvoiceStatus,
      issueDate: i.issue_date,
      dueDate: i.due_date,
      createdAt: i.created_at ? new Date(i.created_at).getTime() : Date.now(),
      taxRate: Number(i.tax_rate ?? 18),
      discountType: i.discount_type,
      discountValue: Number(i.discount_value ?? 0),
      subtotal: Number(i.subtotal ?? 0),
      discountAmount: Number(i.discount_amount ?? 0),
      taxAmount: Number(i.tax_amount ?? 0),
      total: Number(i.total ?? 0),
      amountPaid: Number(i.amount_paid ?? 0),
      notes: i.notes || undefined,
      terms: i.terms || undefined,
      items: (i.invoice_items || []).map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unit_price),
        lineTotal: Number(item.line_total),
      })),
    }));
  } catch (err) {
    console.error("Error fetching invoices from Supabase:", err);
    return null;
  }
}

export async function saveInvoiceSupabase(invoice: InvoiceData): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createClient();
    const invoicePayload = {
      number: invoice.number,
      client_id: invoice.clientId && invoice.clientId.includes("-") && invoice.clientId.length > 20 ? invoice.clientId : null,
      status: invoice.status,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      tax_rate: invoice.taxRate,
      discount_type: invoice.discountType,
      discount_value: invoice.discountValue,
      subtotal: invoice.subtotal,
      discount_amount: invoice.discountAmount,
      tax_amount: invoice.taxAmount,
      total: invoice.total,
      amount_paid: invoice.amountPaid,
      notes: invoice.notes,
      terms: invoice.terms,
    };

    let targetId = invoice.id;
    const isUuid = targetId && targetId.length > 20 && targetId.includes("-");

    if (isUuid) {
      const { error } = await supabase.from("invoices").update(invoicePayload).eq("id", targetId);
      if (error) return false;
    } else {
      const { data: newInv, error } = await supabase
        .from("invoices")
        .insert(invoicePayload)
        .select("id")
        .single();
      if (error || !newInv) return false;
      targetId = newInv.id;
    }

    if (targetId && invoice.items) {
      await supabase.from("invoice_items").delete().eq("invoice_id", targetId);

      const itemsPayload = invoice.items.map((item, idx) => ({
        invoice_id: targetId,
        position: idx,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        line_total: item.lineTotal,
      }));

      await supabase.from("invoice_items").insert(itemsPayload);
    }

    return true;
  } catch (err) {
    console.error("Error saving invoice to Supabase:", err);
    return false;
  }
}

export async function deleteInvoiceSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createClient();
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    return !error;
  } catch (err) {
    console.error("Error deleting invoice from Supabase:", err);
    return false;
  }
}
