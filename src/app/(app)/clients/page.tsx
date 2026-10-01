import { createClient } from "@/lib/supabase/server";
import { mapInvoiceFromDB, mapClientFromDB } from "@/lib/data/mappers";
import ClientsClient from "./ClientsClient";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = await createClient();
  
  const { data: dbClients } = await supabase.from('clients').select('*');
  const { data: dbInvoices } = await supabase.from('invoices').select('*, invoice_items(*)');
  
  const clients = (dbClients || []).map(mapClientFromDB);
  const invoices = (dbInvoices || []).map(mapInvoiceFromDB);
  
  return <ClientsClient initialClients={clients} initialInvoices={invoices} />;
}
