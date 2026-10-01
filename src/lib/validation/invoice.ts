import { z } from "zod";

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "La description est requise"),
  quantity: z.number().min(0.01, "La quantité doit être supérieure à 0"),
  unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
});

export const invoiceFormSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  issueDate: z.string().min(1, "La date d'émission est requise"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  items: z.array(invoiceItemSchema).min(1, "Ajoutez au moins une ligne"),
  taxRate: z.number().min(0).max(100),
  discountType: z.enum(["percent", "amount"]).nullable(),
  discountValue: z.number().min(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;
