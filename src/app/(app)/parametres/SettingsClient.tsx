"use client";

import { useState, useTransition } from "react";
import { CompanySettings } from "@/lib/data/types";
import { saveCompanySettingsAction } from "@/lib/actions/company";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  CreditCard, 
  FileText, 
  Save, 
  CheckCircle2, 
  Globe, 
  Mail, 
  Phone, 
  Receipt,
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function SettingsClient({ initialSettings }: { initialSettings: CompanySettings }) {
  const [formData, setFormData] = useState<CompanySettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultTaxRate' ? parseFloat(value) || 0 : value
    }));
    if (savedSuccess) setSavedSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await saveCompanySettingsAction(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Paramètres de l'Entreprise</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les coordonnées et informations officielles qui apparaissent sur vos factures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Modifications enregistrées !</span>
            </div>
          )}
          <Button 
            type="submit" 
            disabled={isPending}
            className="rounded-xl px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "Enregistrement..." : "Enregistrer les modifications"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Identité */}
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Identité de l'Émetteur</span>
              </div>
              <CardDescription>Nom officiel et identifiants fiscaux de votre société.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Nom de l'entreprise *
                  </label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Ex: IziTech Solutions SARL"
                    required
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    N° NINEA / RCCM / Tax ID *
                  </label>
                  <Input 
                    name="taxId" 
                    value={formData.taxId} 
                    onChange={handleChange} 
                    placeholder="Ex: 006548972 2V3"
                    required
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Site Web
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input 
                    name="website" 
                    value={formData.website} 
                    onChange={handleChange} 
                    placeholder="www.votreentreprise.sn"
                    className="rounded-xl border-slate-200 pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Coordonnées & Adresse */}
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Coordonnées & Adresse</span>
              </div>
              <CardDescription>Informations de contact figurant sur l'en-tête de facture.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Email de contact *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      type="email"
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="contact@entreprise.sn"
                      required
                      className="rounded-xl border-slate-200 pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+221 33 800 00 00"
                      required
                      className="rounded-xl border-slate-200 pl-9"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Adresse physique *
                </label>
                <Input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Rue, Quartier, Immeuble..."
                  required
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Ville *
                  </label>
                  <Input 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    placeholder="Dakar"
                    required
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Pays *
                  </label>
                  <Input 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    placeholder="Sénégal"
                    required
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Facturation & Banque */}
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Paramètres Financiers & Coordonnées Bancaires</span>
              </div>
              <CardDescription>Devise, TVA par défaut et détails du compte bancaire.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Devise par défaut *
                  </label>
                  <Input 
                    name="currency" 
                    value={formData.currency} 
                    onChange={handleChange} 
                    placeholder="FCFA"
                    required
                    className="rounded-xl border-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Taux de TVA par défaut (%)
                  </label>
                  <Input 
                    type="number"
                    step="0.1"
                    name="defaultTaxRate" 
                    value={formData.defaultTaxRate} 
                    onChange={handleChange} 
                    placeholder="18"
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Nom de la Banque
                  </label>
                  <Input 
                    name="bankName" 
                    value={formData.bankName} 
                    onChange={handleChange} 
                    placeholder="Ex: CBAO Groupe Attijariwafa Bank"
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    N° de Compte / IBAN / RIB
                  </label>
                  <Input 
                    name="bankAccount" 
                    value={formData.bankAccount} 
                    onChange={handleChange} 
                    placeholder="SN012 01001 02345678901 45"
                    className="rounded-xl border-slate-200 font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Conditions & Mentions Légales */}
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Mentions Légales & Conditions de Paiement</span>
              </div>
              <CardDescription>Texte automatique affiché en bas de chaque facture générée.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Conditions Générales / Pied de page
                </label>
                <textarea 
                  name="notes" 
                  rows={3}
                  value={formData.notes} 
                  onChange={handleChange} 
                  placeholder="Mentions légales, délais de paiement..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Live Preview Column */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-100 shadow-sm sticky top-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
            <CardHeader className="border-b border-slate-800 py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Aperçu sur vos Factures</span>
                </div>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">En direct</span>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Mini Invoice Preview Header */}
              <div className="bg-white text-slate-900 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">
                      {formData.name || "Nom de l'entreprise"}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      NINEA: {formData.taxId || "000000000"}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                    FA
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{formData.address || "Adresse"}, {formData.city}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{formData.email || "email@exemple.sn"}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{formData.phone || "+221 00 000 00 00"}</span>
                  </p>
                </div>

                {formData.bankName && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700 block mb-0.5">Banque : {formData.bankName}</span>
                    <span className="font-mono text-slate-500 text-[11px] block">{formData.bankAccount}</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Conformité Réglementaire</span>
                </div>
                <p>
                  Ces informations officielles sont automatiquement insérées dans l'en-tête et le pied de page de chaque facture créée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
