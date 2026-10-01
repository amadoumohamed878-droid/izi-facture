import { DiscountType, InvoiceItem } from "../data/types";

export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  netSubtotal: number;
  taxAmount: number;
  total: number;
}

export function calculateLineTotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice);
}

export function calculateInvoiceTotals(
  items: Pick<InvoiceItem, "quantity" | "unitPrice">[],
  discountType: DiscountType,
  discountValue: number,
  taxRate: number
): InvoiceCalculations {
  // 1. Calculate subtotal
  let subtotal = 0;
  for (const item of items) {
    subtotal += calculateLineTotal(item.quantity, item.unitPrice);
  }

  // 2. Calculate discount amount
  let discountAmount = 0;
  if (discountType === "amount") {
    discountAmount = Math.round(discountValue);
  } else if (discountType === "percent") {
    discountAmount = Math.round(subtotal * (discountValue / 100));
  }

  // Ensure discount doesn't exceed subtotal
  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  const netSubtotal = subtotal - discountAmount;

  // 3. Calculate tax
  const taxAmount = Math.round(netSubtotal * (taxRate / 100));

  // 4. Calculate total
  const total = netSubtotal + taxAmount;

  return {
    subtotal,
    discountAmount,
    netSubtotal,
    taxAmount,
    total,
  };
}
