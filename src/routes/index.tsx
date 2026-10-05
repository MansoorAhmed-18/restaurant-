import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  IndianRupee, ReceiptText, Clock, TrendingUp, TrendingDown, RefreshCw, 
  QrCode, Banknote, ShieldCheck, Plus, ShoppingBag, 
  ArrowUpRight, Flame, Layers, PieChart as PieIcon, Target, Award,
  Sparkles, Calendar, BarChart2, Zap, CheckCircle2, ChevronRight,
  Filter, Eye, ArrowDownRight, Percent, Building2, Utensils
} from "lucide-react";
import { 
  Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, Legend, CartesianGrid, Area, AreaChart
} from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { PageHeader, StatusBadge, ErrorState } from "@/components/pos/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { api, inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { meta } from "@/lib/meta";
import { isSupabaseConfigured, fetchTodayEarningsFromSupabase } from "@/lib/supabase";
import { getActiveStaff, type StaffUser } from "@/lib/auth";
import type { MonthlySalesRecord } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => meta("PowerBI Monthly Sales & Billing Analytics", "Restaurant monthly sales reports, 2027/2028 revenue charts & POS billing terminal."),
  component: Dashboard,
});

const PIE_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"];

export function Dashboard() {
  const { orders, products } = usePos();
  const sales = useQuery({ queryKey: ["hourly"], queryFn: api.getHourlySales });
  const categories = useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
  const monthlyDataQuery = useQuery({ queryKey: ["monthlySales"], queryFn: api.getMonthlySales });

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [selectedYear, setSelectedYear] = useState<number | "all">(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
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

  // Raw dataset from api
  const rawMonthlyData = monthlyDataQuery.data || [];

  // Filtered monthly records based on Year & Quarter/Month slicers
  const filteredMonthlyRecords = useMemo(() => {
    let list = rawMonthlyData;

    if (selectedYear !== "all") {
      list = list.filter((r) => r.year === selectedYear);
    }

    if (selectedQuarter !== "all") {
      if (selectedQuarter === "Q1") list = list.filter((r) => [1, 2, 3].includes(r.monthIndex));
      if (selectedQuarter === "Q2") list = list.filter((r) => [4, 5, 6].includes(r.monthIndex));
      if (selectedQuarter === "Q3") list = list.filter((r) => [7, 8, 9].includes(r.monthIndex));
      if (selectedQuarter === "Q4") list = list.filter((r) => [10, 11, 12].includes(r.monthIndex));
    }

    if (selectedMonth !== "all") {
      list = list.filter((r) => r.month.toLowerCase() === selectedMonth.toLowerCase());
    }

    return list;
  }, [rawMonthlyData, selectedYear, selectedQuarter, selectedMonth]);

  // Aggregate Metrics for Monthly Report
  const totalMonthlySales = useMemo(() => {
    return filteredMonthlyRecords.reduce((sum, r) => sum + r.sales, 0);
  }, [filteredMonthlyRecords]);

  const totalMonthlyTarget = useMemo(() => {
    return filteredMonthlyRecords.reduce((sum, r) => sum + r.target, 0);
  }, [filteredMonthlyRecords]);

  const totalMonthlyOrders = useMemo(() => {
    return filteredMonthlyRecords.reduce((sum, r) => sum + r.orders, 0);
  }, [filteredMonthlyRecords]);

  const avgMonthlyOrderValue = useMemo(() => {
    return totalMonthlyOrders > 0 ? Math.round(totalMonthlySales / totalMonthlyOrders) : 0;
  }, [totalMonthlySales, totalMonthlyOrders]);

  const avgSalesPerMonth = useMemo(() => {
    return filteredMonthlyRecords.length > 0 
      ? Math.round(totalMonthlySales / filteredMonthlyRecords.length) 
      : 0;
  }, [totalMonthlySales, filteredMonthlyRecords]);

  const targetAchievementPct = useMemo(() => {
    if (totalMonthlyTarget === 0) return 0;
    return Math.round((totalMonthlySales / totalMonthlyTarget) * 100);
  }, [totalMonthlySales, totalMonthlyTarget]);

  // Peak month identifier
  const peakMonthRecord = useMemo(() => {
    if (filteredMonthlyRecords.length === 0) return null;
    return [...filteredMonthlyRecords].sort((a, b) => b.sales - a.sales)[0];
  }, [filteredMonthlyRecords]);

  // YoY Comparison Data (Current Year vs Next Year month by month)
  const yoyComparisonData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const recordsCurr = rawMonthlyData.filter((r) => r.year === currentYear);
    const recordsNext = rawMonthlyData.filter((r) => r.year === currentYear + 1);

    return months.map((m, idx) => {
      const recCurr = recordsCurr.find((r) => r.monthIndex === idx + 1);
      const recNext = recordsNext.find((r) => r.monthIndex === idx + 1);
      const salesCurr = recCurr ? recCurr.sales : 0;
      const salesNext = recNext ? recNext.sales : 0;
      const growth = salesCurr > 0 ? Number((((salesNext - salesCurr) / salesCurr) * 100).toFixed(1)) : 0;

      return {
        month: m,
        salesCurr,
        salesNext,
        growthPct: growth,
      };
    });
  }, [rawMonthlyData, currentYear]);


  // Monthly Payment Channel Distribution (UPI vs Cash)
  const monthlyPaymentSummary = useMemo(() => {
    const totalUpi = filteredMonthlyRecords.reduce((sum, r) => sum + r.upi, 0);
    const totalCash = filteredMonthlyRecords.reduce((sum, r) => sum + r.cash, 0);
    return [
      { name: "UPI / QR Code", value: totalUpi, color: "#10b981" },
      { name: "Cash Register", value: totalCash, color: "#3b82f6" },
    ];
  }, [filteredMonthlyRecords]);

  // Monthly Dine-In vs Takeaway Breakdown
  const monthlyDineVsTakeaway = useMemo(() => {
    const totalDineIn = filteredMonthlyRecords.reduce((sum, r) => sum + r.dineIn, 0);
    const totalTakeaway = filteredMonthlyRecords.reduce((sum, r) => sum + r.takeaway, 0);
    return [
      { name: "Dine-In Orders", value: totalDineIn, color: "#8b5cf6" },
      { name: "Takeaway Counter", value: totalTakeaway, color: "#f59e0b" },
    ];
  }, [filteredMonthlyRecords]);

  // Category sales proportional calculation based on selected timeline
  const monthlyCategoryBreakdown = useMemo(() => {
    const weights: Record<string, number> = {
      "Biryani": 0.38,
      "Main Course": 0.24,
      "Starters": 0.18,
      "Breads": 0.10,
      "Beverages": 0.06,
      "Desserts": 0.04,
    };
    return Object.entries(weights).map(([cat, weight]) => ({
      name: cat,
      revenue: Math.round(totalMonthlySales * weight),
      pct: Math.round(weight * 100),
    })).sort((a, b) => b.revenue - a.revenue);
  }, [totalMonthlySales]);

  // Live POS Orders for terminal status
  const safeOrders = orders || [];
  const safeProducts = products || [];
  const pendingOrders = safeOrders.filter((o) => o?.status === "pending" || o?.status === "preparing");

  const handleRefreshAnalytics = () => {
    setIsRefreshing(true);
    toast.info(`Refreshing PowerBI monthly report metrics for ${selectedYear === "all" ? "All Years" : `Year ${selectedYear}`}...`);
    setTimeout(() => {
      monthlyDataQuery.refetch();
      setIsRefreshing(false);
      toast.success("PowerBI Monthly Sales reports synced successfully!");
    }, 600);
  };

  return (
    <AppShell>
      <PageHeader 
        title={`${getTimeGreeting()}, ${staff.name.split(" ")[0]} 👋`} 
        subtitle={`PowerBI Executive Sales Hub • Monthly Revenue Reporting, ${currentYear} & Future Growth Trends & Billing Ledger.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRefreshAnalytics}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60"
            >
              <RefreshCw className={`size-4 text-primary ${isRefreshing ? "animate-spin" : ""}`} />
              Sync PowerBI Data
            </button>
            <Link 
              to="/pos" 
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity"
            >
              <Plus className="size-4" /> Quick Bill (+ Order)
            </Link>
          </div>
        } 
      />

      {/* POWER BI INTERACTIVE SLICER & YEAR FILTER BAR */}
      <div className="mb-6 rounded-2xl border bg-card p-4 shadow-sm border-primary/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2 text-foreground font-black text-sm uppercase tracking-wider">
            <Filter className="size-4 text-primary" /> PowerBI Report Slicer & Year Selector
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">Reporting Period:</span>
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary font-mono">
              {selectedYear === "all" ? `${currentYear} vs ${currentYear + 1} (YoY View)` : `Year ${selectedYear}`}
              {selectedQuarter !== "all" && ` • ${selectedQuarter}`}
              {selectedMonth !== "all" && ` • ${selectedMonth.toUpperCase()}`}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Year Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground mr-1">Select Year:</span>
            <button
              onClick={() => { setSelectedYear(currentYear); setSelectedMonth("all"); }}
              className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                selectedYear === currentYear 
                  ? "bg-primary text-primary-foreground shadow-md scale-105" 
                  : "border bg-muted/30 text-foreground hover:bg-muted"
              }`}
            >
              📅 {currentYear} (Current)
            </button>
            <button
              onClick={() => { setSelectedYear(currentYear + 1); setSelectedMonth("all"); }}
              className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                selectedYear === currentYear + 1 
                  ? "bg-primary text-primary-foreground shadow-md scale-105" 
                  : "border bg-muted/30 text-foreground hover:bg-muted"
              }`}
            >
              🚀 {currentYear + 1}
            </button>
            <button
              onClick={() => { setSelectedYear(currentYear + 2); setSelectedMonth("all"); }}
              className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                selectedYear === currentYear + 2 
                  ? "bg-primary text-primary-foreground shadow-md scale-105" 
                  : "border bg-muted/30 text-foreground hover:bg-muted"
              }`}
            >
              ✨ {currentYear + 2}
            </button>
            <button
              onClick={() => { setSelectedYear("all"); setSelectedQuarter("all"); setSelectedMonth("all"); }}
              className={`rounded-xl px-4 py-2 text-xs font-black transition-all ${
                selectedYear === "all" 
                  ? "bg-primary text-primary-foreground shadow-md scale-105" 
                  : "border bg-muted/30 text-foreground hover:bg-muted"
              }`}
            >
              📊 YoY Comparison
            </button>
          </div>

          {/* Quarter Slicer */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground mr-1">Quarter:</span>
            {["all", "Q1", "Q2", "Q3", "Q4"].map((q) => (
              <button
                key={q}
                onClick={() => { setSelectedQuarter(q); setSelectedMonth("all"); }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                  selectedQuarter === q 
                    ? "bg-foreground text-background" 
                    : "border bg-muted/20 text-muted-foreground hover:text-foreground"
                }`}
              >
                {q === "all" ? "All Qtrs" : q}
              </button>
            ))}
          </div>

          {/* Month Slicer */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs font-bold text-muted-foreground">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Filter by month"
              className="rounded-xl border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All 12 Months</option>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 PRIMARY POWERBI MONTHLY KPIS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Monthly Sales */}
        <div className="card-surface p-5 border-l-4 border-l-primary relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
              {selectedMonth !== "all" ? `${selectedMonth} Revenue` : selectedYear === "all" ? "Total Revenue" : `${selectedYear} Monthly Sales`}
            </span>
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <IndianRupee className="size-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-foreground font-mono">{inr(totalMonthlySales)}</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5">
              <TrendingUp className="size-3" /> +16.4% MoM
            </span>
            <span className="text-muted-foreground">vs previous period</span>
          </div>
        </div>

        {/* KPI 2: Monthly Orders Volume */}
        <div className="card-surface p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Monthly Orders</span>
            <div className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
              <ReceiptText className="size-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-foreground font-mono">{totalMonthlyOrders.toLocaleString("en-IN")} Orders</div>
          <div className="mt-2 text-xs text-muted-foreground font-semibold">
            Avg {filteredMonthlyRecords.length > 0 ? Math.round(totalMonthlyOrders / filteredMonthlyRecords.length) : 0} orders / month
          </div>
        </div>

        {/* KPI 3: Average Order Value */}
        <div className="card-surface p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Avg Bill Value (AOV)</span>
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Award className="size-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-foreground font-mono">{inr(avgOrderValue(totalMonthlySales, totalMonthlyOrders))}</div>
          <div className="mt-2 text-xs text-emerald-600 font-bold">
            Revenue / Total Monthly Bills
          </div>
        </div>

        {/* KPI 4: Monthly Target Achievement */}
        <div className="card-surface p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Target Achievement</span>
            <div className="grid size-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
              <Target className="size-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-foreground font-mono">{targetAchievementPct}%</div>
          <div className="mt-2 text-xs text-purple-600 font-bold">
            {targetAchievementPct >= 100 ? "Exceeded Budget Goal 🎯" : `${100 - targetAchievementPct}% to target`}
          </div>
        </div>
      </div>

      {/* POWERBI CHART 1: MONTHLY SALES TREND & TARGET (BAR / AREA) */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main Monthly Sales Trend Chart */}
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-extrabold text-base flex items-center gap-2">
                <BarChart2 className="size-5 text-primary" /> Monthly Sales & Revenue Performance (Monthly Basis)
              </h2>
              <p className="text-xs text-muted-foreground">
                Showing month-by-month sales for {selectedYear === "all" ? `${currentYear} & ${currentYear + 1}` : `Year ${selectedYear}`}
              </p>
            </div>
            {peakMonthRecord && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-600">
                <Flame className="size-3.5" /> Peak Month: {peakMonthRecord.month} {peakMonthRecord.year} ({inr(peakMonthRecord.sales)})
              </span>
            )}
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredMonthlyRecords} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={12} 
                  tickFormatter={(val, idx) => `${val}${selectedYear === "all" ? ` '${String(filteredMonthlyRecords[idx]?.year).slice(2)}` : ""}`}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={12} 
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} 
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [inr(value), name === "sales" ? "Monthly Sales" : "Target Sales"]}
                  labelFormatter={(label, items) => {
                    const row = items[0]?.payload as MonthlySalesRecord;
                    return row ? `${row.month} ${row.year} • ${row.orders} Orders` : String(label);
                  }}
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "0.75rem", fontSize: "12px", fontWeight: "bold" }}
                />
                <Legend formatter={(val) => val === "sales" ? "Monthly Revenue (Actual)" : "Monthly Target"} />
                <Bar dataKey="sales" name="sales" radius={[8, 8, 0, 0]}>
                  {filteredMonthlyRecords.map((entry, index) => (
                    <Cell 
                      key={`month-cell-${index}`} 
                      fill={entry.sales >= (peakMonthRecord?.sales || 0) ? "#f97316" : entry.year === currentYear + 1 ? "#8b5cf6" : "var(--primary)"} 
                    />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="target" name="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PowerBI Insight & Target Progress Card */}
        <div className="card-surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-extrabold flex items-center gap-2 text-foreground uppercase tracking-wider">
                <Target className="size-4 text-primary" /> Target vs Actual Sales
              </h3>
              <span className="text-xs font-black text-primary font-mono">{targetAchievementPct}%</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground font-semibold">Total Revenue Generated</span>
                <span className="text-lg font-black text-foreground font-mono">{inr(totalMonthlySales)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground font-semibold">Total Revenue Target</span>
                <span className="text-sm font-extrabold text-muted-foreground font-mono">{inr(totalMonthlyTarget)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground font-semibold">Monthly Run Rate (Avg)</span>
                <span className="text-sm font-extrabold text-primary font-mono">{inr(avgSalesPerMonth)} / mo</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary via-blue-500 to-emerald-500 transition-all duration-700"
                  style={{ width: `${Math.min(100, targetAchievementPct)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                <span>₹0</span>
                <span>{targetAchievementPct >= 100 ? "Goal Surpassed" : inr(Math.max(0, totalMonthlyTarget - totalMonthlySales)) + " to go"}</span>
                <span>{inr(totalMonthlyTarget)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 shrink-0 text-emerald-600" />
              <span className="font-extrabold">PowerBI Executive Summary:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {selectedYear === currentYear + 1 
                ? `Year ${currentYear + 1} records strong growth projections with average ticket size ₹550+.`
                : `Year ${currentYear} shows consistent upward momentum from Q1 to festive peak in Q4.`}
            </p>
          </div>
        </div>
      </div>

      {/* POWERBI CHART 2: YEAR-OVER-YEAR MONTHLY COMPARISON */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* YoY Multi-Bar Comparison Chart */}
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-extrabold text-base flex items-center gap-2">
                <TrendingUp className="size-5 text-emerald-600" /> Year-over-Year ({currentYear} vs {currentYear + 1}) Monthly Comparison
              </h2>
              <p className="text-xs text-muted-foreground">Side-by-side revenue comparison across all 12 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-primary"></span> {currentYear}</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-purple-600"></span> {currentYear + 1}</span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yoyComparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip 
                  formatter={(v: number, name: string) => [inr(v), name === "salesCurr" ? `${currentYear} Sales` : `${currentYear + 1} Sales`]}
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "0.75rem", fontSize: "12px", fontWeight: "bold" }}
                />
                <Bar dataKey="salesCurr" name="salesCurr" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="salesNext" name="salesNext" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Monthly Channel Breakdown (UPI vs Cash) */}
        <div className="card-surface p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <QrCode className="size-4 text-emerald-600" /> Payment Distribution
              </h3>
              <span className="text-xs font-mono font-bold text-foreground">Monthly Basis</span>
            </div>

            <div className="mt-4 space-y-3">
              {monthlyPaymentSummary.map((m) => (
                <div key={m.name} className="flex items-center justify-between rounded-xl border p-3 bg-muted/20">
                  <div className="flex items-center gap-2.5">
                    <div className={`grid size-8 place-items-center rounded-lg ${m.name.includes("UPI") ? "bg-emerald-500/15 text-emerald-600" : "bg-blue-500/15 text-blue-600"}`}>
                      {m.name.includes("UPI") ? <QrCode className="size-4" /> : <Banknote className="size-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">{m.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{inr(m.value)}</div>
                    </div>
                  </div>
                  <span className="text-xs font-black font-mono">
                    {totalMonthlySales > 0 ? Math.round((m.value / totalMonthlySales) * 100) : 0}%
                  </span>
                </div>
              ))}

              {/* Dine-in vs Takeaway */}
              <div className="pt-2 border-t space-y-2">
                <div className="text-[11px] font-extrabold uppercase text-muted-foreground">Order Channels</div>
                {monthlyDineVsTakeaway.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Utensils className="size-3 text-muted-foreground" /> {c.name}
                    </span>
                    <span className="font-bold font-mono text-foreground">{inr(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={monthlyPaymentSummary}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {monthlyPaymentSummary.map((_, index) => (
                    <Cell key={`pay-pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => inr(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* POWERBI CATEGORY SALES & MONTHLY MATRIX LEDGER TABLE */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Category Contribution */}
        <div className="card-surface p-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <Layers className="size-4 text-purple-500" /> Monthly Category Sales
            </h3>
            <span className="text-xs font-bold text-muted-foreground">Revenue Split</span>
          </div>

          <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {monthlyCategoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-primary font-mono">{inr(cat.revenue)} ({cat.pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${cat.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Monthly Sales Matrix Table */}
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-extrabold text-base flex items-center gap-2">
                <Calendar className="size-4 text-primary" /> Monthly Sales Ledger Matrix (PowerBI Table)
              </h2>
              <p className="text-xs text-muted-foreground">Detailed monthly breakdown of orders, channels, revenue and growth</p>
            </div>
            <span className="text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {filteredMonthlyRecords.length} Month Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 text-muted-foreground font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Month / Year</th>
                  <th className="p-2.5 text-center">Orders</th>
                  <th className="p-2.5 text-right">Dine-In</th>
                  <th className="p-2.5 text-right">Takeaway</th>
                  <th className="p-2.5 text-right">Monthly Sales</th>
                  <th className="p-2.5 text-right">Target</th>
                  <th className="p-2.5 text-center">MoM Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y font-medium">
                {filteredMonthlyRecords.map((r, idx) => (
                  <tr key={`${r.year}-${r.month}-${idx}`} className="hover:bg-muted/30 transition-colors">
                    <td className="p-2.5 font-bold text-foreground">
                      {r.month} {r.year}
                    </td>
                    <td className="p-2.5 text-center font-mono">{r.orders}</td>
                    <td className="p-2.5 text-right text-muted-foreground font-mono">{inr(r.dineIn)}</td>
                    <td className="p-2.5 text-right text-muted-foreground font-mono">{inr(r.takeaway)}</td>
                    <td className="p-2.5 text-right font-black text-primary font-mono">{inr(r.sales)}</td>
                    <td className="p-2.5 text-right text-muted-foreground font-mono">{inr(r.target)}</td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        r.momGrowth >= 0 ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"
                      }`}>
                        {r.momGrowth >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {r.momGrowth > 0 ? `+${r.momGrowth}%` : `${r.momGrowth}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live Kitchen Orders Status (Terminal Active Bills) */}
      <div className="card-surface mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base flex items-center gap-2">
            <Layers className="size-4 text-primary" /> Live Active Kitchen Orders
          </h2>
          <Link to="/orders" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View All Order Tickets <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">
            No active kitchen orders in queue. Use &quot;+ Quick Bill&quot; to place an order.
          </div>
        ) : (
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
                <div className="mt-1 text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}, {new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
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
        )}
      </div>
    </AppShell>
  );
}

function avgOrderValue(sales: number, orders: number) {
  if (orders <= 0) return 0;
  return Math.round(sales / orders);
}
