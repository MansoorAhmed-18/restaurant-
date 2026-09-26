import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, IndianRupee, ReceiptText, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { AppShell } from "@/components/pos/AppShell";
import { PageHeader, StatCard, StatusBadge, ErrorState } from "@/components/pos/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { api, inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/")({
  head: () => meta("Dashboard", "Today's sales, orders, pending tickets and top-selling dishes."),
  component: Dashboard,
});

function Dashboard() {
  const { orders, products } = usePos();
  const sales = useQuery({ queryKey: ["hourly"], queryFn: api.getHourlySales });
  const paid = orders.filter((o) => o.paymentStatus === "paid");
  const revenue = 83000 + paid.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending" || o.status === "preparing");
  const top = [...products].sort((a, b) => (b.soldToday ?? 0) - (a.soldToday ?? 0)).slice(0, 5);

  return (
    <AppShell>
      <PageHeader title="Good evening, Ravi 👋" subtitle="Here's what's cooking at Spice Route today."
        actions={<Link to="/pos" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)]">+ New Order</Link>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's sales" value={inr(Math.round(revenue))} hint="+14% vs last Thursday" icon={<IndianRupee />} />
        <StatCard label="Orders" value={String(118 + orders.length)} hint="Dine-in & takeaway" icon={<ReceiptText />} tone="info" />
        <StatCard label="Pending orders" value={String(pending.length)} hint="In kitchen right now" icon={<Clock />} tone="warning" />
        <StatCard label="Avg. order value" value={inr(642)} hint="Across all channels" icon={<TrendingUp />} tone="success" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card-surface p-5 lg:col-span-2">
          <h2 className="font-extrabold">Sales by hour</h2>
          <div className="mt-4 h-64">
            {sales.isLoading ? <Skeleton className="h-full rounded-xl" /> : sales.isError ? <ErrorState onRetry={() => sales.refetch()} /> : (
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
          <h2 className="font-extrabold">Top sellers</h2>
          <ul className="mt-4 space-y-3">
            {top.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-xl">{p.emoji}</span>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{p.name}</div><div className="text-xs text-muted-foreground">{p.soldToday} sold · {inr(p.price)}</div></div>
                <span className="text-sm font-extrabold text-primary">#{i + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-surface mt-6 p-5">
        <div className="flex items-center justify-between"><h2 className="font-extrabold">Pending orders</h2><Link to="/orders" className="text-sm font-bold text-primary">View all</Link></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pending.map((o) => (
            <div key={o.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between"><span className="font-extrabold">#{o.number}</span><StatusBadge status={o.status} /></div>
              <div className="mt-1 text-xs text-muted-foreground">{o.tableId ? `Table ${o.tableId.slice(1)}` : "Takeaway"} · {o.items.length} items</div>
              <div className="mt-2 font-bold">{inr(o.total)}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
