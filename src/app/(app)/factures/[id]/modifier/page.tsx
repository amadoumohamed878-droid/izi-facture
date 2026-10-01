import { createClient } from "@/lib/supabase/server";
import { mapInvoiceFromDB, mapClientFromDB } from "@/lib/data/mappers";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { saveInvoice } from "@/lib/actions/invoices";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: dbClients } = await supabase.from('clients').select('*');
  const clients = (dbClients || []).map(mapClientFromDB);
  
  const { data: dbInvoice } = await supabase.from('invoices').select('*, invoice_items(*)').eq('id', resolvedParams.id).single();

  if (!dbInvoice) {
    notFound();
  }
  
  const invoice = mapInvoiceFromDB(dbInvoice);

  const handleUpdate = async (data: any, action: "save_draft" | "send") => {
    "use server";
    await saveInvoice(data, action, invoice.id, invoice.number);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <InvoiceForm 
        pageTitle={`Modifier la facture ${invoice.number || "brouillon"}`}
        clients={clients} 
        onSubmit={handleUpdate}
        initialData={{
          ...invoice,
          number: invoice.number ?? undefined,
          clientId: invoice.clientId ?? undefined,
        }}
      />
    </div>
  );
}
