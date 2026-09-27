import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  IndianRupee, ReceiptText, Clock, TrendingUp, RefreshCw, 
  CreditCard, QrCode, Banknote, ShieldCheck, Plus, ShoppingBag, 
  Printer, ArrowUpRight, Flame, Layers
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { PageHeader, StatusBadge, ErrorState } from "@/components/pos/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { api, inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { meta } from "@/lib/meta";
import { isSupabaseConfigured, fetchTodayEarningsFromSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => meta("Billing Dashboard", "Live restaurant collection, POS billing terminal & daily sales metrics."),
  component: Dashboard,
});

function Dashboard() {
  const { orders, products } = usePos();
  const sales = useQuery({ queryKey: ["hourly"], queryFn: api.getHourlySales });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Paid orders calculation
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  
  const grossSales = paidOrders.reduce((s, o) => s + o.subtotal, 0);
  const totalTax = paidOrders.reduce((s, o) => s + o.tax, 0);
  const netCollection = paidOrders.reduce((s, o) => s + o.total, 0);

  const cashCollection = paidOrders.filter(o => o.paymentMethod === "cash").reduce((s, o) => s + o.total, 0);
  const upiCollection = paidOrders.filter(o => o.paymentMethod === "upi").reduce((s, o) => s + o.total, 0);
  const cardCollection = paidOrders.filter(o => o.paymentMethod === "card").reduce((s, o) => s + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing");
  const topDishes = [...products].sort((a, b) => (b.soldToday ?? 0) - (a.soldToday ?? 0)).slice(0, 5);

  const handleRefreshCollection = async () => {
    setIsRefreshing(true);
    toast.info("Syncing daily collection with Supabase database...");
    
    if (isSupabaseConfigured) {
      const liveStats = await fetchTodayEarningsFromSupabase();
      if (liveStats) {
        toast.success(`Daily collection synced! ${liveStats.orderCount} paid orders today.`);
      } else {
        toast.success("Daily collection metrics updated!");
      }
    } else {
      setTimeout(() => {
        toast.success("Daily collection metrics refreshed.");
      }, 500);
    }
    
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <AppShell>
      <PageHeader 
        title="Restaurant Billing & Collection Center 🍽️" 
        subtitle="Live daily collection counters, GST summary & POS order terminal."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefreshCollection}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
            >
              <RefreshCw className={`size-4 text-primary ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Collection
            </button>
            <Link 
              to="/pos" 
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity"
            >
              <Plus className="size-4" /> Quick Bill (+ New Order)
            </Link>
          </div>
        } 
      />

      {/* Database Connection & Daily Status Pill */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative grid size-3 place-items-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-sm font-bold">
            Live Daily Ledger: <span className="text-primary">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "short", day: "numeric" })}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isSupabaseConfigured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-600">
              <ShieldCheck className="size-3.5" /> Supabase DB Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-600">
              Demo Mode Active
            </span>
          )}
        </div>
      </div>

      {/* Main Daily Collection Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-surface p-5 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Today&apos;s Net Collection</span>
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <IndianRupee className="size-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black">{inr(netCollection)}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Gross: {inr(grossSales)}</span> • <span>GST: {inr(totalTax)}</span>
          </div>
        </div>

        <div className="card-surface p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Total Bills Today</span>
            <div className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
              <ReceiptText className="size-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black">{orders.length} Bills</div>
          <div className="mt-1 text-xs text-muted-foreground font-semibold">
            {paidOrders.length} Paid • {pendingOrders.length} Kitchen Active
          </div>
        </div>

        <div className="card-surface p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Active Kitchen Orders</span>
            <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="size-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black">{pendingOrders.length} Orders</div>
          <div className="mt-1 text-xs text-amber-600 font-bold">
            Preparing in kitchen now
          </div>
        </div>

        <div className="card-surface p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Average Bill Size</span>
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black">
            {inr(paidOrders.length > 0 ? Math.round(netCollection / paidOrders.length) : 0)}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-bold">
            Across Dine-in & Takeaway
          </div>
        </div>
      </div>

      {/* Payment Method Collection Split Bar */}
      <div className="mt-6 card-surface p-5">
        <h3 className="text-sm font-extrabold text-muted-foreground uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Today&apos;s Collection Breakdown by Payment Mode</span>
          <span className="text-xs text-foreground font-bold font-mono">Net: {inr(netCollection)}</span>
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border bg-emerald-500/5 p-4 border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 font-bold">
                <QrCode className="size-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-muted-foreground">UPI Collection</div>
                <div className="text-lg font-black text-emerald-600">{inr(upiCollection)}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-emerald-500/10 px-2 py-1 rounded-lg">GPay / PhonePe</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-blue-500/5 p-4 border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-500/15 text-blue-600 font-bold">
                <Banknote className="size-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-muted-foreground">Cash Collection</div>
                <div className="text-lg font-black text-blue-600">{inr(cashCollection)}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-blue-500/10 px-2 py-1 rounded-lg">Register Cash</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-purple-500/5 p-4 border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-purple-500/15 text-purple-600 font-bold">
                <CreditCard className="size-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-muted-foreground">Card Collection</div>
                <div className="text-lg font-black text-purple-600">{inr(cardCollection)}</div>
              </div>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-purple-500/10 px-2 py-1 rounded-lg">POS Machine</span>
          </div>
        </div>
      </div>

      {/* Hourly Sales Chart & Top Selling Dishes */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base flex items-center gap-2">
              <Clock className="size-4 text-primary" /> Hourly Sales Peak Analysis
            </h2>
            <span className="text-xs text-muted-foreground font-bold">Live Hourly Curve</span>
          </div>
          <div className="mt-4 h-64">
            {sales.isLoading ? (
              <Skeleton className="h-full rounded-xl" />
            ) : sales.isError ? (
              <ErrorState onRetry={() => sales.refetch()} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sales.data}>
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip formatter={(v: number) => inr(v)} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="sales" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="font-extrabold text-base flex items-center gap-2">
            <Flame className="size-4 text-amber-500" /> Today&apos;s Top Dishes
          </h2>
          <ul className="mt-4 space-y-3">
            {topDishes.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-xl">{p.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.soldToday} sold • {inr(p.price)}</div>
                </div>
                <span className="text-sm font-extrabold text-primary">#{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Active Kitchen Bills Table */}
      <div className="card-surface mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base flex items-center gap-2">
            <Layers className="size-4 text-primary" /> Live Pending Kitchen Orders
          </h2>
          <Link to="/orders" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View All Bills <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pendingOrders.map((o) => (
            <div key={o.id} className="rounded-xl border p-4 bg-muted/20 hover:border-primary transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base">Bill #{o.number}</span>
                <StatusBadge status={o.status} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground font-medium">
                {o.tableId ? `Table ${o.tableId.slice(1)}` : "Takeaway"} • {o.items.length} items
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-2">
                <span className="font-extrabold text-foreground">{inr(o.total)}</span>
                <Link 
                  to="/payments" 
                  search={{ order: o.id }} 
                  className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20"
                >
                  Pay Bill
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
