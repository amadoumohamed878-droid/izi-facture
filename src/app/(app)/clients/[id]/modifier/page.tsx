import { ClientForm } from "@/components/clients/ClientForm";
import { ClientData } from "@/lib/data/types";
import { notFound } from "next/navigation";
import { saveClient } from "@/lib/actions/clients";
import { createClient } from "@/lib/supabase/server";
import { mapClientFromDB } from "@/lib/data/mappers";

export const dynamic = "force-dynamic";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: dbClient } = await supabase.from('clients').select('*').eq('id', resolvedParams.id).single();

  if (!dbClient) {
    notFound();
  }

  const client = mapClientFromDB(dbClient);

  const updateClient = async (data: Partial<ClientData>) => {
    "use server";
    await saveClient(data, resolvedParams.id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <ClientForm 
        pageTitle="Modifier le client"
        initialData={client}
        onSubmit={updateClient}
      />
    </div>
  );
}
