import { createClient } from "@/lib/supabase/server";
import { mapInvoiceFromDB, mapClientFromDB } from "@/lib/data/mappers";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: dbInvoices } = await supabase.from('invoices').select('*, invoice_items(*)');
  const { data: dbClients } = await supabase.from('clients').select('*');
  
  const invoices = (dbInvoices || []).map(mapInvoiceFromDB);
  const clients = (dbClients || []).map(mapClientFromDB);
  
  return <DashboardClient initialInvoices={invoices} initialClients={clients} />;
}
