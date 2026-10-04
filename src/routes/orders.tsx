import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, PageHeader, StatusBadge } from "@/components/pos/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { cn, consolidateOrderItems } from "@/lib/utils";
import { meta } from "@/lib/meta";
import { sendWhatsAppBill } from "@/lib/whatsapp";

export const Route = createFileRoute("/orders")({
  head: () => meta("Orders", "Active, completed and cancelled restaurant orders with details."),
  component: Orders,
});

const tabs = [
  { id: "active", label: "Active", match: (s: string) => s === "pending" || s === "preparing" },
  { id: "completed", label: "Completed", match: (s: string) => s === "completed" },
  { id: "cancelled", label: "Cancelled", match: (s: string) => s === "cancelled" },
];

function Orders() {
  const { orders, setOrderStatus } = usePos();
  const [tab, setTab] = useState("active");
  const [openId, setOpenId] = useState<string | null>(null);
  const t = tabs.find((x) => x.id === tab)!;
  const list = orders.filter((o) => t.match(o.status));
  const sel = orders.find((o) => o.id === openId);
  return (
    <AppShell>
      <PageHeader title="Orders" subtitle="Track every ticket from kitchen to bill" />
      <div className="mb-5 flex gap-2">
        {tabs.map((x) => (
          <button key={x.id} onClick={() => setTab(x.id)} className={cn("rounded-full border px-4 py-2 text-sm font-bold", tab === x.id ? "border-primary bg-primary text-primary-foreground" : "bg-card")}>
            {x.label} · {orders.filter((o) => x.match(o.status)).length}
          </button>
        ))}
      </div>
      {list.length === 0 ? <EmptyState title={`No ${t.label.toLowerCase()} orders`} text="Orders will show up here as they come in." /> : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b">
              <th className="p-4">Order</th><th className="p-4">Type</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Payment</th><th className="p-4" />
            </tr></thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4"><div className="font-extrabold">#{o.number}</div><div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div></td>
                  <td className="p-4">{o.tableId ? `Table ${o.tableId.slice(1)}` : "Takeaway"}</td>
                  <td className="p-4">{consolidateOrderItems(o.items).reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="p-4 font-bold">{inr(o.total)}</td>
                  <td className="p-4"><StatusBadge status={o.status} /></td>
                  <td className="p-4"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="p-4 text-right"><button onClick={() => setOpenId(o.id)} className="font-bold text-primary">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Sheet open={!!sel} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent className="overflow-y-auto">
          {sel && (
            <>
              <SheetHeader><SheetTitle className="text-xl font-extrabold">Order #{sel.number}</SheetTitle></SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="flex gap-2"><StatusBadge status={sel.status} /><StatusBadge status={sel.paymentStatus} /></div>
                <div className="text-sm text-muted-foreground">{sel.tableId ? `Table ${sel.tableId.slice(1)}` : "Takeaway"} · Walk-in Guest</div>
                <ul className="space-y-2 border-y py-3 text-sm">
                  {consolidateOrderItems(sel.items).map((i, idx) => <li key={`${i.productId || i.name}-${idx}`} className="flex justify-between"><span>{i.qty} × {i.name}</span><span className="font-semibold">{inr(i.qty * i.price)}</span></li>)}
                </ul>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{inr(sel.subtotal)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>GST</span><span>{inr(sel.tax)}</span></div>
                  <div className="flex justify-between text-base font-extrabold"><span>Total</span><span>{inr(sel.total)}</span></div>
                </div>
                <div className="grid gap-2">
                  {sel.status === "pending" && <button onClick={() => setOrderStatus(sel.id, "preparing")} className="h-10 rounded-xl bg-info text-sm font-bold text-primary-foreground">Mark preparing</button>}
                  {sel.paymentStatus === "unpaid" && <Link to="/payments" search={{ order: sel.id }} className="grid h-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">Collect payment</Link>}
                  {sel.paymentStatus === "paid" && (
                    <div className="space-y-2">
                      <Link to="/invoice/$orderId" params={{ orderId: sel.id }} className="grid h-10 place-items-center rounded-xl border-2 border-primary text-sm font-bold text-primary">
                        View Invoice & Receipt
                      </Link>
                      <button
                        onClick={() => {
                          sendWhatsAppBill(sel);
                        }}
                        className="w-full h-10 rounded-xl bg-emerald-600 text-xs font-extrabold text-white flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow"
                      >
                        <MessageSquare className="size-4" /> Send Bill via WhatsApp 💬
                      </button>
                    </div>
                  )}
                  {(sel.status === "pending" || sel.status === "preparing") && <button onClick={() => setOrderStatus(sel.id, "cancelled")} className="h-10 rounded-xl bg-danger-soft text-sm font-bold text-destructive">Cancel order</button>}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
