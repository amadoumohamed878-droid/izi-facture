"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { InvoiceFormValues } from "@/lib/validation/invoice";
import { calculateLineTotal } from "@/lib/invoice/calc";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";

export function LineItemsEditor() {
  const { control, watch } = useFormContext<InvoiceFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // We need to watch items to update the line totals dynamically
  const items = watch("items");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {fields.length > 0 ? (
          <div className="space-y-4">
            {fields.map((field, index) => {
              const currentItem = items[index];
              const lineTotal = calculateLineTotal(currentItem?.quantity || 0, currentItem?.unitPrice || 0);

              return (
                <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end relative group">
                  <div className="flex-1 w-full sm:w-auto">
                    <FormField
                      control={control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-slate-500">Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Description du service..." className="border border-slate-200 shadow-sm bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-end gap-4 w-full sm:w-auto">
                    <div className="w-24">
                      <FormField
                        control={control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-500">Quantité</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0.01" 
                                step="0.01"
                                placeholder="Qté" 
                                className="border border-slate-200 shadow-sm bg-white" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-32">
                      <FormField
                        control={control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs text-slate-500">Prix unitaire</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="1"
                                placeholder="Prix U." 
                                className="border border-slate-200 shadow-sm bg-white" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity mb-0.5"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-4 text-slate-500 text-sm">
            Aucune ligne ajoutée pour le moment. Cliquez sur "Ajouter une ligne" ci-dessous.
          </div>
        )}
      </div>

      <Button 
        type="button" 
        variant="ghost" 
        className="text-slate-500 hover:text-slate-900 pl-0"
        onClick={() => append({ id: Math.random().toString(36).substring(2), description: "", quantity: 1, unitPrice: 0 })}
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter une ligne
      </Button>
    </div>
  );
}
