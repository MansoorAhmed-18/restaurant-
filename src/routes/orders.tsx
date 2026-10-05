import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, Calendar, Clock, CheckCircle2 } from "lucide-react";
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

function formatOrderDateTime(isoString?: string) {
  if (!isoString) return { date: "Today", time: "—", full: "Today" };
  const d = new Date(isoString);
  const date = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return { date, time, full: `${date}, ${time}` };
}

function Orders() {
  const { orders, setOrderStatus } = usePos();
  const [tab, setTab] = useState("active");
  const [openId, setOpenId] = useState<string | null>(null);
  const t = tabs.find((x) => x.id === tab)!;
  const list = orders.filter((o) => t.match(o.status));
  const sel = orders.find((o) => o.id === openId);
  return (
    <AppShell>
      <PageHeader title="Orders" subtitle="Track every ticket from kitchen to bill with live dates & times" />
      <div className="mb-5 flex gap-2">
        {tabs.map((x) => (
          <button key={x.id} onClick={() => setTab(x.id)} className={cn("rounded-full border px-4 py-2 text-sm font-bold transition-all", tab === x.id ? "border-primary bg-primary text-primary-foreground shadow-sm" : "bg-card hover:bg-muted")}>
            {x.label} · {orders.filter((o) => x.match(o.status)).length}
          </button>
        ))}
      </div>
      {list.length === 0 ? <EmptyState title={`No ${t.label.toLowerCase()} orders`} text="Orders will show up here as they come in." /> : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b">
              <th className="p-4">Order #</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Type</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4" />
            </tr></thead>
            <tbody>
              {list.map((o) => {
                const dt = formatOrderDateTime(o.createdAt);
                return (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-extrabold text-foreground">
                      #{o.number}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <Calendar className="size-3.5 text-primary shrink-0" />
                        <span>{dt.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Clock className="size-3 shrink-0" />
                        <span>{dt.time}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{o.tableId ? `Table ${o.tableId.slice(1)}` : "Takeaway"}</td>
                    <td className="p-4">{consolidateOrderItems(o.items).reduce((s, i) => s + i.qty, 0)} items</td>
                    <td className="p-4 font-black text-foreground">{inr(o.total)}</td>
                    <td className="p-4"><StatusBadge status={o.status} /></td>
                    <td className="p-4"><StatusBadge status={o.paymentStatus} /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => setOpenId(o.id)} className="font-bold text-primary hover:underline">
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Sheet open={!!sel} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent className="overflow-y-auto">
          {sel && (() => {
            const dt = formatOrderDateTime(sel.createdAt);
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="text-xl font-extrabold flex items-center justify-between">
                    <span>Order #{sel.number}</span>
                    <span className="text-xs font-mono font-medium text-muted-foreground">ID: {sel.id}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="space-y-4 px-4 pb-6 mt-4">
                  {/* Date & Time Highlight Card */}
                  <div className="rounded-xl border bg-muted/30 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" /> Order Date:
                      </span>
                      <span className="font-extrabold text-foreground">{dt.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" /> Order Time:
                      </span>
                      <span className="font-bold text-foreground">{dt.time}</span>
                    </div>
                    {sel.status === "completed" && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold pt-1 border-t border-muted">
                        <CheckCircle2 className="size-3.5" /> Order Successfully Completed & Settled
                      </div>
                    )}
                  </div>

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
            );
          })()}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

