"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {} from "@/lib/data/types";
import { deleteInvoice, updateInvoiceStatus } from "@/lib/actions/invoices";
import { formatMoney, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { ArrowLeft, Edit, Trash2, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceData, ClientData } from "@/lib/data/types";
import { InvoiceStatus } from "@/lib/data/types";

export default function InvoiceDetailClient({ initialInvoice, initialClient }: { initialInvoice: InvoiceData, initialClient: ClientData | null }) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [invoice, setInvoice] = useState(initialInvoice);
  const [client, setClient] = useState(initialClient);
  
  useEffect(() => {
    setInvoice(initialInvoice);
    setClient(initialClient);
  }, [initialInvoice, initialClient]);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!invoice || !client) {
    return (
      <div className="text-center p-12">
        <h2 className="text-xl font-bold mb-4">Facture introuvable</h2>
        <Button onClick={() => router.push('/factures')}>Retour aux factures</Button>
      </div>
    );
  }

  const handleDelete = async () => {
    await deleteInvoice(id);
    router.push('/factures');
  };

  const handleUpdateStatus = async (newStatus: InvoiceStatus) => {
    await updateInvoiceStatus(id, newStatus);
    const updatedInvoice = { ...invoice, status: newStatus };
    setInvoice(updatedInvoice);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-emerald-100 text-emerald-700">Payée</Badge>;
      case "sent":
        return <Badge className="bg-orange-100 text-orange-700">Envoyée</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Annulée</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-700">En retard</Badge>;
      case "draft":
      default:
        return <Badge className="bg-slate-100 text-slate-700">Brouillon</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/factures">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Facture {invoice.number || "Brouillon"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-500">Créée le {formatDate(invoice.issueDate)}</span>
              {getStatusBadge(invoice.status)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50 focus:outline-none">
              <CheckCircle className="w-4 h-4 text-slate-600" />
              <span>Changer le statut</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-md border-slate-100 min-w-44 p-1">
              <DropdownMenuItem onClick={() => handleUpdateStatus('draft')} className="cursor-pointer">
                ⚪ Brouillon
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('sent')} className="cursor-pointer text-orange-600 font-medium">
                🟧 Envoyée
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('paid')} className="cursor-pointer text-emerald-600 font-medium">
                🟢 Payée
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('overdue')} className="cursor-pointer text-red-600 font-medium">
                🟥 En retard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus('cancelled')} className="cursor-pointer text-slate-600">
                ⬛ Annulée
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link 
            href={`/factures/${id}/modifier`} 
            className={buttonVariants({ variant: "outline", className: "rounded-xl border-slate-200 inline-flex items-center justify-center gap-2 h-9 px-4 py-2 text-sm font-medium" })}
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </Link>
          <Button 
            variant="outline" 
            className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 inline-flex items-center justify-center gap-2 h-9 px-4 py-2 text-sm font-medium"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Informations de facturation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 font-medium">Facturé à</p>
              <p className="text-lg font-semibold mt-1">{client.name}</p>
              {client.address && <p className="text-slate-600">{client.address}</p>}
              {client.city && <p className="text-slate-600">{client.city}, {client.country}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Détails de la facture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 font-medium">Date d'émission</p>
                <p className="font-medium mt-1">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Date d'échéance</p>
                <p className="font-medium mt-1">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-semibold text-slate-500 h-11">Description</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11 text-center">Quantité</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11 text-right">Prix unitaire</TableHead>
              <TableHead className="font-semibold text-slate-500 h-11 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item, index) => (
              <TableRow key={index} className="hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-900">{item.description}</TableCell>
                <TableCell className="text-center text-slate-600">{item.quantity}</TableCell>
                <TableCell className="text-right text-slate-600">{formatMoney(item.unitPrice)}</TableCell>
                <TableCell className="text-right font-semibold text-slate-900">{formatMoney(item.lineTotal)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-6 bg-slate-50 flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total HT</span>
              <span>{formatMoney(invoice.subtotal)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Remise</span>
                <span>-{formatMoney(invoice.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>TVA ({invoice.taxRate}%)</span>
              <span>{formatMoney(invoice.taxAmount)}</span>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between font-bold text-lg text-slate-900">
              <span>Total TTC</span>
              <span>{formatMoney(invoice.total)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Supprimer la facture</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la facture {invoice.number} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl">
              Oui, supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
