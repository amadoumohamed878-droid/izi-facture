import { createClient } from "@/lib/supabase/server";
import { mapCompanyFromDB } from "@/lib/data/mappers";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  
  const { data: companies } = await supabase.from('companies').select('*').limit(1);
  const settings = companies && companies.length > 0 
    ? mapCompanyFromDB(companies[0])
    : {
        name: "",
        taxId: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        website: "",
        currency: "FCFA",
        defaultTaxRate: 18,
        bankName: "",
        bankAccount: "",
        notes: "",
      };

  return <SettingsClient initialSettings={settings} />;
}
