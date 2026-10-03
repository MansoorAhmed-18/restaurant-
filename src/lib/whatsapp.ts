import type { Order } from "./types";
import { consolidateOrderItems } from "./utils";

export function buildWhatsAppBillText(order: Order, customerName?: string): string {
  const dateStr = new Date(order.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const consolidated = consolidateOrderItems(order.items || []);
  const itemsText = consolidated
    .map((i) => `  • ${i.name} x${i.qty} — ₹${i.price * i.qty}`)
    .join("\n");

  const isDineIn = Boolean(order.tableId);
  const typeText = isDineIn ? `Table ${order.tableId?.replace(/^t/, "") || ""}` : "Takeaway Counter";

  return `🧾 *TAN'S KITCHEN - OFFICIAL RECEIPT* 🧾

Hello ${customerName || "Valued Customer"}! Thank you for dining with us.

*Invoice No:* INV-${order.number}
*Date:* ${dateStr}
*Order Type:* ${typeText}
*Payment Method:* ${(order.paymentMethod || "PAID").toUpperCase()}

*ITEMS ORDERED:*
${itemsText}

---------------------------------
*Subtotal:* ₹${order.subtotal}
*GST Tax (5%):* ₹${order.tax}
*TOTAL AMOUNT PAID:* ₹${order.total}
---------------------------------

📄 *View Digital Receipt:*
https://tanskitchen.vercel.app/invoice/${order.id}

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
