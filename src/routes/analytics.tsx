import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  BarChart3, IndianRupee, QrCode, Banknote, 
  ArrowUpRight, Calendar, CheckCircle2 
} from "lucide-react";
import { AppShell } from "@/components/pos/AppShell";
import { PageHeader } from "@/components/pos/ui";
import { meta } from "@/lib/meta";
import { usePos } from "@/lib/pos-store";
import { inr } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PowerBiDashboardView } from "@/components/pos/PowerBiDashboardView";

export const Route = createFileRoute("/analytics")({
  head: () => meta("Daily Analytics & Collection Reports", "Live daily collection breakdown, GST tax summary & Power BI integration."),
  component: Analytics,
});

function Analytics() {
  const { orders } = usePos();

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const grossSales = paidOrders.reduce((s, o) => s + o.subtotal, 0);
  const totalTax = paidOrders.reduce((s, o) => s + o.tax, 0);
  const netCollection = paidOrders.reduce((s, o) => s + o.total, 0);

  const cashCollection = paidOrders.filter((o) => o.paymentMethod === "cash").reduce((s, o) => s + o.total, 0);
  const upiCollection = paidOrders.filter((o) => o.paymentMethod === "upi").reduce((s, o) => s + o.total, 0);

  return (
    <AppShell>
      <PageHeader 
        title="Daily Sales & Collection Reports 📈" 
        subtitle="Detailed daily collection totals, GST breakdown, and live database sync status." 
        actions={
          <Link 
            to="/powerbi" 
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            <BarChart3 className="size-4" /> Open Power BI Hub
          </Link>
        }
      />

      {/* Database Connection Summary */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">
            <Calendar className="size-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-muted-foreground uppercase">Daily Collection Ledger Date</div>
            <div className="text-base font-extrabold text-foreground">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-600">
              <CheckCircle2 className="size-4" /> Supabase Real-Time Sync Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-600">
              Local State Demo Mode
            </span>
          )}
        </div>
      </div>

      {/* Power BI Interactive Report Component */}
      <div className="mb-8">
        <PowerBiDashboardView />
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5 border-l-4 border-l-primary">
          <div className="text-xs font-extrabold text-muted-foreground uppercase">Net Daily Collection</div>
          <div className="text-3xl font-black text-primary mt-2">{inr(netCollection)}</div>
          <div className="text-xs text-muted-foreground mt-1">Total revenue collected today</div>
        </div>

        <div className="card-surface p-5 border-l-4 border-l-blue-500">
          <div className="text-xs font-extrabold text-muted-foreground uppercase">Gross Subtotal</div>
          <div className="text-3xl font-black text-foreground mt-2">{inr(grossSales)}</div>
          <div className="text-xs text-muted-foreground mt-1">Food sales before GST tax</div>
        </div>

        <div className="card-surface p-5 border-l-4 border-l-amber-500">
          <div className="text-xs font-extrabold text-muted-foreground uppercase">GST Tax Collected</div>
          <div className="text-3xl font-black text-amber-600 mt-2">{inr(totalTax)}</div>
          <div className="text-xs text-muted-foreground mt-1">CGST (2.5%) + SGST (2.5%)</div>
        </div>
      </div>

      {/* Payment Split Detail Grid (Cash vs UPI) */}
      <div className="mt-6 card-surface p-5">
        <h3 className="font-extrabold text-base mb-4">Cash vs UPI Collection Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-emerald-500/5 p-5 border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600">
                <QrCode className="size-6" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-muted-foreground uppercase">UPI / QR Code</div>
                <div className="text-2xl font-black text-emerald-600">{inr(upiCollection)}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-xl">GPay / PhonePe</span>
          </div>

          <div className="rounded-2xl border bg-blue-500/5 p-5 border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-blue-500/15 text-blue-600">
                <Banknote className="size-6" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-muted-foreground uppercase">Cash Register</div>
                <div className="text-2xl font-black text-blue-600">{inr(cashCollection)}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-500/10 px-2.5 py-1 rounded-xl">Physical Cash</span>
          </div>
        </div>
      </div>

      {/* Today's Transactions Ledger Table */}
      <div className="mt-6 card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base">Today&apos;s Paid Bills Ledger</h3>
          <span className="text-xs text-muted-foreground font-bold">{paidOrders.length} Paid Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead className="border-b bg-muted/50 text-muted-foreground font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-3">Bill #</th>
                <th className="p-3">Order Type</th>
                <th className="p-3">Items</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Time</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paidOrders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-extrabold text-foreground">#{o.number}</td>
                  <td className="p-3">{o.tableId ? `Table ${o.tableId.slice(1)}` : "Takeaway"}</td>
                  <td className="p-3">{o.items.length} Items</td>
                  <td className="p-3">
                    <span className="uppercase font-bold text-xs px-2 py-0.5 rounded bg-muted">
                      {o.paymentMethod || "UPI"}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground font-mono">
                    {new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3 text-right font-black text-foreground">{inr(o.total)}</td>
                  <td className="p-3 text-right">
                    <Link 
                      to="/invoice/$orderId" 
                      params={{ orderId: o.id }} 
                      className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                    >
                      Bill <ArrowUpRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
