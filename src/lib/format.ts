import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function formatMoney(amount: number): string {
  // Always use no fraction digits for FCFA
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("XOF", "FCFA");
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy", { locale: fr });
}
