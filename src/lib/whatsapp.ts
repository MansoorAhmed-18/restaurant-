import type { Order } from "./types";
import { consolidateOrderItems } from "./utils";

export function buildWhatsAppBillText(order: Order, customerName?: string): string {
  const d = new Date(order.createdAt);
  const dateFormatted = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeFormatted = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr = `${dateFormatted} at ${timeFormatted}`;


  const isPaid = order.paymentStatus === "paid";
  const isCancelled = order.status === "cancelled";

  const consolidated = consolidateOrderItems(order.items || []);
  const itemsText = consolidated
    .map((i) => `  • ${i.name} x${i.qty} — ₹${i.price * i.qty}`)
    .join("\n");

  const title = isPaid ? "🧾 *MEAT THEORY - OFFICIAL RECEIPT* 🧾" : "🧾 *MEAT THEORY - FOOD BILL* 🧾";
  const paymentLine = isCancelled 
    ? "*Status:* CANCELLED (VOID)" 
    : isPaid 
    ? `*Payment Method:* ${(order.paymentMethod || "CASH").toUpperCase()} (PAID)` 
    : "*Payment Status:* UNPAID (Pending Payment)";
  const totalLine = isPaid ? `*TOTAL AMOUNT PAID:* ₹${order.total}` : `*TOTAL PAYABLE:* ₹${order.total}`;

  return `${title}
🔥 *TESTED • CRAFTED • SERVED* 🔥

Hello! Thank you for dining with us at Meat Theory.

*${isPaid ? "Invoice No:" : "Bill No:"}* ${isPaid ? "INV-" : "BILL-"}${order.number}
*Date:* ${dateStr}
${paymentLine}

*ITEMS ORDERED:*
${itemsText}

---------------------------------
${totalLine}
---------------------------------

Thank you for visiting Meat Theory! 🔥🥩
Visit us again soon!`;
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
