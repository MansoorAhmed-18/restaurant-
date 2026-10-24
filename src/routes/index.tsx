import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  IndianRupee, TrendingUp, TrendingDown, RefreshCw, 
  Plus, Calendar, BarChart2, CheckCircle2, Clock, 
  ArrowUpRight, Sparkles, Layers, ExternalLink, Settings, Utensils
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
import { cn } from "@/lib/utils";
import { isSupabaseConfigured, fetchTodayEarningsFromSupabase } from "@/lib/supabase";
import { getActiveStaff, type StaffUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => meta("Sales Dashboard", "Live today sales, yesterday comparison & weekly everyday sales chart."),
  component: Dashboard,
});

const DEFAULT_FABRIC_URL = "https://app.fabric.microsoft.com/groups/me/reports/c9b4ed0b-775d-4f8a-b056-a3b7c6c6683d/1eeb52d1680cd4017b76?experience=fabric-developer";

const DAYS_OF_WEEK = [
  { day: "Mon", dayIndex: 1, dayFull: "Monday" },
  { day: "Tue", dayIndex: 2, dayFull: "Tuesday" },
  { day: "Wed", dayIndex: 3, dayFull: "Wednesday" },
  { day: "Thu", dayIndex: 4, dayFull: "Thursday" },
  { day: "Fri", dayIndex: 5, dayFull: "Friday" },
  { day: "Sat", dayIndex: 6, dayFull: "Saturday" },
  { day: "Sun", dayIndex: 0, dayFull: "Sunday" },
];

export function Dashboard() {
  const { orders, tables } = usePos();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [staff, setStaff] = useState<StaffUser>(() => getActiveStaff() || { name: "Staff", role: "Manager", username: "manager" });
  const [fabricUrl, setFabricUrl] = useState<string>(DEFAULT_FABRIC_URL);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    const s = getActiveStaff();
    if (s) setStaff(s);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fabric_dashboard_url");
      if (stored) setFabricUrl(stored);
    }
  }, []);

  const getTimeGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  // Date helper for accurate local date comparison (prevents UTC timezone shift issues)
  const isSameDate = (d1: string | Date | undefined, d2: string | Date): boolean => {
    if (!d1) return false;
    const a = new Date(d1);
    const b = new Date(d2);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  // Safe orders list (all non-cancelled orders)
  const safeOrders = orders || [];
  const validOrders = useMemo(() => {
    return safeOrders.filter((o) => o && o.status !== "cancelled");
  }, [safeOrders]);

  // Realized / collected sales: only paid orders are sales! (Live unpaid orders excluded)
  const paidOrders = useMemo(() => {
    return validOrders.filter((o) => (o.paymentStatus === "paid" || o.status === "completed") && o.status !== "cancelled");
  }, [validOrders]);

  const liveOrders = useMemo(() => {
    return validOrders.filter((o) => o.paymentStatus === "unpaid" && o.status !== "cancelled");
  }, [validOrders]);

  const pendingOrders = useMemo(() => {
    return safeOrders.filter((o) => o && (o.status === "pending" || o.status === "preparing"));
  }, [safeOrders]);

  // Current local date & yesterday's local date
  const now = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  // Group actual valid orders by exact local date
  const todayOrders = useMemo(() => {
    return validOrders.filter((o) => isSameDate(o.createdAt, now));
  }, [validOrders, now]);

  const todayPaidOrders = useMemo(() => {
    return paidOrders.filter((o) => isSameDate(o.createdAt, now));
  }, [paidOrders, now]);

  const todayLiveOrders = useMemo(() => {
    return liveOrders.filter((o) => isSameDate(o.createdAt, now));
  }, [liveOrders, now]);

  const yesterdayOrders = useMemo(() => {
    return validOrders.filter((o) => isSameDate(o.createdAt, yesterdayDate));
  }, [validOrders, yesterdayDate]);

  const yesterdayPaidOrders = useMemo(() => {
    return paidOrders.filter((o) => isSameDate(o.createdAt, yesterdayDate));
  }, [paidOrders, yesterdayDate]);

  // EXACT Real Sales: Realized from settled/paid bills only (Live orders excluded from today's sale)
  const todaySales = useMemo(() => {
    return todayPaidOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  }, [todayPaidOrders]);

  const todayLiveAmount = useMemo(() => {
    return todayLiveOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  }, [todayLiveOrders]);

  const todayOrdersCount = todayOrders.length;
  const todayPaidOrdersCount = todayPaidOrders.length;
  const todayLiveOrdersCount = todayLiveOrders.length;

  // Yesterday actual sales directly from settled paid orders
  const yesterdaySales = useMemo(() => {
    return yesterdayPaidOrders.reduce((sum, o) => sum + (Number(o?.total) || 0), 0);
  }, [yesterdayPaidOrders]);

  const yesterdayOrdersCount = yesterdayPaidOrders.length;

  // Comparison metrics
  const diffAmount = todaySales - yesterdaySales;
  const diffPercent = yesterdaySales > 0 
    ? Number(((diffAmount / yesterdaySales) * 100).toFixed(1)) 
    : (todaySales > 0 ? 100 : 0);
  const isPositiveGrowth = diffAmount >= 0;

  // Toggle for This Week vs Previous Week sales in Weekly Everyday Sales Chart
  const [selectedWeek, setSelectedWeek] = useState<"current" | "previous">("current");

  // Calculate current week's Monday for the column chart
  const startOfThisWeek = useMemo(() => {
    const d = new Date();
    const day = d.getDay(); // 0 is Sun, 1 is Mon...
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Calculate previous week's Monday (7 days prior)
  const startOfPreviousWeek = useMemo(() => {
    const d = new Date(startOfThisWeek);
    d.setDate(d.getDate() - 7);
    return d;
  }, [startOfThisWeek]);

  // Weekly everyday column chart dynamically calculated from real PAID orders of the selected week
  const weeklyData = useMemo(() => {
    const baseDate = selectedWeek === "current" ? startOfThisWeek : startOfPreviousWeek;

    return DAYS_OF_WEEK.map((d, index) => {
      const targetDate = new Date(baseDate);
      targetDate.setDate(baseDate.getDate() + index);

      const isToday = isSameDate(targetDate, now);

      // Filter real PAID orders for this specific date in the selected week (Excludes live unpaid orders)
      const dayPaidOrders = paidOrders.filter((o) => isSameDate(o?.createdAt, targetDate));

      const sales = dayPaidOrders.reduce((s, o) => s + (Number(o?.total) || 0), 0);
      const orderCount = dayPaidOrders.length;
      const dateLabel = targetDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

      return {
        day: d.day,
        dayFull: d.dayFull,
        dateLabel,
        sales,
        orders: orderCount,
        isToday,
      };
    });
  }, [paidOrders, selectedWeek, startOfThisWeek, startOfPreviousWeek, now]);

  const selectedWeekTotalSales = useMemo(() => {
    return weeklyData.reduce((sum, d) => sum + d.sales, 0);
  }, [weeklyData]);

  const thisWeekTotal = useMemo(() => {
    return DAYS_OF_WEEK.reduce((sum, _, index) => {
      const targetDate = new Date(startOfThisWeek);
      targetDate.setDate(startOfThisWeek.getDate() + index);
      const daySales = paidOrders
        .filter((o) => isSameDate(o?.createdAt, targetDate))
        .reduce((s, o) => s + (Number(o?.total) || 0), 0);
      return sum + daySales;
    }, 0);
  }, [paidOrders, startOfThisWeek]);

  const prevWeekTotal = useMemo(() => {
    return DAYS_OF_WEEK.reduce((sum, _, index) => {
      const targetDate = new Date(startOfPreviousWeek);
      targetDate.setDate(startOfPreviousWeek.getDate() + index);
      const daySales = paidOrders
        .filter((o) => isSameDate(o?.createdAt, targetDate))
        .reduce((s, o) => s + (Number(o?.total) || 0), 0);
      return sum + daySales;
    }, 0);
  }, [paidOrders, startOfPreviousWeek]);

  const peakDay = useMemo(() => {
    const list = [...weeklyData];
    const max = list.sort((a, b) => b.sales - a.sales)[0];
    const found = (max && max.sales > 0 ? max : weeklyData.find((w) => w.isToday)) || weeklyData[0];
    return found ?? { day: "Mon", dayFull: "Monday", dateLabel: "", sales: 0, orders: 0, isToday: true };
  }, [weeklyData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Syncing live sales & orders...");
    if (isSupabaseConfigured) {
      await fetchTodayEarningsFromSupabase();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(`Dashboard synced! ${validOrders.length} orders loaded.`);
    }, 500);
  };

  const handleSaveFabricUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let url = urlInput.trim();
    if (!url) url = DEFAULT_FABRIC_URL;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    setFabricUrl(url);
    localStorage.setItem("fabric_dashboard_url", url);
    setIsEditingUrl(false);
    toast.success("Microsoft Fabric Dashboard link saved!");
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
        {/* Page Header with Microsoft Fabric Dashboard Button & Actions */}
        <PageHeader 
          title={`${getTimeGreeting()}, ${staff.name.split(" ")[0]} 👋`} 
          subtitle="Real-time sales, yesterday comparison & weekly everyday performance."
          actions={
            <div className="flex w-full sm:w-auto flex-wrap items-center gap-2">
              {/* MICROSOFT FABRIC DASHBOARD BUTTON */}
              <a
                href={fabricUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Open Microsoft Fabric Dashboard (${fabricUrl})`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 border border-purple-600/40 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:from-purple-900 hover:to-indigo-950 transition-all transform active:scale-95"
              >
                <Sparkles className="size-4 text-yellow-300 shrink-0" />
                <span>Fabric Dashboard</span>
                <ExternalLink className="size-3.5 opacity-80 shrink-0" />
              </a>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border bg-card px-3.5 py-2.5 text-xs sm:text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
              >
                <RefreshCw className={`size-3.5 sm:size-4 text-primary shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>

              <Link 
                to="/pos" 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity"
              >
                <Plus className="size-4 text-yellow-300 shrink-0" />
                <span>+ New Order</span>
              </Link>
            </div>
          } 
        />

        {/* Live Date Status & Microsoft Fabric Quick Link Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-card p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative grid size-2.5 place-items-center shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground truncate">
              Live Restaurant Ledger: <span className="text-primary font-extrabold">{todayFormattedDate}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground self-start sm:self-auto">
            <span className="text-foreground font-bold">Fabric Link:</span>
            <a 
              href={fabricUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline max-w-[200px] truncate"
            >
              {fabricUrl.replace(/^https?:\/\//, "")}
            </a>
            <button
              onClick={() => {
                setUrlInput(fabricUrl);
                setIsEditingUrl(!isEditingUrl);
              }}
              title="Edit Fabric URL"
              className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
            >
              <Settings className="size-3.5" />
            </button>
          </div>
        </div>

        {/* URL Edit Form if user wants to change custom Fabric Dashboard link */}
        {isEditingUrl && (
          <form onSubmit={handleSaveFabricUrl} className="flex gap-2 rounded-xl border p-3 bg-card shadow-sm">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste your Microsoft Fabric / PowerBI workspace URL..."
              className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
              Save URL
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditingUrl(false)} 
              className="rounded-lg border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </form>
        )}

        {/* TODAY SALES & YESTERDAY VS TODAY COMPARISON CARDS */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Today's Sales (Realized from paid settled bills only; live orders excluded) */}
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
              <span className="font-bold text-foreground">
                {todayPaidOrdersCount} {todayPaidOrdersCount === 1 ? "Paid Bill" : "Paid Bills"}
                {todayLiveOrdersCount > 0 ? ` · ${todayLiveOrdersCount} Live Unpaid (${inr(todayLiveAmount)})` : ""}
              </span>
              <span className="font-bold text-primary font-mono">
                {todayPaidOrdersCount > 0 ? inr(Math.round(todaySales / todayPaidOrdersCount)) : "₹0"} Avg/Bill
              </span>
            </div>
          </div>

          {/* Card 2: Yesterday's Sales (Realized from paid settled bills only) */}
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
              <span>{yesterdayOrdersCount} {yesterdayOrdersCount === 1 ? "Paid Bill" : "Paid Bills"}</span>
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
                {isPositiveGrowth ? "Higher revenue compared to yesterday" : "Variance compared to yesterday shift"}
              </p>
            </div>

            {/* Visual ratio bar */}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-primary font-black">
                  Today ({todaySales + yesterdaySales > 0 ? Math.round((todaySales / (todaySales + yesterdaySales)) * 100) : 0}%)
                </span>
                <span className="text-yellow-600 font-black">
                  Yesterday ({todaySales + yesterdaySales > 0 ? Math.round((yesterdaySales / (todaySales + yesterdaySales)) * 100) : 0}%)
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden flex ring-1 ring-border">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${todaySales + yesterdaySales > 0 ? (todaySales / (todaySales + yesterdaySales)) * 100 : 50}%` }}
                ></div>
                <div 
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${todaySales + yesterdaySales > 0 ? (yesterdaySales / (todaySales + yesterdaySales)) * 100 : 50}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* WEEKLY COMPARISON COLUMN CHART (EVERYDAY SALES) */}
        <div className="card-surface p-4 sm:p-5 min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2 text-foreground">
                  <BarChart2 className="size-5 text-primary shrink-0" /> Weekly Everyday Sales Comparison (Column Chart)
                </h2>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-black text-primary">
                  {selectedWeek === "current" ? "This Week" : "Previous Week"}: {inr(selectedWeekTotalSales)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedWeek === "current" 
                  ? "Monday to Sunday revenue for active week (paid settled sales only; live bills excluded)" 
                  : "Monday to Sunday revenue for previous week (paid settled sales only)"}
              </p>
            </div>

            {/* BUTTON CONTROLS: THIS WEEK vs PREVIOUS WEEK */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-muted/60 p-1 rounded-xl border shrink-0">
              <button
                type="button"
                onClick={() => setSelectedWeek("current")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5",
                  selectedWeek === "current"
                    ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-yellow-400/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>📅 This Week</span>
                <span className="text-[10px] opacity-80 font-mono">({inr(thisWeekTotal)})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedWeek("previous")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5",
                  selectedWeek === "previous"
                    ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-yellow-400/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>⏮️ Previous Week</span>
                <span className="text-[10px] opacity-80 font-mono">({inr(prevWeekTotal)})</span>
              </button>
            </div>
          </div>

          {peakDay && peakDay.sales > 0 && (
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-black text-yellow-800 dark:text-yellow-400 border border-yellow-400/40 shadow-xs">
                <Sparkles className="size-3.5 text-yellow-600 shrink-0" />
                Peak Rush: {peakDay.dayFull} {peakDay.dateLabel ? `(${peakDay.dateLabel})` : ""} · {inr(peakDay.sales)} ({peakDay.orders} paid bills)
              </span>
            </div>
          )}

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
                  formatter={(value: number) => [inr(value), "Settled Sales"]}
                  labelFormatter={(label, items) => {
                    const row = items[0]?.payload;
                    return row ? `${row.dayFull} (${row.dateLabel}) • ${row.orders} Paid Bills` : String(label);
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
                      fill={entry.sales === peakDay.sales && entry.sales > 0 ? "#facc15" : (entry.isToday && selectedWeek === "current") ? "var(--primary)" : "#a78bfa"} 
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
                  d.isToday && selectedWeek === "current"
                    ? "bg-primary/10 border-primary shadow-sm" 
                    : d.sales === peakDay.sales && d.sales > 0
                    ? "bg-yellow-400/10 border-yellow-400/50"
                    : "bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div className="text-[11px] font-extrabold uppercase text-muted-foreground flex items-center justify-center gap-1">
                  <span>{d.day}</span>
                  {d.isToday && selectedWeek === "current" && <span className="size-1.5 rounded-full bg-primary" title="Today"></span>}
                  {d.sales === peakDay.sales && d.sales > 0 && <span className="size-1.5 rounded-full bg-yellow-400" title="Peak Day"></span>}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground mt-0.5">{d.dateLabel}</div>
                <div className="text-xs sm:text-sm font-black text-foreground font-mono mt-0.5">{inr(d.sales)}</div>
                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{d.orders} paid</div>
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
                    {o.items.length} {o.items.length === 1 ? "item" : "items"}
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

        {/* Live Dine-in Tables Floor Glance */}
        <div className="card-surface p-4 sm:p-5 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-foreground">
                <Utensils className="size-4 text-primary shrink-0" /> Live Dine-in Floor & Tables
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                {tables.filter((t) => t.status === "available").length} Available
              </span>
            </div>
            <Link to="/tables" className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:underline">
              Manage Tables <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {tables.map((t) => (
              <Link
                key={t.id}
                to="/tables"
                search={{ tableId: t.id }}
                className={cn(
                  "rounded-xl border p-2 text-center transition-all hover:scale-105 shadow-sm",
                  t.status === "available" && "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500",
                  t.status === "occupied" && "border-primary/40 bg-primary/10 hover:border-primary",
                  t.status === "reserved" && "border-amber-500/30 bg-amber-500/5 hover:border-amber-500"
                )}
              >
                <div className="text-xs font-black text-foreground">{t.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">{t.seats} seats</div>
                <div className={cn(
                  "mt-1 text-[9px] font-black uppercase tracking-tight",
                  t.status === "available" && "text-emerald-600",
                  t.status === "occupied" && "text-primary",
                  t.status === "reserved" && "text-amber-600"
                )}>
                  {t.status}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
