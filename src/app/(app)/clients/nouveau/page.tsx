import { ClientForm } from "@/components/clients/ClientForm";
import { ClientData } from "@/lib/data/types";
import { saveClient } from "@/lib/actions/clients";

export default function NewClientPage() {
  const handleSubmit = async (data: Partial<ClientData>) => {
    "use server";
    await saveClient(data);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <ClientForm 
        pageTitle="Nouveau Client"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
