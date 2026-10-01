import { createClient } from "@/lib/supabase/server";
import { mapInvoiceFromDB, mapClientFromDB } from "@/lib/data/mappers";
import InvoicesClient from "./InvoicesClient";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const supabase = await createClient();
  
  const { data: dbInvoices } = await supabase.from('invoices').select('*, invoice_items(*)');
  const { data: dbClients } = await supabase.from('clients').select('*');
  
  const invoices = (dbInvoices || []).map(mapInvoiceFromDB);
  const clients = (dbClients || []).map(mapClientFromDB);
  
  return <InvoicesClient initialInvoices={invoices} initialClients={clients} />;
}
