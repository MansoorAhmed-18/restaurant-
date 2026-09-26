import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Printer } from "lucide-react";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState } from "@/components/pos/ui";
import { inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { customers } from "@/lib/mock-data";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/invoice/$orderId")({
  head: () => meta("Invoice", "Printable GST invoice for a paid restaurant order."),
  component: Invoice,
});

function Invoice() {
  const { orderId } = Route.useParams();
  const { orders } = usePos();
  const o = orders.find((x) => x.id === orderId);
  if (!o) return <AppShell><EmptyState title="Invoice not found" text="This order doesn't exist." action={<Link to="/orders" className="font-bold text-primary">Back to orders</Link>} /></AppShell>;
  const cust = customers.find((c) => c.id === o.customerId);
  return (
    <AppShell>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-success"><CheckCircle2 />Payment successful</div>
        <div className="flex gap-2">
          <Link to="/pos" className="rounded-xl border bg-card px-4 py-2.5 text-sm font-bold">New order</Link>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"><Printer className="size-4" />Print</button>
        </div>
      </div>
      <div className="card-surface mx-auto max-w-lg p-8 print:shadow-none">
        <div className="text-center">
          <div className="text-2xl font-black text-primary">Tadka POS</div>
          <div className="font-bold">Spice Route Kitchen</div>
          <div className="text-xs text-muted-foreground">12, 100 Ft Road, Indiranagar, Bengaluru 560038<br />GSTIN 29ABCDE1234F1Z5 · +91 80 4000 1234</div>
        </div>
        <div className="my-5 grid grid-cols-2 gap-y-1 border-y border-dashed py-3 text-xs">
          <span className="text-muted-foreground">Invoice</span><span className="text-right font-bold">INV-{o.number}</span>
          <span className="text-muted-foreground">Date</span><span className="text-right">{new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
          <span className="text-muted-foreground">{o.tableId ? "Table" : "Type"}</span><span className="text-right">{o.tableId ? o.tableId.slice(1) : "Takeaway"}</span>
          <span className="text-muted-foreground">Customer</span><span className="text-right">{cust?.name ?? "Walk-in"}</span>
          <span className="text-muted-foreground">Paid via</span><span className="text-right uppercase">{o.paymentMethod ?? "—"}</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-muted-foreground"><tr><th className="pb-2 text-left">Item</th><th className="pb-2 text-center">Qty</th><th className="pb-2 text-right">Amount</th></tr></thead>
          <tbody>{o.items.map((i) => <tr key={i.productId}><td className="py-1">{i.name}<div className="text-xs text-muted-foreground">{inr(i.price)}</div></td><td className="text-center">{i.qty}</td><td className="text-right">{inr(i.price * i.qty)}</td></tr>)}</tbody>
        </table>
        <div className="mt-4 space-y-1 border-t border-dashed pt-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{inr(o.subtotal)}</span></div>
          <div className="flex justify-between"><span>CGST 2.5%</span><span>{inr(o.tax / 2)}</span></div>
          <div className="flex justify-between"><span>SGST 2.5%</span><span>{inr(o.tax / 2)}</span></div>
          <div className="flex justify-between border-t pt-2 text-lg font-extrabold"><span>Total</span><span>{inr(o.total)}</span></div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">Thank you for dining with us! 🧡</p>
      </div>
    </AppShell>
  );
}
