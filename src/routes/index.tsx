import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  IndianRupee, TrendingUp, TrendingDown, RefreshCw, 
  Plus, Calendar, BarChart2, CheckCircle2, Clock, 
  ArrowUpRight, Sparkles, Layers
} from "lucide-react";
import { 
  Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, 
  CartesianGrid, Cell 
} from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { PageHeader, StatusBadge } from "@/components/pos/ui";
import { inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { meta } from "@/lib/meta";
import { isSupabaseConfigured, fetchTodayEarningsFromSupabase } from "@/lib/supabase";
import { getActiveStaff, type StaffUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => meta("Sales Dashboard", "Live today sales, yesterday comparison & weekly everyday sales chart."),
  component: Dashboard,
});

// Weekly everyday sales dataset (Monday to Sunday)
const WEEKLY_EVERYDAY_SALES = [
  { day: "Mon", dayFull: "Monday", sales: 24500, orders: 48, isToday: false },
  { day: "Tue", dayFull: "Tuesday", sales: 27800, orders: 54, isToday: false },
  { day: "Wed", dayFull: "Wednesday", sales: 26200, orders: 51, isToday: false },
  { day: "Thu", dayFull: "Thursday", sales: 31400, orders: 62, isToday: false },
  { day: "Fri", dayFull: "Friday", sales: 39800, orders: 78, isToday: false },
  { day: "Sat", dayFull: "Saturday", sales: 48500, orders: 95, isToday: false },
  { day: "Sun", dayFull: "Sunday", sales: 44200, orders: 86, isToday: true }, // Marked as Today
];

export function Dashboard() {
  const { orders } = usePos();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [staff, setStaff] = useState<StaffUser>(getActiveStaff());

  useEffect(() => {
    setStaff(getActiveStaff());
  }, []);

  const getTimeGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  // Live order calculations
  const safeOrders = orders || [];
  const paidOrders = safeOrders.filter((o) => o?.paymentStatus === "paid");
  const liveNetSales = paidOrders.reduce((s, o) => s + (o?.total || 0), 0);
  const pendingOrders = safeOrders.filter((o) => o?.status === "pending" || o?.status === "preparing");

  // Today vs Yesterday metrics
  // Base baseline + live pos additions
  const todaySales = 44200 + liveNetSales;
  const yesterdaySales = 48500;
  const todayOrdersCount = 86 + paidOrders.length;
  const yesterdayOrdersCount = 95;

  const diffAmount = todaySales - yesterdaySales;
  const diffPercent = Number(((diffAmount / yesterdaySales) * 100).toFixed(1));
  const isPositiveGrowth = diffAmount >= 0;

  // Weekly data with dynamic live today value
  const weeklyData = useMemo(() => {
    return WEEKLY_EVERYDAY_SALES.map((d) => {
      if (d.isToday) {
        return {
          ...d,
          sales: todaySales,
          orders: todayOrdersCount,
        };
      }
      return d;
    });
  }, [todaySales, todayOrdersCount]);

  const peakDay = useMemo(() => {
    return [...weeklyData].sort((a, b) => b.sales - a.sales)[0];
  }, [weeklyData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Syncing sales data...");
    if (isSupabaseConfigured) {
      await fetchTodayEarningsFromSupabase();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Sales metrics refreshed!");
    }, 500);
  };

  const todayFormattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <AppShell>
      <div className="w-full max-w-full overflow-hidden space-y-4 sm:space-y-6">
        {/* Page Header */}
        <PageHeader 
          title={`${getTimeGreeting()}, ${staff.name.split(" ")[0]} 👋`} 
          subtitle="Today's sales, yesterday comparison and weekly everyday sales report."
          actions={
            <div className="flex w-full sm:w-auto items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-xs sm:text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
              >
                <RefreshCw className={`size-3.5 sm:size-4 text-primary shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
              <Link 
                to="/pos" 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity"
              >
                <Plus className="size-4 shrink-0" />
                <span>+ New Order</span>
              </Link>
            </div>
          } 
        />

        {/* Live Date Status Banner */}
        <div className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative grid size-2.5 place-items-center shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground truncate">
              Live Restaurant Ledger: <span className="text-primary font-extrabold">{todayFormattedDate}</span>
            </span>
          </div>
        </div>

        {/* TODAY SALES & YESTERDAY VS TODAY COMPARISON CARDS */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Today's Sales */}
          <div className="card-surface p-4 sm:p-5 border-l-4 border-l-primary relative overflow-hidden min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                Today&apos;s Sales
              </span>
              <div className="grid size-9 sm:size-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <IndianRupee className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-black text-foreground font-mono">{inr(todaySales)}</div>
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>{todayOrdersCount} Orders Completed</span>
              <span className="font-bold text-primary font-mono">{inr(Math.round(todaySales / (todayOrdersCount || 1)))} Avg/Bill</span>
            </div>
          </div>

          {/* Card 2: Yesterday's Sales */}
          <div className="card-surface p-4 sm:p-5 border-l-4 border-l-blue-500 relative overflow-hidden min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                Yesterday&apos;s Sales
              </span>
              <div className="grid size-9 sm:size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                <Calendar className="size-5" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-black text-foreground font-mono">{inr(yesterdaySales)}</div>
            <div className="mt-2 text-xs font-semibold text-muted-foreground">
              <span>{yesterdayOrdersCount} Orders Settled</span>
            </div>
          </div>

          {/* Card 3: Today vs Yesterday Comparison */}
          <div className="card-surface p-4 sm:p-5 border-l-4 sm:col-span-2 lg:col-span-1 border-l-emerald-500 relative overflow-hidden min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                  Today vs Yesterday
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black ${
                  isPositiveGrowth ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"
                }`}>
                  {isPositiveGrowth ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                  {diffPercent >= 0 ? `+${diffPercent}%` : `${diffPercent}%`}
                </span>
              </div>
              <div className="mt-3 text-xl sm:text-2xl font-black text-foreground font-mono">
                {isPositiveGrowth ? `+${inr(diffAmount)}` : `-${inr(Math.abs(diffAmount))}`}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {isPositiveGrowth ? "Higher revenue compared to yesterday" : "Slight variance compared to yesterday shift"}
              </p>
            </div>

            {/* Visual ratio bar */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-primary">Today ({Math.round((todaySales / (todaySales + yesterdaySales)) * 100)}%)</span>
                <span className="text-blue-500">Yesterday ({Math.round((yesterdaySales / (todaySales + yesterdaySales)) * 100)}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(todaySales / (todaySales + yesterdaySales)) * 100}%` }}
                ></div>
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(yesterdaySales / (todaySales + yesterdaySales)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* WEEKLY COMPARISON COLUMN CHART (EVERYDAY SALES) */}
        <div className="card-surface p-4 sm:p-5 min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2 text-foreground">
                <BarChart2 className="size-5 text-primary shrink-0" /> Weekly Everyday Sales Comparison (Column Chart)
              </h2>
              <p className="text-xs text-muted-foreground">
                Day-by-day revenue comparison across Monday to Sunday (Orange bar indicates peak rush day)
              </p>
            </div>
            {peakDay && (
              <span className="self-start sm:self-auto inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-600">
                <Sparkles className="size-3.5 shrink-0" /> Peak: {peakDay.dayFull} ({inr(peakDay.sales)})
              </span>
            )}
          </div>

          {/* Recharts Column Chart */}
          <div className="h-64 sm:h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={12} 
                  fontWeight="bold"
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={11} 
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  formatter={(value: number) => [inr(value), "Sales Revenue"]}
                  labelFormatter={(label, items) => {
                    const row = items[0]?.payload;
                    return row ? `${row.dayFull} • ${row.orders} Orders` : String(label);
                  }}
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    borderColor: "var(--border)", 
                    borderRadius: "0.75rem", 
                    fontSize: "12px", 
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
                  }}
                />
                <Bar dataKey="sales" name="sales" radius={[8, 8, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`weekly-cell-${index}`} 
                      fill={entry.sales === peakDay.sales ? "#f97316" : entry.isToday ? "var(--primary)" : "#3b82f6"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Everyday Breakdown Grid */}
          <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {weeklyData.map((d) => (
              <div 
                key={d.day} 
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  d.isToday 
                    ? "bg-primary/10 border-primary shadow-sm" 
                    : "bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div className="text-[11px] font-extrabold uppercase text-muted-foreground flex items-center justify-center gap-1">
                  <span>{d.day}</span>
                  {d.isToday && <span className="size-1.5 rounded-full bg-primary"></span>}
                </div>
                <div className="text-xs sm:text-sm font-black text-foreground font-mono mt-1">{inr(d.sales)}</div>
                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{d.orders} orders</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Active Kitchen Orders Section */}
        <div className="card-surface p-4 sm:p-5 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <Layers className="size-4 text-primary shrink-0" /> Live Kitchen Bills
            </h2>
            <Link to="/orders" className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:underline">
              View All Bills <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
              No active pending kitchen orders. Ready for next order.
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {pendingOrders.map((o) => (
                <div key={o.id} className="rounded-xl border p-3 bg-muted/20 hover:border-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">Bill #{o.number}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground font-medium">
                    {o.tableId ? `Table ${o.tableId.slice(1)}` : "Takeaway"} • {o.items.length} items
                  </div>
                  <div className="mt-2.5 flex items-center justify-between border-t pt-2">
                    <span className="font-extrabold text-foreground text-sm font-mono">{inr(o.total)}</span>
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
          )}
        </div>
      </div>
    </AppShell>
  );
}
