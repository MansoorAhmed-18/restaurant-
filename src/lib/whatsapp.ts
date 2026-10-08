import type { Order } from "./types";
import { consolidateOrderItems } from "./utils";

export function buildWhatsAppBillText(order: Order, customerName?: string): string {
  const d = new Date(order.createdAt);
  const dateFormatted = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeFormatted = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = `${dateFormatted} at ${timeFormatted}`;


  const consolidated = consolidateOrderItems(order.items || []);
  const itemsText = consolidated
    .map((i) => `  • ${i.name} x${i.qty} — ₹${i.price * i.qty}`)
    .join("\n");

  return `🧾 *TAN'S KITCHEN - OFFICIAL RECEIPT* 🧾

Hello! Thank you for dining with us.

*Invoice No:* INV-${order.number}
*Date:* ${dateStr}
*Payment Method:* ${(order.paymentMethod || "PAID").toUpperCase()}

*ITEMS ORDERED:*
${itemsText}

---------------------------------
*TOTAL AMOUNT PAID:* ₹${order.total}
---------------------------------

Thank you for visiting Tan's Kitchen! 🧡`;
}

export function sendWhatsAppBill(order: Order, phoneInput?: string, customerName?: string) {
  let cleanPhone = (phoneInput || "").replace(/\D/g, "");
  if (cleanPhone && cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  const rawText = buildWhatsAppBillText(order, customerName);
  const encodedText = encodeURIComponent(rawText);

  const url = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(url, "_blank");
}
