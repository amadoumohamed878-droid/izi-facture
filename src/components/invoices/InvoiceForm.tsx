"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceFormSchema, InvoiceFormValues } from "@/lib/validation/invoice";
import { calculateInvoiceTotals } from "@/lib/invoice/calc";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineItemsEditor } from "./LineItemsEditor";
import { ClientData } from "@/lib/data/types";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface InvoiceFormProps {
  pageTitle: string;
  clients: ClientData[];
  initialData?: Partial<InvoiceFormValues> & { number?: string };
  onSubmit: (data: InvoiceFormValues, action: "save_draft" | "send") => Promise<void>;
}

export function InvoiceForm({ pageTitle, clients, initialData, onSubmit }: InvoiceFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      issueDate: initialData?.issueDate || new Date().toISOString().split("T")[0],
      dueDate: initialData?.dueDate || "",
      items: initialData?.items || [],
      taxRate: initialData?.taxRate ?? 18,
      discountType: initialData?.discountType || null,
      discountValue: initialData?.discountValue || 0,
      notes: initialData?.notes || "",
      terms: initialData?.terms || "",
    },
  });

  const { watch, handleSubmit } = form;
  const clientId = watch("clientId");
  const items = watch("items");
  const taxRate = watch("taxRate");
  const issueDate = watch("issueDate");
  const dueDate = watch("dueDate");

  const totals = calculateInvoiceTotals(items, watch("discountType"), watch("discountValue"), taxRate);

  const selectedClient = clients.find(c => c.id === clientId);
  const displayInvoiceNumber = initialData?.number || "Brouillon";

  const handleAction = async (action: "save_draft" | "send") => {
    const isValid = await form.trigger();
    if (isValid) {
      await onSubmit(form.getValues(), action);
    }
  };

  // Prevent hydration mismatch for generated dates/IDs if needed, 
  // but react-hook-form handles defaults ok on client.
  if (!isMounted) return null;

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        
        {/* Header and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/factures">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 h-10 px-5"
              onClick={() => handleAction("save_draft")}
            >
              Brouillon
            </Button>
            <Button 
              type="button" 
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white h-10 px-5"
              onClick={() => handleAction("send")}
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Informations Générales</h2>
              
              <div className="flex flex-col gap-4 max-w-sm">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-500">Client *</FormLabel>
                      <select 
                        className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                        name={field.name}
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      >
                        <option value="" disabled>Sélectionner un client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-slate-500">Date d'échéance</FormLabel>
                      <FormControl>
                        <Input type="date" className="border border-slate-200 bg-white shadow-sm h-11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel className="text-xs text-slate-500">Numéro de facture</FormLabel>
                  <Input 
                    disabled 
                    value={displayInvoiceNumber}
                    className="border border-slate-200 bg-slate-50 shadow-sm h-11 text-slate-500" 
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900">Prestations / Produits</h2>
              <LineItemsEditor />
            </div>
          </div>

          {/* Right Column - A4 Preview */}
          <div className="bg-slate-50 rounded-3xl p-6 lg:p-10 flex items-start justify-center overflow-x-auto">
            <div className="bg-white w-full max-w-[500px] shrink-0 aspect-[1/1.414] shadow-sm border border-slate-100 rounded-lg p-8 flex flex-col text-[11px] leading-relaxed text-slate-600">
              
              {/* Preview Header */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h1 className="text-2xl font-normal text-slate-900 tracking-widest uppercase mb-1">Facture</h1>
                  <p className="text-slate-400">{displayInvoiceNumber}</p>
                </div>
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  I
                </div>
              </div>

              {/* Preview Entities */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Émetteur</h3>
                  <p className="font-medium text-slate-900">IziFacture SARL</p>
                  <p>contact@izifacture.com</p>
                  <p>Dakar, Sénégal</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Facture À</h3>
                  {selectedClient ? (
                    <>
                      <p className="font-medium text-slate-900">{selectedClient.name}</p>
                      <p>{selectedClient.email}</p>
                      {selectedClient.address && <p>{selectedClient.address}</p>}
                    </>
                  ) : (
                    <p className="text-slate-400 italic">Sélectionner un client...</p>
                  )}
                </div>
              </div>

              {/* Preview Dates */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date d'émission</h3>
                  <p className="font-medium text-slate-900">
                    {issueDate ? new Date(issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date d'échéance</h3>
                  <p className="font-medium text-slate-900">
                    {dueDate ? new Date(dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </p>
                </div>
              </div>

              {/* Preview Table */}
              <div className="mb-8">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Détail des prestations</h3>
                <div className="w-full">
                  <div className="flex border-b border-slate-200 pb-2 mb-2 font-medium text-slate-900">
                    <div className="flex-1">Description</div>
                    <div className="w-16 text-center">Qté</div>
                    <div className="w-24 text-right">PU</div>
                    <div className="w-24 text-right">Montant</div>
                  </div>
                  
                  {items.length > 0 && items.some(i => i.description || i.quantity || i.unitPrice) ? (
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex">
                          <div className="flex-1 truncate pr-4">{item.description || "-"}</div>
                          <div className="w-16 text-center">{item.quantity}</div>
                          <div className="w-24 text-right">{formatMoney(item.unitPrice)}</div>
                          <div className="w-24 text-right font-medium text-slate-900">
                            {formatMoney((item.quantity || 0) * (item.unitPrice || 0))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-400 italic">
                      Aucune ligne ajoutée pour le moment.
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Totals */}
              <div className="mt-auto flex justify-end">
                <div className="w-48 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sous-total</span>
                    <span className="font-medium text-slate-900">{formatMoney(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TVA ({taxRate}%)</span>
                    <span className="font-medium text-slate-900">{formatMoney(totals.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Grand Total</span>
                    <span className="font-bold text-slate-900">{formatMoney(totals.total)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </form>
    </Form>
  );
}
