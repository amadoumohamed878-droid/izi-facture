import { createClient } from "@/lib/supabase/server";
import { mapInvoiceFromDB, mapClientFromDB } from "@/lib/data/mappers";
import { notFound } from "next/navigation";
import InvoiceDetailClient from "./InvoiceDetailClient";

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: dbInvoice } = await supabase.from('invoices').select('*, invoice_items(*)').eq('id', resolvedParams.id).single();
  
  if (!dbInvoice) {
    notFound();
  }

  const invoice = mapInvoiceFromDB(dbInvoice);
  
  let client = null;
  if (invoice.clientId) {
    const { data: dbClient } = await supabase.from('clients').select('*').eq('id', invoice.clientId).single();
    if (dbClient) {
      client = mapClientFromDB(dbClient);
    }
  }

  return <InvoiceDetailClient initialInvoice={invoice} initialClient={client} />;
}
