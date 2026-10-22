import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Printer, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState } from "@/components/pos/ui";
import { inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { meta } from "@/lib/meta";
import { sendWhatsAppBill } from "@/lib/whatsapp";
import { consolidateOrderItems } from "@/lib/utils";

export const Route = createFileRoute("/invoice/$orderId")({
  head: () => meta("Invoice", "Printable bill receipt for a paid restaurant order."),
  component: Invoice,
});

function Invoice() {
  const { orderId } = Route.useParams();
  const { orders, tables } = usePos();
  const [phoneInput, setPhoneInput] = useState("");

  const o = orders.find((x) => x.id === orderId);

  if (!o) {
    return (
      <AppShell>
        <EmptyState
          title="Invoice not found"
          text="This order doesn't exist."
          action={
            <Link to="/orders" className="font-bold text-primary">
              Back to orders
            </Link>
          }
        />
      </AppShell>
    );
  }

  const handleSendWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendWhatsAppBill(o, phoneInput);
    toast.success("Opening WhatsApp with digital receipt!");
  };

  return (
    <AppShell>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-emerald-600">
          <CheckCircle2 className="size-5" /> Payment Successful ({o.paymentMethod?.toUpperCase() || "PAID"})
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/pos" className="rounded-xl border bg-card px-4 py-2.5 text-sm font-bold">
            + New Order
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-bold text-foreground hover:bg-muted/80 transition-colors"
          >
            <Printer className="size-4" /> Print Thermal Receipt
          </button>
        </div>
      </div>

      {/* WhatsApp Manager Sharing Action Bar */}
      <div className="no-print mx-auto max-w-lg mb-6 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 p-4 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
          <MessageSquare className="size-4 text-emerald-600" /> Send Bill Receipt to Customer WhatsApp
        </div>
        <form onSubmit={handleSendWhatsApp} className="flex gap-2">
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Customer 10-digit WhatsApp phone number..."
            className="flex-1 rounded-xl border bg-background px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 transition-colors shadow"
          >
            <Send className="size-3.5" /> Send on WhatsApp 💬
          </button>
        </form>
      </div>

      {/* Printable Invoice Receipt Card */}
      <div className="card-surface mx-auto max-w-lg p-8 print:shadow-none">
        <div className="text-center">
          <div className="mx-auto mb-2 size-12 drop-shadow-sm">
            <svg viewBox="0 0 200 208" className="size-full">
              <polygon points="100,10 182,56 182,152 100,198 18,152 18,56" fill="#FFFFFF" stroke="#E5A823" strokeWidth="6" strokeLinejoin="round"/>
              <polygon points="100,20 173,61 173,147 100,188 27,147 27,61" fill="none" stroke="#401278" strokeWidth="3" strokeLinejoin="round"/>
              <g>
                <path d="M 100,97 C 95,92 90,86 89,79 C 88,71 81,67 83,57 C 85,48 91,52 92,47 C 93,42 94,32 100,24 C 106,32 107,42 108,47 C 109,52 115,48 117,57 C 119,67 112,71 111,79 C 110,86 105,92 100,97 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" strokeLinejoin="round"/>
                <path d="M 100,94 C 96,89 93,84 92,77 C 91,72 86,68 88,61 C 90,57 93,59 94,55 C 95,50 96,42 100,35 C 104,42 105,50 106,55 C 107,59 110,57 112,61 C 114,68 109,72 108,77 C 107,84 104,89 100,94 Z" fill="#EA580C"/>
              </g>
              <path d="M 45,76 L 68,76 L 90,92 L 100,97 L 110,92 L 132,76 L 155,76 L 155,142 L 132,142 L 132,94 L 112,94 L 112,168 L 88,168 L 88,94 L 68,94 L 68,142 L 45,142 Z" fill="#4C168A" stroke="#250645" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-2xl font-black text-primary tracking-tight uppercase">Meat Theory</div>
          <div className="font-extrabold text-xs text-amber-600 tracking-wider">TESTED • CRAFTED • SERVED</div>
          <div className="text-xs text-muted-foreground mt-0.5">7, Masthan Sahib Street, Nehru Nagar, Pallavaram, Chennai</div>
        </div>
        <div className="my-5 grid grid-cols-2 gap-y-1.5 border-y border-dashed py-3.5 text-xs">
          <span className="text-muted-foreground font-semibold">Invoice No</span>
          <span className="text-right font-extrabold text-foreground">INV-{o.number}</span>
          <span className="text-muted-foreground font-semibold">Bill Date</span>
          <span className="text-right font-bold text-foreground">
            {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <span className="text-muted-foreground font-semibold">Bill Time</span>
          <span className="text-right font-bold text-foreground">
            {new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </span>
          <span className="text-muted-foreground font-semibold">{o.tableId ? "Table" : "Order Type"}</span>
          <span className="text-right font-bold">{o.tableId ? (tables.find((t) => t.id === o.tableId)?.name ? `Table ${tables.find((t) => t.id === o.tableId)?.name}` : `Table ${o.tableId}`) : "Takeaway Counter"}</span>
          <span className="text-muted-foreground font-semibold">Customer</span>
          <span className="text-right font-medium">Walk-in Customer</span>
          <span className="text-muted-foreground font-semibold">Payment Status</span>
          <span className="text-right uppercase font-black text-emerald-600">PAID via {o.paymentMethod ?? "UPI"}</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr>
              <th className="pb-2 text-left">Item</th>
              <th className="pb-2 text-center">Qty</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {consolidateOrderItems(o.items).map((i, idx) => (
              <tr key={`${i.productId || i.name}-${idx}`}>
                <td className="py-1">
                  {i.name}
                  <div className="text-xs text-muted-foreground">{inr(i.price)}</div>
                </td>
                <td className="text-center font-bold">{i.qty}</td>
                <td className="text-right font-bold">{inr(i.price * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 space-y-1 border-t border-dashed pt-3 text-sm">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal</span>
            <span>{inr(o.subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>GST Tax (5%)</span>
            <span>{inr(o.tax)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg font-extrabold">
            <span>Total Paid</span>
            <span className="text-primary">{inr(o.total)}</span>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground font-medium">Thank you for dining at Meat Theory! 🔥🥩</p>
      </div>
    </AppShell>
  );
}
