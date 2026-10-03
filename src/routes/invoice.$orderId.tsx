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
  const { orders, customers } = usePos();
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

  const cust = customers.find((c) => c.id === o.customerId);
  const [phoneInput, setPhoneInput] = useState(cust?.phone || "");

  const handleSendWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendWhatsAppBill(o, phoneInput, cust?.name);
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
          <div className="text-2xl font-black text-primary">Tan&apos;s Kitchen</div>
          <div className="font-bold text-sm">Spice Route Kitchen</div>
          <div className="text-xs text-muted-foreground">12, 100 Ft Road, Indiranagar, Bengaluru 560038</div>
        </div>
        <div className="my-5 grid grid-cols-2 gap-y-1 border-y border-dashed py-3 text-xs">
          <span className="text-muted-foreground">Invoice</span>
          <span className="text-right font-bold">INV-{o.number}</span>
          <span className="text-muted-foreground">Date</span>
          <span className="text-right">
            {new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </span>
          <span className="text-muted-foreground">{o.tableId ? "Table" : "Type"}</span>
          <span className="text-right">{o.tableId ? o.tableId.replace(/^t/, "") : "Takeaway"}</span>
          <span className="text-muted-foreground">Customer</span>
          <span className="text-right">{cust?.name ?? "Walk-in Customer"}</span>
          <span className="text-muted-foreground">Paid via</span>
          <span className="text-right uppercase font-bold text-emerald-600">{o.paymentMethod ?? "—"}</span>
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
        <p className="mt-6 text-center text-xs text-muted-foreground font-medium">Thank you for dining with us! 🧡</p>
      </div>
    </AppShell>
  );
}
