"use server";

import { createClient } from "@/lib/supabase/server";
import { CompanySettings } from "@/lib/data/types";
import { revalidatePath } from "next/cache";

export async function saveCompanySettingsAction(settings: CompanySettings) {
  const supabase = await createClient();
  
  // Find existing company
  const { data: companies } = await supabase.from('companies').select('id').limit(1);
  const companyId = companies && companies.length > 0 ? companies[0].id : null;

  const companyData = {
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

  if (companyId) {
    await supabase.from('companies').update(companyData).eq('id', companyId);
  } else {
    await supabase.from('companies').insert([companyData]);
  }

  revalidatePath("/", "layout");
  return { success: true };
}
