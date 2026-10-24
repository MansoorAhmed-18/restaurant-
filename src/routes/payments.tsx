import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, Loader2, QrCode, Lock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, PageHeader, StatusBadge } from "@/components/pos/ui";
import { inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import type { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";
import { isManager, getActiveStaff } from "@/lib/auth";

export const Route = createFileRoute("/payments")({
  validateSearch: (s: Record<string, unknown>) => ({ order: typeof s["order"] === "string" ? s["order"] : undefined }),
  head: () => meta("Payments", "Payment status for every bill plus UPI QR collection."),
  component: Payments,
});

// Decorative QR pattern — replace with a real UPI QR from your payment gateway later.
function FakeQr({ seed }: { seed: number }) {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21);
    const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || (x > a + 1 && x < a + 5 && y > b + 1 && y < b + 5));
    if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true;
    if ((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)) return false;
    return ((x * 7 + y * 13 + seed) * 2654435761) % 7 < 3;
  });
  return <div className="grid aspect-square w-56 grid-cols-[repeat(21,1fr)] rounded-xl bg-card p-3">{cells.map((on, i) => <span key={i} className={on ? "bg-foreground" : ""} />)}</div>;
}

function Payments() {
  const { orders, payOrder } = usePos();
  const { order } = Route.useSearch();
  const nav = useNavigate();
  const activeStaff = getActiveStaff();
  const isUserMgr = isManager(activeStaff);

  const unpaid = orders.filter((o) => o.paymentStatus === "unpaid" && o.status !== "cancelled");
  const [selId, setSelId] = useState(order ?? unpaid[0]?.id);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [busy, setBusy] = useState(false);
  const sel = orders.find((o) => o.id === selId && o.paymentStatus === "unpaid" && o.status !== "cancelled");

  const confirm = () => {
    if (!sel) return;
    if (sel.status === "cancelled") {
      toast.error("Cancelled orders cannot be collected by anyone, including managers.");
      return;
    }
    if (!isUserMgr) {
      toast.error("Access denied: Only Managers can collect payment.");
      return;
    }
    setBusy(true);
    setTimeout(() => { // simulated gateway confirmation
      payOrder(sel.id, method); setBusy(false);
      toast.success(`Payment received for #${sel.number}`);
      nav({ to: "/invoice/$orderId", params: { orderId: sel.id } });
    }, 1200);
  };

  if (!isUserMgr) {
    return (
      <AppShell>
        <PageHeader title="Payments" subtitle="Manager Access Required" />
        <div className="card-surface p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4 my-8 border border-amber-500/30">
          <div className="size-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
            <Lock className="size-8" />
          </div>
          <h2 className="text-xl font-black text-foreground">Manager Access Only</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Only restaurant Managers are authorized to collect payments, process UPI QR transactions, and settle customer bills.
          </p>
          <button
            onClick={() => nav({ to: "/pos" })}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow hover:opacity-90 transition-all"
          >
            Go to New Order
          </button>
        </div>
      </AppShell>
    );
  }

  const methods = [{ id: "upi", label: "UPI / QR", icon: QrCode }, { id: "cash", label: "Cash", icon: Banknote }] as const;

  return (
    <AppShell>
      <PageHeader title="Payments" subtitle="Collect bills and track payment status" />
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b"><th className="p-4">Order</th><th className="p-4">Amount</th><th className="p-4">Method</th><th className="p-4">Status</th></tr></thead>
            <tbody>
              {orders.map((o) => {
                const isCancelled = o.status === "cancelled";
                const isSelectable = o.paymentStatus === "unpaid" && !isCancelled;
                return (
                  <tr 
                    key={o.id} 
                    onClick={() => isSelectable && setSelId(o.id)} 
                    className={cn(
                      "border-b last:border-0 transition-colors", 
                      isSelectable && "cursor-pointer hover:bg-muted/50", 
                      isCancelled && "opacity-50 bg-muted/20 cursor-not-allowed",
                      sel?.id === o.id && "bg-primary-soft"
                    )}
                  >
                    <td className="p-4 font-extrabold flex items-center gap-1.5">
                      <span>#{o.number}</span>
                      {isCancelled && <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/20">Cancelled</span>}
                    </td>
                    <td className="p-4 font-semibold">{inr(o.total)}</td>
                    <td className="p-4 uppercase text-muted-foreground">{isCancelled ? "VOID" : (o.paymentMethod ?? "—")}</td>
                    <td className="p-4"><StatusBadge status={isCancelled ? "cancelled" : o.paymentStatus} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-surface h-fit p-6">
          {!sel ? <EmptyState title="Nothing to collect" text="All bills are settled. Select an unpaid order to collect payment." /> : (
            <>
              <div className="text-sm font-bold text-muted-foreground">Collecting for order #{sel.number}</div>
              <div className="text-4xl font-black text-primary font-mono mt-1">{inr(sel.total)}</div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {methods.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setMethod(id)} className={cn("flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-bold transition-all", method === id ? "border-primary bg-primary/10 text-primary ring-2 ring-yellow-400/40 shadow-sm" : "border-border hover:border-primary/50")}>
                    <Icon className="size-5" />{label}
                  </button>
                ))}
              </div>
              {method === "upi" && (
                <div className="mt-5 flex flex-col items-center rounded-2xl bg-gradient-to-b from-primary/10 via-purple-500/5 to-yellow-400/10 border border-primary/20 p-5 shadow-sm">
                  <FakeQr seed={sel.number} />
                  <span className="mt-3 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-yellow-400 text-purple-950 shadow-xs">Scan & Pay Instant UPI</span>
                  <div className="mt-2 text-sm font-black text-foreground">Scan with any UPI app</div>
                  <div className="text-xs text-muted-foreground font-mono">meat.theory@upi · GPay · PhonePe · Paytm</div>
                </div>
              )}
              {method === "cash" && <div className="mt-5 rounded-2xl bg-muted p-5 text-center text-sm font-medium text-foreground">Collect <span className="font-bold text-primary font-mono">{inr(sel.total)}</span> in cash and confirm.</div>}
              <button disabled={busy} onClick={confirm} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 disabled:opacity-70 transition-all">
                {busy && <Loader2 className="size-4 animate-spin text-yellow-300" />}{busy ? "Confirming…" : "Mark as paid & Print Receipt"}
              </button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
