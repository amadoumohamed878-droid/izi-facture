"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientData } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface ClientFormProps {
  pageTitle: string;
  initialData?: Partial<ClientData>;
  onSubmit: (data: Partial<ClientData>) => void;
}

export function ClientForm({ pageTitle, initialData, onSubmit }: ClientFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ClientData>>({
    name: "", contactName: "", email: "", phone: "", address: "", city: "", country: "",
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return; // Simple validation
    onSubmit(formData);
    router.push('/clients');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button variant="outline" className="rounded-xl border-slate-200">
              Annuler
            </Button>
          </Link>
          <Button onClick={handleSubmit} className="rounded-xl shadow-sm">
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Entreprise *</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="border-slate-200 rounded-xl" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactName">Nom du contact</Label>
                <Input 
                  id="contactName" 
                  value={formData.contactName} 
                  onChange={e => setFormData({...formData, contactName: e.target.value})} 
                  className="border-slate-200 rounded-xl" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="border-slate-200 rounded-xl" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className="border-slate-200 rounded-xl" 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  className="border-slate-200 rounded-xl" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input 
                  id="city" 
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  className="border-slate-200 rounded-xl" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input 
                  id="country" 
                  value={formData.country} 
                  onChange={e => setFormData({...formData, country: e.target.value})} 
                  className="border-slate-200 rounded-xl" 
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
