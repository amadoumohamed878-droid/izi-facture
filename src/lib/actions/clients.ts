"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ClientData } from "@/lib/data/types";

export async function saveClient(data: Partial<ClientData>, id?: string) {
  const supabase = await createClient();
  
  const clientData = {
    name: data.name || "",
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
    city: data.city || null,
    country: data.country || null,
    contact_name: data.contactName || null,
    notes: data.notes || null,
  };

  if (id) {
    await supabase.from('clients').update(clientData).eq('id', id);
  } else {
    await supabase.from('clients').insert([clientData]);
  }

  revalidatePath("/", "layout");
  
  redirect("/clients");
}

export async function deleteClient(id: string) {
  const supabase = await createClient();
  await supabase.from('clients').delete().eq('id', id);
  revalidatePath("/", "layout");
}
