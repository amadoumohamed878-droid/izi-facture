import { createClient } from "@/lib/supabase/server";
import { mapClientFromDB } from "@/lib/data/mappers";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { saveInvoice } from "@/lib/actions/invoices";

export default async function NewInvoicePage() {
  const supabase = await createClient();
  const { data: dbClients } = await supabase.from('clients').select('*');
  const clients = (dbClients || []).map(mapClientFromDB);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <InvoiceForm 
        pageTitle="Nouvelle Facture"
        clients={clients} 
        onSubmit={saveInvoice}
      />
    </div>
  );
}
