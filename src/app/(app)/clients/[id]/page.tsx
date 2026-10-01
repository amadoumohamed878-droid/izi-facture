import { createClient } from "@/lib/supabase/server";
import { mapClientFromDB, mapInvoiceFromDB } from "@/lib/data/mappers";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { ArrowLeft, Mail, Phone, MapPin, Building, Edit, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMoney, formatDate } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Payée</Badge>;
    case "sent":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Envoyée</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Annulée</Badge>;
    case "draft":
    default:
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200">Brouillon</Badge>;
  }
};

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await params;
  
  let client = null;
  let invoices: any[] = [];

  try {
    const supabase = await createClient();
    const { data: dbClient } = await supabase.from('clients').select('*').eq('id', resolvedParams.id).maybeSingle();
    if (dbClient) {
      client = mapClientFromDB(dbClient);
      const { data: dbInvoices } = await supabase.from('invoices').select('*, invoice_items(*)').eq('client_id', resolvedParams.id);
      invoices = (dbInvoices || []).map(mapInvoiceFromDB);
    }
  } catch (err) {
    console.error("Supabase fetch error:", err);
  }

  if (!client) {
    notFound();
  }
  
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((sum, inv) => sum + inv.total, 0);
  const balance = totalInvoiced - totalPaid;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900" render={<Link href="/clients" />}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
            <p className="text-sm text-slate-500">Détails du client et historique de facturation.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl">
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Link href="/factures/nouvelle" className={buttonVariants({ className: "rounded-xl shadow-sm" })}>
            <FileText className="w-4 h-4 mr-2" />
            Créer une facture
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client Info */}
        <Card className="border-slate-100 shadow-sm rounded-2xl md:col-span-1">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-semibold text-slate-900">Coordonnées</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{client.name}</p>
                  {client.taxId && <p className="text-xs text-slate-500 mt-1">NINEA / RCCM: {client.taxId}</p>}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <p className="text-sm text-slate-700">{client.address || "Adresse non renseignée"}</p>
                  {(client.city || client.country) && (
                    <p className="text-sm text-slate-700">{[client.city, client.country].filter(Boolean).join(", ")}</p>
                  )}
                </div>
              </div>

              {client.contactName && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contact principal</h4>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-900">{client.contactName}</p>
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <a href={`mailto:${client.email}`} className="hover:text-primary">{client.email}</a>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${client.phone}`} className="hover:text-primary">{client.phone}</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats & History */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500 mb-1">Total facturé</p>
                <h3 className="text-xl font-bold text-slate-900">{formatMoney(totalInvoiced)}</h3>
              </CardContent>
            </Card>
            <Card className="border-slate-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500 mb-1">Total encaissé</p>
                <h3 className="text-xl font-bold text-emerald-600">{formatMoney(totalPaid)}</h3>
              </CardContent>
            </Card>
            <Card className="border-slate-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-slate-500 mb-1">Reste à payer</p>
                <h3 className={`text-xl font-bold ${balance > 0 ? "text-orange-600" : "text-slate-900"}`}>
                  {formatMoney(balance)}
                </h3>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-white">
              <h3 className="font-semibold text-slate-900">Historique des factures</h3>
            </div>
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-500">N° Facture</TableHead>
                  <TableHead className="font-semibold text-slate-500">Date</TableHead>
                  <TableHead className="font-semibold text-slate-500">Statut</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-right">Montant TTC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length > 0 ? (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-900">
                        {invoice.number || "Brouillon"}
                      </TableCell>
                      <TableCell className="text-slate-500">{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right font-semibold text-slate-900">
                        {formatMoney(invoice.total)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                      Aucune facture pour ce client.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
