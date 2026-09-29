import { useState, useMemo } from "react";
import { 
  BarChart3, Database, Filter, RefreshCw, Maximize2, Minimize2, 
  ExternalLink, Layers, PieChart as PieIcon, TrendingUp, Clock, Flame, 
  CheckCircle2, QrCode, Banknote, ShieldCheck, ChevronRight, Copy, Check,
  Search, SlidersHorizontal, Calendar, Award, Sparkles, Layers3, Code2, Play, Info
} from "lucide-react";
import { 
  Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { toast } from "sonner";
import { usePos } from "@/lib/pos-store";
import { inr } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";

const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

// Base historical sales data for filtering demo
const RAW_DAILY_TREND = [
  { date: "23 Sep", sales: 18400, orders: 38, upi: 11000, cash: 7400, dineIn: 12000, takeaway: 6400 },
  { date: "24 Sep", sales: 21200, orders: 42, upi: 14000, cash: 7200, dineIn: 15000, takeaway: 6200 },
  { date: "25 Sep", sales: 19800, orders: 39, upi: 12500, cash: 7300, dineIn: 13000, takeaway: 6800 },
  { date: "26 Sep", sales: 24500, orders: 48, upi: 16000, cash: 8500, dineIn: 17500, takeaway: 7000 },
  { date: "27 Sep", sales: 28900, orders: 54, upi: 19500, cash: 9400, dineIn: 20000, takeaway: 8900 },
  { date: "28 Sep", sales: 31200, orders: 58, upi: 21000, cash: 10200, dineIn: 22000, takeaway: 9200 },
  { date: "29 Sep (Today)", sales: 34800, orders: 62, upi: 22400, cash: 12400, dineIn: 24000, takeaway: 10800 },
];

const RAW_HOURLY_DATA = [
  { hour: "11 AM", sales: 2400, orders: 5, dineIn: 1800, takeaway: 600, upi: 1600, cash: 800 },
  { hour: "12 PM", sales: 4800, orders: 9, dineIn: 3200, takeaway: 1600, upi: 3200, cash: 1600 },
  { hour: "1 PM", sales: 8900, orders: 16, dineIn: 6200, takeaway: 2700, upi: 5800, cash: 3100 },
  { hour: "2 PM", sales: 7200, orders: 14, dineIn: 5000, takeaway: 2200, upi: 4800, cash: 2400 },
  { hour: "3 PM", sales: 3100, orders: 6, dineIn: 2100, takeaway: 1000, upi: 2000, cash: 1100 },
  { hour: "4 PM", sales: 2100, orders: 4, dineIn: 1200, takeaway: 900, upi: 1400, cash: 700 },
  { hour: "5 PM", sales: 3500, orders: 7, dineIn: 2200, takeaway: 1300, upi: 2300, cash: 1200 },
  { hour: "6 PM", sales: 5400, orders: 11, dineIn: 3800, takeaway: 1600, upi: 3700, cash: 1700 },
  { hour: "7 PM", sales: 9800, orders: 18, dineIn: 6900, takeaway: 2900, upi: 6500, cash: 3300 },
  { hour: "8 PM", sales: 14800, orders: 28, dineIn: 10400, takeaway: 4400, upi: 9800, cash: 5000 },
  { hour: "9 PM", sales: 11200, orders: 21, dineIn: 7800, takeaway: 3400, upi: 7400, cash: 3800 },
  { hour: "10 PM", sales: 4600, orders: 9, dineIn: 3100, takeaway: 1500, upi: 3000, cash: 1600 },
];

export interface PowerBiDashboardProps {
  embeddedUrl?: string;
  showTabsHeader?: boolean;
}

export function PowerBiDashboardView({ embeddedUrl: initialEmbedUrl = "", showTabsHeader = true }: PowerBiDashboardProps) {
  const { orders, products } = usePos();
  
  // Power BI Controls State
  const [activePage, setActivePage] = useState<"overview" | "hourly" | "dishes" | "payments" | "live-embed" | "sql-dax">("overview");
  const [showFilters, setShowFilters] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Power BI Filter Slicers State
  const [dateSlicer, setDateSlicer] = useState<"today" | "7days" | "30days">("7days");
  const [orderTypeSlicer, setOrderTypeSlicer] = useState<"all" | "dine-in" | "takeaway">("all");
  const [paymentSlicer, setPaymentSlicer] = useState<"all" | "upi" | "cash">("all");
  const [searchFilter, setSearchFilter] = useState("");

  // Custom Power BI Embed URL State
  const [customEmbedUrl, setCustomEmbedUrl] = useState<string>(
    initialEmbedUrl || "https://app.powerbi.com/view?r=eyJrIjoiDemoRestaurantPowerBiReportKey"
  );
  const [inputUrl, setInputUrl] = useState<string>(customEmbedUrl);

  const copyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing Power BI DirectQuery dataset...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Power BI report dataset updated successfully!");
    }, 700);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Filtered Orders Calculation
  const paidOrders = useMemo(() => {
    return orders.filter((o) => {
      if (o.paymentStatus !== "paid") return false;
      if (orderTypeSlicer === "dine-in" && !o.tableId) return false;
      if (orderTypeSlicer === "takeaway" && o.tableId) return false;
      if (paymentSlicer === "upi" && o.paymentMethod !== "upi") return false;
      if (paymentSlicer === "cash" && o.paymentMethod !== "cash") return false;
      return true;
    });
  }, [orders, orderTypeSlicer, paymentSlicer]);

  // Aggregate Metrics based on Slicers
  const liveNetSales = paidOrders.reduce((s, o) => s + o.total, 0);
  const liveGrossSales = paidOrders.reduce((s, o) => s + o.subtotal, 0);
  const liveTax = paidOrders.reduce((s, o) => s + o.tax, 0);

  const baseTodaySales = 34800;
  const baseGrossSales = 33142;
  const baseTax = 1658;
  const baseOrdersCount = 62;

  // Apply slicer multipliers to demo data
  const slicerMultiplier = useMemo(() => {
    let mult = 1.0;
    if (orderTypeSlicer === "dine-in") mult *= 0.68;
    if (orderTypeSlicer === "takeaway") mult *= 0.32;
    if (paymentSlicer === "upi") mult *= 0.64;
    if (paymentSlicer === "cash") mult *= 0.36;
    return mult;
  }, [orderTypeSlicer, paymentSlicer]);

  const displayNetSales = liveNetSales > 0 ? liveNetSales : Math.round(baseTodaySales * slicerMultiplier);
  const displayGrossSales = liveGrossSales > 0 ? liveGrossSales : Math.round(baseGrossSales * slicerMultiplier);
  const displayTax = liveTax > 0 ? liveTax : Math.round(baseTax * slicerMultiplier);
  const displayOrderCount = paidOrders.length > 0 ? paidOrders.length : Math.round(baseOrdersCount * slicerMultiplier);
  const displayAov = displayOrderCount > 0 ? Math.round(displayNetSales / displayOrderCount) : 561;

  // UPI vs Cash Split
  const liveUpi = paidOrders.filter(o => o.paymentMethod === "upi").reduce((s, o) => s + o.total, 0);
  const liveCash = paidOrders.filter(o => o.paymentMethod === "cash").reduce((s, o) => s + o.total, 0);
  const displayUpi = liveUpi > 0 ? liveUpi : Math.round(22400 * (paymentSlicer === "cash" ? 0 : 1));
  const displayCash = liveCash > 0 ? liveCash : Math.round(12400 * (paymentSlicer === "upi" ? 0 : 1));

  // Filtered Daily Trend Chart
  const filteredDailyTrend = useMemo(() => {
    return RAW_DAILY_TREND.map(d => {
      let val = d.sales;
      if (orderTypeSlicer === "dine-in") val = d.dineIn;
      if (orderTypeSlicer === "takeaway") val = d.takeaway;
      if (paymentSlicer === "upi") val = d.upi;
      if (paymentSlicer === "cash") val = d.cash;
      return { ...d, sales: Math.round(val) };
    });
  }, [orderTypeSlicer, paymentSlicer]);

  // Filtered Hourly Data & Peak Hour
  const filteredHourlyData = useMemo(() => {
    return RAW_HOURLY_DATA.map(d => {
      let val = d.sales;
      if (orderTypeSlicer === "dine-in") val = d.dineIn;
      if (orderTypeSlicer === "takeaway") val = d.takeaway;
      if (paymentSlicer === "upi") val = d.upi;
      if (paymentSlicer === "cash") val = d.cash;
      return { ...d, sales: Math.round(val) };
    });
  }, [orderTypeSlicer, paymentSlicer]);

  const maxHourlyVal = Math.max(...filteredHourlyData.map(d => d.sales));
  const hourlyDataWithPeaks = filteredHourlyData.map(d => ({
    ...d,
    isPeak: d.sales === maxHourlyVal && d.sales > 0,
  }));
  const peakHour = hourlyDataWithPeaks.find(d => d.isPeak) || hourlyDataWithPeaks[9];

  // Top Dishes calculation
  const topDishes = useMemo(() => {
    return [...products]
      .filter(p => !searchFilter || p.name.toLowerCase().includes(searchFilter.toLowerCase()))
      .map(p => ({
        ...p,
        unitsSold: p.soldToday ?? 12,
        revenue: Math.round((p.soldToday ?? 12) * p.price * slicerMultiplier)
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [products, slicerMultiplier, searchFilter]);

  const pieData = [
    { name: "UPI QR Payments", value: displayUpi },
    { name: "Physical Cash", value: displayCash },
  ].filter(d => d.value > 0);

  return (
    <div className={`space-y-4 font-sans ${isFullscreen ? "fixed inset-0 z-50 overflow-y-auto bg-background p-6" : ""}`}>
      {/* 1. POWER BI EMBEDDED YELLOW TOOLBAR HEADER */}
      <div className="rounded-2xl border bg-[#252423] text-white shadow-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-white/10 bg-gradient-to-r from-[#252423] via-[#2f2e2d] to-[#1f1e1d]">
          {/* Brand & Report Title */}
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[#F2C811] text-black font-black text-xl shadow-md">
              <BarChart3 className="size-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base md:text-lg tracking-tight text-white">
                  Power BI Analytics Hub
                </h2>
                <span className="rounded-md bg-[#F2C811] px-2 py-0.5 text-[10px] font-black uppercase text-black">
                  restaurantbi.pbix
                </span>
                {isSupabaseConfigured && (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="size-3" /> Supabase DirectQuery Live
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Live PostgreSQL Data Model • Executive KPI Cards, Peak Rush & Dish Analysis
              </p>
            </div>
          </div>

          {/* Power BI Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                showFilters 
                  ? "bg-[#F2C811] text-black border-[#F2C811]" 
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              Slicers {showFilters ? "ON" : "OFF"}
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 text-[#F2C811] ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </button>

            <button
              onClick={() => setActivePage("live-embed")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#F2C811]/40 bg-[#F2C811]/10 px-3 py-1.5 text-xs font-bold text-[#F2C811] hover:bg-[#F2C811]/20 transition-all"
            >
              <ExternalLink className="size-3.5" />
              Embed URL Settings
            </button>

            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
              <span className="hidden md:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
            </button>
          </div>
        </div>

        {/* 2. POWER BI SLICERS & FILTERS BAR (Collapsible) */}
        {showFilters && (
          <div className="bg-[#1f1e1d] p-3.5 border-b border-white/10 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-extrabold uppercase text-[11px] text-[#F2C811] flex items-center gap-1">
                <Filter className="size-3.5" /> Report Slicers:
              </span>

              {/* Date Slicer */}
              <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10">
                <Calendar className="size-3 text-slate-400 ml-1" />
                {(["today", "7days", "30days"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDateSlicer(d)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                      dateSlicer === d ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {d === "today" ? "Today" : d === "7days" ? "7 Days" : "30 Days"}
                  </button>
                ))}
              </div>

              {/* Order Type Slicer */}
              <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold px-1">Type:</span>
                {(["all", "dine-in", "takeaway"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setOrderTypeSlicer(t)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                      orderTypeSlicer === t ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {t === "all" ? "All Orders" : t === "dine-in" ? "Dine-In" : "Takeaway"}
                  </button>
                ))}
              </div>

              {/* Payment Method Slicer */}
              <div className="flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold px-1">Pay:</span>
                {(["all", "upi", "cash"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPaymentSlicer(p)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                      paymentSlicer === p ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {p === "all" ? "All Modes" : p === "upi" ? "UPI QR" : "Cash"}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Slicer Reset */}
            {(orderTypeSlicer !== "all" || paymentSlicer !== "all" || dateSlicer !== "7days") && (
              <button
                onClick={() => {
                  setDateSlicer("7days");
                  setOrderTypeSlicer("all");
                  setPaymentSlicer("all");
                  toast.success("All Power BI slicers reset.");
                }}
                className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* 3. POWER BI PAGE TABS NAVIGATION (BOTTOM / TOP BAR) */}
        {showTabsHeader && (
          <div className="flex bg-[#181716] overflow-x-auto border-t border-white/10 text-xs">
            {[
              { id: "overview", label: "📊 Page 1: Sales & Revenue Overview" },
              { id: "hourly", label: "⏰ Page 2: Hourly Traffic & Peak Rush" },
              { id: "dishes", label: "🍲 Page 3: Category & Dish Matrix" },
              { id: "payments", label: "💳 Page 4: Payment Split & Tax Ledger" },
              { id: "live-embed", label: "🌐 Page 5: Live Web Iframe Embed" },
              { id: "sql-dax", label: "🛠️ Page 6: SQL Schema & DAX Setup" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id as any)}
                className={`px-4 py-2.5 font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
                  activePage === tab.id
                    ? "bg-[#252423] text-[#F2C811] border-[#F2C811] shadow-inner"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. POWER BI REPORT CANVAS CONTENT */}
      
      {/* PAGE 1: EXECUTIVE OVERVIEW */}
      {activePage === "overview" && (
        <div className="space-y-6">
          {/* Top Power BI KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* KPI 1: Net Daily Collection */}
            <div className="card-surface p-5 border-l-4 border-l-[#F2C811] relative overflow-hidden bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Power BI Net Revenue</span>
                <div className="grid size-9 place-items-center rounded-xl bg-[#F2C811]/15 text-yellow-600 font-bold">
                  ₹
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-foreground">{inr(displayNetSales)}</div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <TrendingUp className="size-3.5" /> +14.2% Growth
                </span>
                <span className="text-muted-foreground text-[11px] font-semibold">{displayOrderCount} Orders</span>
              </div>
            </div>

            {/* KPI 2: Gross Food Sales */}
            <div className="card-surface p-5 border-l-4 border-l-blue-500 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Gross Sales (Excl GST)</span>
                <div className="grid size-9 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
                  <BarChart3 className="size-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-foreground">{inr(displayGrossSales)}</div>
              <div className="mt-2 text-xs text-muted-foreground font-medium">
                Before 5% CGST/SGST tax
              </div>
            </div>

            {/* KPI 3: GST Tax Collected */}
            <div className="card-surface p-5 border-l-4 border-l-amber-500 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">GST Tax (5%)</span>
                <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                  <ShieldCheck className="size-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-amber-600">{inr(displayTax)}</div>
              <div className="mt-2 text-xs text-muted-foreground font-medium">
                CGST 2.5% + SGST 2.5%
              </div>
            </div>

            {/* KPI 4: Average Bill Value */}
            <div className="card-surface p-5 border-l-4 border-l-purple-500 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Avg Order Value (AOV)</span>
                <div className="grid size-9 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
                  <Award className="size-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-foreground">{inr(displayAov)}</div>
              <div className="mt-2 text-xs text-purple-600 font-bold">
                Per table ticket size
              </div>
            </div>
          </div>

          {/* Power BI Line Chart + Donut Payment Chart */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sales Trend Line Chart */}
            <div className="card-surface p-5 lg:col-span-2 border-t-2 border-t-[#F2C811]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <TrendingUp className="size-4 text-[#F2C811]" /> Power BI Daily Revenue Trend
                  </h3>
                  <p className="text-xs text-muted-foreground">Historical revenue curve dynamically filtered by slicers</p>
                </div>
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
                  Slicer: {dateSlicer.toUpperCase()}
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredDailyTrend}>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip formatter={(v: number) => inr(v)} cursor={{ stroke: "#F2C811", strokeDasharray: "3 3" }} />
                    <Line type="monotone" dataKey="sales" stroke="#F2C811" strokeWidth={3.5} dot={{ r: 5, fill: "#F2C811" }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Method Donut Visual */}
            <div className="card-surface p-5 border-t-2 border-t-emerald-500 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-base flex items-center gap-2 mb-1">
                  <PieIcon className="size-4 text-emerald-500" /> Payment Mode Split
                </h3>
                <p className="text-xs text-muted-foreground mb-3">UPI QR Code vs Cash Register Share</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <QrCode className="size-4 text-emerald-600" />
                      <span className="text-xs font-bold text-foreground">UPI QR</span>
                    </div>
                    <span className="text-xs font-black text-emerald-600 font-mono">{inr(displayUpi)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-blue-500/10 p-3 border border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <Banknote className="size-4 text-blue-600" />
                      <span className="text-xs font-bold text-foreground">Cash</span>
                    </div>
                    <span className="text-xs font-black text-blue-600 font-mono">{inr(displayCash)}</span>
                  </div>
                </div>
              </div>

              <div className="h-36 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => inr(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2: HOURLY TRAFFIC & PEAK RUSH */}
      {activePage === "hourly" && (
        <div className="space-y-6">
          <div className="card-surface p-6 border-t-2 border-t-amber-500">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Clock className="size-5 text-amber-500" /> Power BI Hourly Sales & Rush Traffic
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Identify peak kitchen order hours to optimize shift staffing & table turnover.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-600">
                <Flame className="size-4" /> Peak Rush Hour: {peakHour.hour} ({inr(peakHour.sales)})
              </span>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyDataWithPeaks}>
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v: number) => inr(v)} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
                    {hourlyDataWithPeaks.map((entry, index) => (
                      <Cell 
                        key={`hour-${index}`} 
                        fill={entry.isPeak ? "#f97316" : "#F2C811"} 
                        opacity={entry.isPeak ? 1 : 0.75} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="text-xs font-extrabold text-muted-foreground uppercase">Lunch Rush Window</div>
                <div className="text-lg font-black text-foreground mt-1">1:00 PM – 3:00 PM</div>
                <div className="text-xs text-muted-foreground mt-0.5">32% of daily collections</div>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="text-xs font-extrabold text-amber-600 uppercase">Dinner Peak Rush Window</div>
                <div className="text-lg font-black text-foreground mt-1">7:30 PM – 9:30 PM</div>
                <div className="text-xs text-amber-600 font-bold mt-0.5">Highest order volume surge</div>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="text-xs font-extrabold text-muted-foreground uppercase">Off-Peak Window</div>
                <div className="text-lg font-black text-foreground mt-1">3:30 PM – 5:30 PM</div>
                <div className="text-xs text-muted-foreground mt-0.5">Ideal for prep & restock</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 3: CATEGORY & TOP DISHES */}
      {activePage === "dishes" && (
        <div className="space-y-6">
          <div className="card-surface p-6 border-t-2 border-t-primary">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Flame className="size-5 text-amber-500" /> Top Selling Menu Dishes Matrix
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Ranked by unit volume & total revenue contribution inside Power BI.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter dishes..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-xl border bg-background pl-9 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="border-b bg-muted/50 text-muted-foreground font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Dish Name</th>
                    <th className="p-3 text-center">Units Sold</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topDishes.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <span className={`inline-grid size-6 place-items-center rounded-lg text-xs font-black ${
                          idx === 0 ? "bg-amber-500/20 text-amber-600" :
                          idx === 1 ? "bg-slate-500/20 text-slate-600" :
                          idx === 2 ? "bg-orange-500/20 text-orange-600" : "bg-muted text-muted-foreground"
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <span className="text-base">{p.emoji}</span>
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-bold text-foreground">{p.unitsSold} units</td>
                      <td className="p-3 text-right text-muted-foreground font-mono">{inr(p.price)}</td>
                      <td className="p-3 text-right font-black text-primary font-mono">{inr(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4: PAYMENT SPLIT & TAX LEDGER */}
      {activePage === "payments" && (
        <div className="space-y-6">
          <div className="card-surface p-6 border-t-2 border-t-emerald-500">
            <h3 className="font-extrabold text-lg flex items-center gap-2 mb-1">
              <ShieldCheck className="size-5 text-emerald-500" /> GST Tax & Payment Ledger Breakdown
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed audit table of today&apos;s paid bills with tax breakdown for compliance reporting.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="rounded-xl border bg-emerald-500/10 p-4 border-emerald-500/20">
                <div className="text-xs font-extrabold text-emerald-700 uppercase">UPI / GPay Total</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">{inr(displayUpi)}</div>
              </div>
              <div className="rounded-xl border bg-blue-500/10 p-4 border-blue-500/20">
                <div className="text-xs font-extrabold text-blue-700 uppercase">Physical Cash Total</div>
                <div className="text-2xl font-black text-blue-600 mt-1">{inr(displayCash)}</div>
              </div>
              <div className="rounded-xl border bg-amber-500/10 p-4 border-amber-500/20">
                <div className="text-xs font-extrabold text-amber-700 uppercase">Total GST Output Tax</div>
                <div className="text-2xl font-black text-amber-600 mt-1">{inr(displayTax)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 5: LIVE WEB IFRAME EMBED */}
      {activePage === "live-embed" && (
        <div className="card-surface p-6 border-t-2 border-t-[#F2C811] space-y-6">
          <div>
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <ExternalLink className="size-5 text-[#F2C811]" /> Power BI Web Iframe & Custom URL Embed
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Paste your published Power BI Web report iframe or report link below to render your live report directly.
            </p>
          </div>

          <div className="rounded-2xl border bg-muted/30 p-4 space-y-3">
            <label className="text-xs font-extrabold uppercase text-muted-foreground block">
              Power BI Embed URL or Publish-to-Web Link:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://app.powerbi.com/view?r=eyJrIjoi..."
                className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => {
                  setCustomEmbedUrl(inputUrl);
                  toast.success("Power BI report iframe URL updated!");
                }}
                className="rounded-xl bg-[#F2C811] px-5 py-2.5 text-xs font-extrabold text-black hover:opacity-90 transition-opacity"
              >
                Apply Embed URL
              </button>
            </div>
          </div>

          {/* Iframe Render Preview Container */}
          <div className="rounded-2xl border bg-black/90 p-4 text-center min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">
            {customEmbedUrl && customEmbedUrl.includes("app.powerbi.com") ? (
              <iframe
                title="Power BI Report Embed"
                src={customEmbedUrl}
                className="w-full h-[500px] rounded-xl border-0"
                allowFullScreen
              />
            ) : (
              <div className="max-w-md space-y-3">
                <div className="grid size-16 place-items-center rounded-2xl bg-[#F2C811]/10 text-[#F2C811] mx-auto">
                  <BarChart3 className="size-8" />
                </div>
                <h4 className="font-extrabold text-base text-white">Power BI Report Viewer Container</h4>
                <p className="text-xs text-slate-400">
                  Publish your <code className="text-[#F2C811] font-bold">restaurantbi.pbix</code> file in Power BI Desktop to your Power BI Service workspace, click <strong>File &gt; Embed report &gt; Publish to web</strong>, and paste the URL here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAGE 6: SQL SCHEMA & DAX SETUP */}
      {activePage === "sql-dax" && (
        <div className="card-surface p-6 border-t-2 border-t-purple-500 space-y-6">
          <div>
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Code2 className="size-5 text-purple-500" /> PostgreSQL Views & Copy-Paste DAX Measures
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              These pre-built views inside Supabase process billing data into ready-to-visualize tables in Power BI.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: "Today Net Earnings", code: "Today Earnings = CALCULATE(SUM(v_powerbi_daily_earnings[total_net_earnings]), v_powerbi_daily_earnings[order_date] = TODAY())" },
              { title: "Average Daily Revenue", code: "Avg Daily Sales = AVERAGE(v_powerbi_daily_earnings[total_net_earnings])" },
              { title: "Total Tax Collected", code: "Total GST Collected = SUM(v_powerbi_daily_earnings[total_tax_collected])" },
              { title: "UPI Payment Share %", code: "UPI Share % = DIVIDE(CALCULATE(SUM(v_powerbi_payment_summary[total_collected]), v_powerbi_payment_summary[payment_method] = \"upi\"), SUM(v_powerbi_payment_summary[total_collected]), 0)" }
            ].map((dax, i) => (
              <div key={i} className="rounded-xl border bg-muted/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-primary uppercase tracking-wider">{dax.title}</div>
                  <code className="text-xs font-mono font-bold text-foreground mt-1 block">{dax.code}</code>
                </div>
                <button
                  onClick={() => copyText(dax.code, `dax-${i}`)}
                  className="self-start sm:self-center flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  {copiedField === `dax-${i}` ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  {copiedField === `dax-${i}` ? "Copied" : "Copy DAX"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
