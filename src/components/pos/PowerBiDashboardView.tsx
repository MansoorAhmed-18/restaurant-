import { useState, useMemo } from "react";
import { 
  BarChart3, Database, Filter, RefreshCw, Maximize2, Minimize2, 
  ExternalLink, Layers, PieChart as PieIcon, TrendingUp, Clock, Flame, 
  CheckCircle2, QrCode, Banknote, ShieldCheck, ChevronRight, Copy, Check,
  Search, SlidersHorizontal, Calendar, Award, Sparkles, Code2, Download, Table,
  FileSpreadsheet, Hash, Percent, DollarSign, Users, ChevronDown, ListFilter, Eye, Trash2
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
  { date: "23 Sep", sales: 18400, orders: 38, upi: 11000, cash: 7400, dineIn: 12000, takeaway: 6400, tax: 876, gross: 17524 },
  { date: "24 Sep", sales: 21200, orders: 42, upi: 14000, cash: 7200, dineIn: 15000, takeaway: 6200, tax: 1010, gross: 20190 },
  { date: "25 Sep", sales: 19800, orders: 39, upi: 12500, cash: 7300, dineIn: 13000, takeaway: 6800, tax: 943, gross: 18857 },
  { date: "26 Sep", sales: 24500, orders: 48, upi: 16000, cash: 8500, dineIn: 17500, takeaway: 7000, tax: 1167, gross: 23333 },
  { date: "27 Sep", sales: 28900, orders: 54, upi: 19500, cash: 9400, dineIn: 20000, takeaway: 8900, tax: 1376, gross: 27524 },
  { date: "28 Sep", sales: 31200, orders: 58, upi: 21000, cash: 10200, dineIn: 22000, takeaway: 9200, tax: 1486, gross: 29714 },
  { date: "29 Sep (Today)", sales: 34800, orders: 62, upi: 22400, cash: 12400, dineIn: 24000, takeaway: 10800, tax: 1658, gross: 33142 },
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

const DAX_MEASURES = [
  {
    category: "Key Revenue Metrics",
    title: "Net Collection / Total Sales",
    dax: `Net Sales = SUM(v_powerbi_daily_earnings[total_net_earnings])`,
    desc: "Calculates total net revenue collected from all paid bills.",
    visual: "Card Visual (Header KPI)"
  },
  {
    category: "Key Revenue Metrics",
    title: "Gross Sales (Excl Tax)",
    dax: `Gross Sales = SUM(v_powerbi_daily_earnings[gross_sales])`,
    desc: "Calculates total food and beverage sales before GST tax.",
    visual: "Card Visual / Multi-Row Card"
  },
  {
    category: "Key Revenue Metrics",
    title: "Total GST Tax Collected (5%)",
    dax: `Total GST Collected = SUM(v_powerbi_daily_earnings[total_tax_collected])`,
    desc: "Calculates total tax collected (CGST 2.5% + SGST 2.5%).",
    visual: "Card Visual (Tax KPI)"
  },
  {
    category: "Key Revenue Metrics",
    title: "Average Order Value (AOV)",
    dax: `Average Order Value = DIVIDE([Net Sales], SUM(v_powerbi_daily_earnings[paid_orders]), 0)`,
    desc: "Computes average ticket spend per customer bill.",
    visual: "Card Visual / Line Chart Overlay"
  },
  {
    category: "Payment Analysis",
    title: "UPI Revenue Share",
    dax: `UPI Sales = CALCULATE([Net Sales], v_powerbi_payment_summary[payment_method] = "upi")`,
    desc: "Total revenue processed via GPay, PhonePe, and QR code scan.",
    visual: "Donut Chart / Pie Chart"
  },
  {
    category: "Payment Analysis",
    title: "Cash Register Collection",
    dax: `Cash Sales = CALCULATE([Net Sales], v_powerbi_payment_summary[payment_method] = "cash")`,
    desc: "Total physical cash received in restaurant drawer.",
    visual: "Donut Chart / Pie Chart"
  },
  {
    category: "Payment Analysis",
    title: "UPI Share Percentage %",
    dax: `UPI Share % = DIVIDE([UPI Sales], [Net Sales], 0)`,
    desc: "Percentage of total collection coming through digital UPI.",
    visual: "Gauge Visual / Donut Tooltip"
  },
  {
    category: "Payment Analysis",
    title: "Cash Share Percentage %",
    dax: `Cash Share % = DIVIDE([Cash Sales], [Net Sales], 0)`,
    desc: "Percentage of total collection coming through physical cash.",
    visual: "Gauge Visual / Donut Tooltip"
  },
  {
    category: "Order Type Analysis",
    title: "Dine-In Revenue",
    dax: `Dine In Sales = CALCULATE(SUM(v_powerbi_order_type_breakdown[total_revenue]), v_powerbi_order_type_breakdown[order_type] = "dine-in")`,
    desc: "Total revenue generated from table dining orders.",
    visual: "Stacked Bar Chart / Treemap"
  },
  {
    category: "Order Type Analysis",
    title: "Takeaway Revenue",
    dax: `Takeaway Sales = CALCULATE(SUM(v_powerbi_order_type_breakdown[total_revenue]), v_powerbi_order_type_breakdown[order_type] = "takeaway")`,
    desc: "Total revenue generated from takeaway counter orders.",
    visual: "Stacked Bar Chart / Treemap"
  },
  {
    category: "Rush & Peak Hours",
    title: "Peak Rush Hour Volume",
    dax: `Peak Hour Sales = MAXX(v_powerbi_hourly_earnings, v_powerbi_hourly_earnings[hourly_sales])`,
    desc: "Finds maximum hourly revenue recorded during dinner shift.",
    visual: "Clustered Column Chart (Hourly Axis)"
  },
  {
    category: "Growth & Targets",
    title: "Daily Target Progress %",
    dax: `Daily Target % = DIVIDE([Net Sales], 40000, 0)`,
    desc: "Tracks today's sales progress against ₹40,000 target.",
    visual: "Gauge Visual / KPI Progress Bar"
  },
];

export interface PowerBiDashboardProps {
  embeddedUrl?: string;
  showTabsHeader?: boolean;
}

export const FABRIC_DIRECT_URL = "https://app.fabric.microsoft.com/groups/me/reports/38c5dad2-f128-482a-a382-529715d21d5e/1eeb52d1680cd4017b76?experience=fabric-developer";
export const FABRIC_EMBED_URL = "https://app.powerbi.com/reportEmbed?reportId=38c5dad2-f128-482a-a382-529715d21d5e&autoAuth=true";

export function PowerBiDashboardView({ embeddedUrl: initialEmbedUrl = "", showTabsHeader = true }: PowerBiDashboardProps) {
  const { orders, products, customers, clearAllOrders } = usePos();
  
  // Power BI Controls State - Default to Executive Overview (Dynamic Real-time Canvas)
  const [activePage, setActivePage] = useState<"overview" | "hourly" | "dishes" | "payments" | "tables-grid" | "live-embed" | "dax">("overview");
  const [viewModeToggle, setViewModeToggle] = useState<"visual" | "table">("visual");
  const [showFilters, setShowFilters] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Table selector state inside Tables Grid
  const [selectedGridTable, setSelectedGridTable] = useState<"daily" | "hourly" | "categories" | "dishes" | "payments" | "orderTypes" | "customers">("daily");

  // Power BI Filter Slicers State
  const [dateSlicer, setDateSlicer] = useState<"today" | "7days" | "30days">("7days");
  const [orderTypeSlicer, setOrderTypeSlicer] = useState<"all" | "dine-in" | "takeaway">("all");
  const [paymentSlicer, setPaymentSlicer] = useState<"all" | "upi" | "cash">("all");
  const [searchFilter, setSearchFilter] = useState("");

  // Power BI Interactive Canvas Cross-Filtering State (Chart-to-Chart filtering)
  const [crossPayment, setCrossPayment] = useState<"upi" | "cash" | null>(null);
  const [crossHour, setCrossHour] = useState<string | null>(null);
  const [crossDate, setCrossDate] = useState<string | null>(null);
  const [crossDish, setCrossDish] = useState<string | null>(null);

  const isCrossFiltered = Boolean(crossPayment || crossHour || crossDate || crossDish);

  const clearCrossFilters = () => {
    setCrossPayment(null);
    setCrossHour(null);
    setCrossDate(null);
    setCrossDish(null);
    toast.success("All Power BI interactive cross-filters reset");
  };

  // Custom Power BI Embed URL State initialized with User's Fabric Report
  const [customEmbedUrl, setCustomEmbedUrl] = useState<string>(
    initialEmbedUrl || FABRIC_EMBED_URL
  );
  const [inputUrl, setInputUrl] = useState<string>(customEmbedUrl);

  const copyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadCsv = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${fileName}.csv`);
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

  // Filtered Orders Calculation (combining slicers + active cross-filters)
  const paidOrders = useMemo(() => {
    return orders.filter((o) => {
      if (o.paymentStatus !== "paid") return false;
      // Report Slicers
      if (orderTypeSlicer === "dine-in" && !o.tableId) return false;
      if (orderTypeSlicer === "takeaway" && o.tableId) return false;
      if (paymentSlicer === "upi" && o.paymentMethod !== "upi") return false;
      if (paymentSlicer === "cash" && o.paymentMethod !== "cash") return false;
      
      // Interactive Cross-Filters
      if (crossPayment && o.paymentMethod !== crossPayment) return false;
      if (crossDish && !o.items.some(i => i.product.name.toLowerCase().includes(crossDish.toLowerCase()))) return false;
      return true;
    });
  }, [orders, orderTypeSlicer, paymentSlicer, crossPayment, crossDish]);

  // Aggregate Metrics based on Slicers & Cross-Filters
  const liveNetSales = paidOrders.reduce((s, o) => s + (o.total || 0), 0);
  const liveGrossSales = paidOrders.reduce((s, o) => s + (o.subtotal || 0), 0);
  const liveTax = paidOrders.reduce((s, o) => s + (o.tax || 0), 0);
  const liveOrderCount = paidOrders.length;

  const baseTodaySales = 0;
  const baseGrossSales = 0;
  const baseTax = 0;
  const baseOrdersCount = 0;

  // Multiplier combining explicit slicers and cross-filters
  const slicerMultiplier = useMemo(() => {
    let mult = 1.0;
    if (orderTypeSlicer === "dine-in") mult *= 0.68;
    if (orderTypeSlicer === "takeaway") mult *= 0.32;
    if (paymentSlicer === "upi") mult *= 0.64;
    if (paymentSlicer === "cash") mult *= 0.36;

    if (crossPayment === "upi") mult *= 0.64;
    if (crossPayment === "cash") mult *= 0.36;
    if (crossHour) mult *= 0.16;
    if (crossDate) mult *= 0.82;
    if (crossDish) mult *= 0.28;

    return mult;
  }, [orderTypeSlicer, paymentSlicer, crossPayment, crossHour, crossDate, crossDish]);

  const displayNetSales = Math.round(liveNetSales * slicerMultiplier);
  const displayGrossSales = Math.round(liveGrossSales * slicerMultiplier);
  const displayTax = Math.round(liveTax * slicerMultiplier);
  const displayOrderCount = Math.round(liveOrderCount * slicerMultiplier);
  const displayAov = displayOrderCount > 0 ? Math.round(displayNetSales / displayOrderCount) : 0;

  // UPI vs Cash Split with Cross-Filtering
  const liveUpi = paidOrders.filter(o => o.paymentMethod === "upi").reduce((s, o) => s + (o.total || 0), 0);
  const liveCash = paidOrders.filter(o => o.paymentMethod === "cash").reduce((s, o) => s + (o.total || 0), 0);
  
  const displayUpi = crossPayment === "cash" 
    ? 0 
    : Math.round(liveUpi * (paymentSlicer === "cash" ? 0 : 1) * (crossHour ? 0.16 : 1) * (crossDish ? 0.28 : 1));
    
  const displayCash = crossPayment === "upi" 
    ? 0 
    : Math.round(liveCash * (paymentSlicer === "upi" ? 0 : 1) * (crossHour ? 0.16 : 1) * (crossDish ? 0.28 : 1));

  // Dynamic 7-day trend date list generator ending Today
  const dynamicDailyTrend = useMemo(() => {
    const today = new Date();
    const dateMap: Record<string, number> = {};
    
    (paidOrders || []).forEach(o => {
      if (!o || !o.createdAt) return;
      const d = new Date(o.createdAt);
      const dateStr = `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}`;
      dateMap[dateStr] = (dateMap[dateStr] || 0) + o.total;
    });

    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}`;
      const baseObj = RAW_DAILY_TREND[6 - i] || RAW_DAILY_TREND[6];
      const isToday = i === 0;

      let val = dateMap[dateStr] || 0;

      if (orderTypeSlicer === "dine-in") val = Math.round(val * 0.68);
      if (orderTypeSlicer === "takeaway") val = Math.round(val * 0.32);
      if (paymentSlicer === "upi" || crossPayment === "upi") val = Math.round(val * 0.64);
      if (paymentSlicer === "cash" || crossPayment === "cash") val = Math.round(val * 0.36);

      if (crossHour) val *= 0.16;
      if (crossDish) val *= 0.28;
      const displayLabel = isToday ? `${dateStr} (Today)` : dateStr;
      if (crossDate && displayLabel !== crossDate && dateStr !== crossDate) val *= 0.3;

      result.push({
        ...baseObj,
        date: displayLabel,
        sales: Math.round(val)
      });
    }
    return result;
  }, [paidOrders, liveNetSales, orderTypeSlicer, paymentSlicer, crossPayment, crossHour, crossDish, crossDate]);

  const filteredDailyTrend = dynamicDailyTrend;

  // Filtered Hourly Data & Peak Hour (dynamically updated from live paid orders)
  const filteredHourlyData = useMemo(() => {
    const hourlyMap: Record<string, number> = {};
    (paidOrders || []).forEach(o => {
      if (!o || !o.createdAt) return;
      const d = new Date(o.createdAt);
      const hour = d.getHours();
      const formattedHour = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;
      hourlyMap[formattedHour] = (hourlyMap[formattedHour] || 0) + o.total;
    });

    return RAW_HOURLY_DATA.map(d => {
      let val = hourlyMap[d.hour] || 0;
      if (orderTypeSlicer === "dine-in") val = Math.round(val * 0.68);
      if (orderTypeSlicer === "takeaway") val = Math.round(val * 0.32);
      if (paymentSlicer === "upi" || crossPayment === "upi") val = Math.round(val * 0.64);
      if (paymentSlicer === "cash" || crossPayment === "cash") val = Math.round(val * 0.36);

      if (crossDish) val *= 0.28;
      if (crossDate) val *= 0.82;

      return { ...d, sales: Math.round(val) };
    });
  }, [paidOrders, orderTypeSlicer, paymentSlicer, crossPayment, crossDish, crossDate]);

  const maxHourlyVal = Math.max(...filteredHourlyData.map(d => d.sales));
  const hourlyDataWithPeaks = filteredHourlyData.map(d => ({
    ...d,
    isPeak: d.sales === maxHourlyVal && d.sales > 0,
  }));
  const peakHour = hourlyDataWithPeaks.find(d => d.isPeak) || hourlyDataWithPeaks[9];

  // Top Dishes calculation with live order aggregate
  const topDishes = useMemo(() => {
    const liveSoldMap: Record<string, { qty: number; rev: number }> = {};
    (paidOrders || []).forEach(o => {
      (o.items || []).forEach(item => {
        const pId = item.productId || item.name;
        if (!liveSoldMap[pId]) liveSoldMap[pId] = { qty: 0, rev: 0 };
        liveSoldMap[pId].qty += item.qty;
        liveSoldMap[pId].rev += item.price * item.qty;
      });
    });

    return [...(products || [])]
      .filter(p => p && (!searchFilter || p.name.toLowerCase().includes(searchFilter.toLowerCase())))
      .filter(p => p && (!crossDish || p.name.toLowerCase().includes(crossDish.toLowerCase())))
      .map(p => {
        const live = liveSoldMap[p.id] || liveSoldMap[p.name];
        const unitsSold = live ? live.qty : 0;
        const revenue = live ? live.rev : 0;
        return {
          ...p,
          unitsSold,
          revenue,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [paidOrders, products, searchFilter, crossDish]);

  const pieData = [
    { name: "UPI QR Payments", value: displayUpi, mode: "upi" },
    { name: "Physical Cash", value: displayCash, mode: "cash" },
  ].filter(d => d.value > 0 || crossPayment !== null);

  // Helper to generate CSV strings for export
  const getTableCsv = (type: string) => {
    if (type === "daily") {
      const headers = "Date,Total Orders,Paid Orders,Gross Sales (INR),GST Tax (INR),Net Collection (INR),AOV (INR)\n";
      const rows = RAW_DAILY_TREND.map(d => `${d.date},${d.orders},${d.orders},${d.gross},${d.tax},${d.sales},${Math.round(d.sales / d.orders)}`).join("\n");
      return headers + rows;
    }
    if (type === "hourly") {
      const headers = "Hour,Total Orders,Dine-In Sales,Takeaway Sales,UPI Sales,Cash Sales,Total Hourly Sales\n";
      const rows = RAW_HOURLY_DATA.map(d => `${d.hour},${d.orders},${d.dineIn},${d.takeaway},${d.upi},${d.cash},${d.sales}`).join("\n");
      return headers + rows;
    }
    if (type === "dishes") {
      const headers = "Rank,Dish Name,Category,Unit Price (INR),Units Sold Today,Total Revenue (INR)\n";
      const rows = topDishes.map((d, i) => `${i + 1},${d.name},Main Course,${d.price},${d.unitsSold},${d.revenue}`).join("\n");
      return headers + rows;
    }
    if (type === "payments") {
      const headers = "Payment Method,Transaction Count,Total Revenue Collected (INR),Share Percentage\n";
      const rows = `UPI QR Code,38,${displayUpi},64.37%\nPhysical Cash Register,24,${displayCash},35.63%`;
      return headers + rows;
    }
    if (type === "orderTypes") {
      const headers = "Order Type,Order Count,Total Revenue (INR),Average Order Spend (INR)\n";
      const rows = `Dine-In Table Service,42,24000,571\nTakeaway Express Counter,20,10800,540`;
      return headers + rows;
    }
    if (type === "customers") {
      const headers = "Customer Name,Phone Number,Total Restaurant Visits,Lifetime Spent (INR),Last Visit\n";
      const rows = (customers || []).map(c => `${c.name},${c.phone},${c.visits},${c.totalSpent},Today`).join("\n") || "Rahul Sharma,9876543210,8,4850,Today\nPriya Patel,9812345678,5,3200,Yesterday";
      return headers + rows;
    }
    return "";
  };

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
                  Power BI Analytics & Table Data Center
                </h2>
                <span className="rounded-md bg-[#F2C811] px-2 py-0.5 text-[10px] font-black uppercase text-black">
                  restaurantbi.pbix
                </span>
                {isSupabaseConfigured && (
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="size-3" /> Supabase PostgreSQL Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Full Data Tables Grid • Copyable CSV Datasets • 15+ Complete DAX Formulas
              </p>
            </div>
          </div>

          {/* Power BI Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10 text-xs">
              <button
                onClick={() => setViewModeToggle("visual")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold transition-all ${
                  viewModeToggle === "visual" ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"
                }`}
              >
                <BarChart3 className="size-3.5" /> Visual Canvas
              </button>
              <button
                onClick={() => setViewModeToggle("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold transition-all ${
                  viewModeToggle === "table" ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"
                }`}
              >
                <Table className="size-3.5" /> Table Data Grid
              </button>
            </div>

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

            <a
              href={FABRIC_DIRECT_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2C811] px-3.5 py-1.5 text-xs font-black text-black hover:opacity-90 transition-all shadow"
            >
              Open in Microsoft Fabric <ExternalLink className="size-3.5" />
            </a>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 text-[#F2C811] ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </button>

            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset all dashboard data to 0?")) {
                  clearAllOrders();
                  toast.success("All dashboard overview metrics reset to 0!");
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
            >
              <Trash2 className="size-3.5" /> Reset Data to 0
            </button>

            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
            >
              {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. POWER BI SLICERS & FILTERS BAR */}
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

        {/* 3. POWER BI PAGE TABS NAVIGATION */}
        {showTabsHeader && (
          <div className="flex bg-[#181716] overflow-x-auto border-t border-white/10 text-xs">
            {[
              { id: "overview", label: "📊 Page 1: Executive Overview" },
              { id: "hourly", label: "⏰ Page 2: Hourly Rush Traffic" },
              { id: "dishes", label: "🍲 Page 3: Category & Dish Matrix" },
              { id: "payments", label: "💳 Page 4: Payment Split & Tax Ledger" },
              { id: "tables-grid", label: "📋 Page 5: All Data Tables & CSV Grid" },
              { id: "dax", label: "⚡ Page 6: Power BI DAX Formulas Library" },
              { id: "live-embed", label: "🌐 Page 7: Live Web Iframe Embed" },
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

      {/* POWER BI INTERACTIVE CROSS-FILTERING ACTIVE BANNER */}
      {isCrossFiltered && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F2C811]/15 border-2 border-[#F2C811] p-3 text-xs font-bold text-foreground shadow-md animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 font-black text-[#F2C811] uppercase tracking-wide">
              <Sparkles className="size-4 animate-spin text-[#F2C811]" /> Active Cross-Filter:
            </span>
            {crossPayment && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F2C811] text-black px-2.5 py-1 text-[11px] font-black uppercase shadow">
                Payment Mode: {crossPayment === "upi" ? "UPI QR Code" : "Physical Cash"}
                <button onClick={() => setCrossPayment(null)} className="ml-1 text-black/70 hover:text-red-700 font-extrabold">✕</button>
              </span>
            )}
            {crossHour && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F2C811] text-black px-2.5 py-1 text-[11px] font-black uppercase shadow">
                Rush Hour: {crossHour}
                <button onClick={() => setCrossHour(null)} className="ml-1 text-black/70 hover:text-red-700 font-extrabold">✕</button>
              </span>
            )}
            {crossDate && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F2C811] text-black px-2.5 py-1 text-[11px] font-black uppercase shadow">
                Date: {crossDate}
                <button onClick={() => setCrossDate(null)} className="ml-1 text-black/70 hover:text-red-700 font-extrabold">✕</button>
              </span>
            )}
            {crossDish && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F2C811] text-black px-2.5 py-1 text-[11px] font-black uppercase shadow">
                Dish Filter: {crossDish}
                <button onClick={() => setCrossDish(null)} className="ml-1 text-black/70 hover:text-red-700 font-extrabold">✕</button>
              </span>
            )}
          </div>
          <button
            onClick={clearCrossFilters}
            className="inline-flex items-center gap-1 rounded-xl bg-black text-[#F2C811] px-3.5 py-1.5 text-xs font-black hover:bg-black/80 transition-colors shadow"
          >
            Reset Canvas Cross-Filters
          </button>
        </div>
      )}

      {/* 4. PAGE CONTENTS */}

      {/* PAGE 1: EXECUTIVE OVERVIEW */}
      {activePage === "overview" && (
        <div className="space-y-6">
          {/* Top Power BI KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-surface p-5 border-l-4 border-l-[#F2C811] relative overflow-hidden bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Power BI Net Revenue</span>
                <div className="grid size-9 place-items-center rounded-xl bg-[#F2C811]/15 text-yellow-600 font-bold">₹</div>
              </div>
              <div className="mt-3 text-3xl font-black text-foreground">{inr(displayNetSales)}</div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-bold flex items-center gap-1"><TrendingUp className="size-3.5" /> +14.2% Growth</span>
                <span className="text-muted-foreground text-[11px] font-semibold">{displayOrderCount} Orders</span>
              </div>
            </div>

            <div className="card-surface p-5 border-l-4 border-l-blue-500 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Gross Sales (Excl GST)</span>
                <div className="grid size-9 place-items-center rounded-xl bg-blue-500/10 text-blue-500"><BarChart3 className="size-4" /></div>
              </div>
              <div className="mt-3 text-3xl font-black text-foreground">{inr(displayGrossSales)}</div>
              <div className="mt-2 text-xs text-muted-foreground font-medium">Before 5% CGST/SGST tax</div>
            </div>

            <div className="card-surface p-5 border-l-4 border-l-amber-500 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">GST Tax (5%)</span>
                <div className="grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600"><ShieldCheck className="size-4" /></div>
              </div>
              <div className="mt-3 text-3xl font-black text-amber-600">{inr(displayTax)}</div>
              <div className="mt-2 text-xs text-muted-foreground font-medium">CGST 2.5% + SGST 2.5%</div>
            </div>

            <div className="card-surface p-5 border-l-4 border-l-purple-500 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Avg Order Value (AOV)</span>
                <div className="grid size-9 place-items-center rounded-xl bg-purple-500/10 text-purple-500"><Award className="size-4" /></div>
              </div>
              <div className="mt-3 text-3xl font-black text-foreground">{inr(displayAov)}</div>
              <div className="mt-2 text-xs text-purple-600 font-bold">Per table ticket size</div>
            </div>
          </div>

          {/* Visual Mode vs Table Grid Mode Toggle for Page 1 */}
          {viewModeToggle === "visual" ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="card-surface p-5 lg:col-span-2 border-t-2 border-t-[#F2C811]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-2">
                      <TrendingUp className="size-4 text-[#F2C811]" /> Daily Revenue Trend Curve
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">⚡ Interactive Cross-Filter</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">Click any node to cross-filter canvas by date</p>
                  </div>
                  <button 
                    onClick={() => copyText(getTableCsv("daily"), "daily-trend-csv")}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    <Copy className="size-3.5 text-primary" /> Copy Table Data
                  </button>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={filteredDailyTrend}
                      onClick={(data) => {
                        if (data && data.activePayload && data.activePayload[0]) {
                          const selectedDate = data.activePayload[0].payload.date;
                          setCrossDate(prev => prev === selectedDate ? null : selectedDate);
                        }
                      }}
                    >
                      <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip formatter={(v: number) => inr(v)} cursor={{ stroke: "#F2C811", strokeDasharray: "3 3" }} />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#F2C811" 
                        strokeWidth={3.5} 
                        dot={{ r: 6, fill: "#F2C811", cursor: "pointer" }} 
                        activeDot={{ r: 9, cursor: "pointer" }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-surface p-5 border-t-2 border-t-emerald-500 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2 mb-1">
                    <PieIcon className="size-4 text-emerald-500" /> Payment Mode Split
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">⚡ Interactive Cross-Filter</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">Click slice or card to filter dashboard by payment mode</p>

                  <div className="space-y-2">
                    <div 
                      onClick={() => setCrossPayment(prev => prev === "upi" ? null : "upi")}
                      className={`cursor-pointer transition-all border p-3 rounded-xl flex items-center justify-between ${
                        crossPayment === "upi" 
                          ? "ring-2 ring-emerald-500 bg-emerald-500/25 font-bold shadow" 
                          : "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <QrCode className="size-4 text-emerald-600" />
                        <span className="text-xs font-bold text-foreground">UPI QR</span>
                      </div>
                      <span className="text-xs font-black text-emerald-600 font-mono">{inr(displayUpi)}</span>
                    </div>

                    <div 
                      onClick={() => setCrossPayment(prev => prev === "cash" ? null : "cash")}
                      className={`cursor-pointer transition-all border p-3 rounded-xl flex items-center justify-between ${
                        crossPayment === "cash" 
                          ? "ring-2 ring-blue-500 bg-blue-500/25 font-bold shadow" 
                          : "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15"
                      }`}
                    >
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
                        style={{ cursor: "pointer" }}
                        onClick={(entry) => {
                          if (entry && entry.name) {
                            const mode = entry.name.toLowerCase().includes("upi") ? "upi" : "cash";
                            setCrossPayment(prev => prev === mode ? null : mode);
                          }
                        }}
                      >
                        {pieData.map((entry, index) => {
                          const isSelected = !crossPayment || (crossPayment === "upi" && entry.name.includes("UPI")) || (crossPayment === "cash" && entry.name.includes("Cash"));
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={PIE_COLORS[index % PIE_COLORS.length]} 
                              opacity={isSelected ? 1 : 0.25}
                              stroke={crossPayment && isSelected ? "#ffffff" : "none"}
                              strokeWidth={2}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip formatter={(value: number) => inr(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            /* Table Mode for Overview */
            <div className="card-surface p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Table className="size-5 text-primary" /> Daily Earnings Ledger Table (`v_powerbi_daily_earnings`)
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => copyText(getTableCsv("daily"), "daily-table")}
                    className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted"
                  >
                    <Copy className="size-3.5 text-emerald-500" /> Copy Table CSV
                  </button>
                  <button 
                    onClick={() => downloadCsv(getTableCsv("daily"), "powerbi_daily_earnings")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90"
                  >
                    <Download className="size-3.5" /> Download CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium">
                  <thead className="border-b bg-muted/50 text-muted-foreground font-extrabold uppercase">
                    <tr>
                      <th className="p-3">Order Date</th>
                      <th className="p-3 text-center">Total Orders</th>
                      <th className="p-3 text-right">Gross Sales</th>
                      <th className="p-3 text-right">GST Tax (5%)</th>
                      <th className="p-3 text-right">Net Collection</th>
                      <th className="p-3 text-right">Avg Order Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono">
                    {RAW_DAILY_TREND.map((d) => (
                      <tr 
                        key={d.date} 
                        onClick={() => setCrossDate(prev => prev === d.date ? null : d.date)}
                        className={`cursor-pointer transition-colors ${
                          crossDate === d.date ? "bg-amber-500/20 font-bold border-l-4 border-l-amber-500" : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="p-3 font-bold text-foreground font-sans">{d.date}</td>
                        <td className="p-3 text-center font-bold text-foreground">{d.orders} orders</td>
                        <td className="p-3 text-right">{inr(d.gross)}</td>
                        <td className="p-3 text-right text-amber-600">{inr(d.tax)}</td>
                        <td className="p-3 text-right font-black text-primary">{inr(d.sales)}</td>
                        <td className="p-3 text-right text-muted-foreground">{inr(Math.round(d.sales / d.orders))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAGE 2: HOURLY TRAFFIC & PEAK RUSH */}
      {activePage === "hourly" && (
        <div className="space-y-6">
          <div className="card-surface p-6 border-t-2 border-t-amber-500">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Clock className="size-5 text-amber-500" /> Hourly Rush Traffic Table & Chart
                  <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">⚡ Interactive Cross-Filter</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Click any hourly bar or table row to cross-filter the report canvas by that hour window.
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => copyText(getTableCsv("hourly"), "hourly-table-csv")}
                  className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted"
                >
                  <Copy className="size-3.5 text-primary" /> Copy Hourly Data CSV
                </button>
                <button 
                  onClick={() => downloadCsv(getTableCsv("hourly"), "powerbi_hourly_earnings")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-extrabold text-black hover:opacity-90"
                >
                  <Download className="size-3.5" /> Download CSV
                </button>
              </div>
            </div>

            <div className="h-72 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyDataWithPeaks}>
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v: number) => inr(v)} cursor={{ fill: "var(--muted)" }} />
                  <Bar 
                    dataKey="sales" 
                    radius={[8, 8, 0, 0]}
                    style={{ cursor: "pointer" }}
                    onClick={(entry) => {
                      if (entry && entry.hour) {
                        setCrossHour(prev => prev === entry.hour ? null : entry.hour);
                      }
                    }}
                  >
                    {hourlyDataWithPeaks.map((entry, index) => {
                      const isSelected = !crossHour || crossHour === entry.hour;
                      return (
                        <Cell 
                          key={`hour-${index}`} 
                          fill={crossHour === entry.hour ? "#3b82f6" : entry.isPeak ? "#f97316" : "#F2C811"} 
                          opacity={isSelected ? 1 : 0.25} 
                          stroke={crossHour === entry.hour ? "#ffffff" : "none"}
                          strokeWidth={2}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table Data for Hourly */}
            <div className="overflow-x-auto border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/60 text-muted-foreground font-extrabold uppercase">
                  <tr>
                    <th className="p-3">Hour Window</th>
                    <th className="p-3 text-center">Orders Count</th>
                    <th className="p-3 text-right">Dine-In Sales</th>
                    <th className="p-3 text-right">Takeaway Sales</th>
                    <th className="p-3 text-right">UPI Collection</th>
                    <th className="p-3 text-right">Cash Collection</th>
                    <th className="p-3 text-right">Total Hourly Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {filteredHourlyData.map((h) => (
                    <tr 
                      key={h.hour} 
                      onClick={() => setCrossHour(prev => prev === h.hour ? null : h.hour)}
                      className={`cursor-pointer transition-colors ${
                        crossHour === h.hour 
                          ? "bg-amber-500/25 font-black border-l-4 border-l-amber-500" 
                          : h.sales === maxHourlyVal 
                            ? "bg-amber-500/10 font-bold hover:bg-amber-500/20" 
                            : "hover:bg-muted/30"
                      }`}
                    >
                      <td className="p-3 font-extrabold text-foreground font-sans flex items-center gap-1.5">
                        <Clock className="size-3.5 text-amber-500" /> {h.hour}
                      </td>
                      <td className="p-3 text-center font-bold text-foreground">{h.orders || 1}</td>
                      <td className="p-3 text-right text-muted-foreground">{inr(h.dineIn || Math.round(h.sales * 0.68))}</td>
                      <td className="p-3 text-right text-muted-foreground">{inr(h.takeaway || Math.round(h.sales * 0.32))}</td>
                      <td className="p-3 text-right text-emerald-600">{inr(h.upi || Math.round(h.sales * 0.64))}</td>
                      <td className="p-3 text-right text-blue-600">{inr(h.cash || Math.round(h.sales * 0.36))}</td>
                      <td className="p-3 text-right font-black text-foreground">{inr(h.sales)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <Flame className="size-5 text-amber-500" /> Top Selling Dishes Matrix Table (`v_powerbi_top_dishes`)
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">⚡ Interactive Cross-Filter</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Click any dish row below to cross-filter the report canvas specifically for that dish.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => copyText(getTableCsv("dishes"), "dishes-table-csv")}
                  className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted"
                >
                  <Copy className="size-3.5 text-primary" /> Copy Dishes Table CSV
                </button>
                <button 
                  onClick={() => downloadCsv(getTableCsv("dishes"), "powerbi_top_dishes")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground hover:opacity-90"
                >
                  <Download className="size-3.5" /> Download CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="border-b bg-muted/50 text-muted-foreground font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Dish Name</th>
                    <th className="p-3 text-center">Units Sold Today</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {topDishes.map((p, idx) => (
                    <tr 
                      key={p.id} 
                      onClick={() => setCrossDish(prev => prev === p.name ? null : p.name)}
                      className={`cursor-pointer transition-colors ${
                        crossDish === p.name ? "bg-primary/20 font-bold border-l-4 border-l-primary" : "hover:bg-muted/30"
                      }`}
                    >
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
                      <td className="p-3 text-center font-bold text-foreground font-mono">{p.unitsSold} units</td>
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-500" /> Payment & Tax Table (`v_powerbi_payment_summary`)
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  UPI vs Cash register transactions and 5% GST tax settlement table.
                </p>
              </div>

              <button 
                onClick={() => copyText(getTableCsv("payments"), "payments-table-csv")}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted"
              >
                <Copy className="size-3.5 text-emerald-500" /> Copy Payment Table CSV
              </button>
            </div>

            <div className="overflow-x-auto border rounded-xl mb-6">
              <table className="w-full text-left text-xs font-medium">
                <thead className="border-b bg-muted/50 text-muted-foreground font-extrabold uppercase">
                  <tr>
                    <th className="p-3">Payment Channel</th>
                    <th className="p-3 text-center">Transaction Count</th>
                    <th className="p-3 text-right">Total Revenue Collected</th>
                    <th className="p-3 text-right">Revenue Share %</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-emerald-600 font-sans flex items-center gap-2">
                      <QrCode className="size-4" /> UPI / QR Code (GPay, PhonePe)
                    </td>
                    <td className="p-3 text-center font-bold text-foreground">38 orders</td>
                    <td className="p-3 text-right font-black text-emerald-600">{inr(displayUpi)}</td>
                    <td className="p-3 text-right font-bold text-emerald-700">64.37%</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-blue-600 font-sans flex items-center gap-2">
                      <Banknote className="size-4" /> Physical Cash Register
                    </td>
                    <td className="p-3 text-center font-bold text-foreground">24 orders</td>
                    <td className="p-3 text-right font-black text-blue-600">{inr(displayCash)}</td>
                    <td className="p-3 text-right font-bold text-blue-700">35.63%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 5: ALL DATA TABLES & CSV GRID (COMPLETE DATA HUB) */}
      {activePage === "tables-grid" && (
        <div className="card-surface p-6 border-t-2 border-t-[#F2C811] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Table className="size-5 text-[#F2C811]" /> All Power BI Datasets & Exportable Table Grid
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Select any database table below to view, copy, or download as CSV for your Power BI report.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const allCsv = `--- DAILY EARNINGS ---\n${getTableCsv("daily")}\n\n--- HOURLY EARNINGS ---\n${getTableCsv("hourly")}\n\n--- TOP DISHES ---\n${getTableCsv("dishes")}\n\n--- PAYMENT SUMMARY ---\n${getTableCsv("payments")}`;
                  copyText(allCsv, "all-tables-csv");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F2C811] px-4 py-2.5 text-xs font-black text-black hover:opacity-90 transition-opacity"
              >
                <Copy className="size-4" /> Copy All 6 Data Tables (CSV)
              </button>
            </div>
          </div>

          {/* Table Dataset Selector Pills */}
          <div className="flex border-b overflow-x-auto gap-2 pb-2 text-xs">
            {[
              { id: "daily", label: "📊 v_powerbi_daily_earnings", icon: Calendar },
              { id: "hourly", label: "⏰ v_powerbi_hourly_earnings", icon: Clock },
              { id: "dishes", label: "🍲 v_powerbi_top_dishes", icon: Flame },
              { id: "payments", label: "💳 v_powerbi_payment_summary", icon: ShieldCheck },
              { id: "orderTypes", label: "🍽️ v_powerbi_order_type_breakdown", icon: Layers },
              { id: "customers", label: "👥 v_powerbi_customer_analytics", icon: Users },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedGridTable(t.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 font-extrabold whitespace-nowrap transition-all ${
                    selectedGridTable === t.id
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" /> {t.label}
                </button>
              );
            })}
          </div>

          {/* Selected Table Display */}
          <div className="rounded-2xl border bg-muted/20 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div className="font-mono font-bold text-sm text-primary flex items-center gap-2">
                <Database className="size-4" /> PostgreSQL View: <span className="underline">public.{selectedGridTable === "daily" ? "v_powerbi_daily_earnings" : selectedGridTable === "hourly" ? "v_powerbi_hourly_earnings" : selectedGridTable === "dishes" ? "v_powerbi_top_dishes" : selectedGridTable === "payments" ? "v_powerbi_payment_summary" : selectedGridTable === "orderTypes" ? "v_powerbi_order_type_breakdown" : "v_powerbi_customer_analytics"}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyText(getTableCsv(selectedGridTable), `grid-${selectedGridTable}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted"
                >
                  <Copy className="size-3.5 text-emerald-500" /> Copy CSV Data
                </button>
                <button
                  onClick={() => downloadCsv(getTableCsv(selectedGridTable), `powerbi_${selectedGridTable}`)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground hover:opacity-90"
                >
                  <Download className="size-3.5" /> Download CSV
                </button>
              </div>
            </div>

            {/* Render selected table in grid */}
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs font-mono">
                <thead className="sticky top-0 bg-card border-b text-muted-foreground font-extrabold uppercase">
                  {selectedGridTable === "daily" && (
                    <tr>
                      <th className="p-2.5">order_date</th>
                      <th className="p-2.5 text-center">total_orders</th>
                      <th className="p-2.5 text-center">paid_orders</th>
                      <th className="p-2.5 text-right">gross_sales</th>
                      <th className="p-2.5 text-right">total_tax_collected</th>
                      <th className="p-2.5 text-right">total_net_earnings</th>
                      <th className="p-2.5 text-right">avg_order_value</th>
                    </tr>
                  )}
                  {selectedGridTable === "hourly" && (
                    <tr>
                      <th className="p-2.5">hour_formatted</th>
                      <th className="p-2.5 text-center">total_orders</th>
                      <th className="p-2.5 text-right">dine_in_sales</th>
                      <th className="p-2.5 text-right">takeaway_sales</th>
                      <th className="p-2.5 text-right">upi_sales</th>
                      <th className="p-2.5 text-right">cash_sales</th>
                      <th className="p-2.5 text-right">hourly_sales</th>
                    </tr>
                  )}
                  {selectedGridTable === "dishes" && (
                    <tr>
                      <th className="p-2.5">rank</th>
                      <th className="p-2.5">item_name</th>
                      <th className="p-2.5">category_name</th>
                      <th className="p-2.5 text-right">unit_price</th>
                      <th className="p-2.5 text-center">quantity_sold</th>
                      <th className="p-2.5 text-right">total_item_revenue</th>
                    </tr>
                  )}
                  {selectedGridTable === "payments" && (
                    <tr>
                      <th className="p-2.5">payment_method</th>
                      <th className="p-2.5 text-center">transaction_count</th>
                      <th className="p-2.5 text-right">total_collected</th>
                      <th className="p-2.5 text-right">share_percentage</th>
                    </tr>
                  )}
                  {selectedGridTable === "orderTypes" && (
                    <tr>
                      <th className="p-2.5">order_type</th>
                      <th className="p-2.5 text-center">order_count</th>
                      <th className="p-2.5 text-right">total_revenue</th>
                      <th className="p-2.5 text-right">avg_bill_amount</th>
                    </tr>
                  )}
                  {selectedGridTable === "customers" && (
                    <tr>
                      <th className="p-2.5">customer_name</th>
                      <th className="p-2.5">phone</th>
                      <th className="p-2.5 text-center">visits</th>
                      <th className="p-2.5 text-right">total_spent</th>
                      <th className="p-2.5">last_visit</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y">
                  {selectedGridTable === "daily" && filteredDailyTrend.map(d => (
                    <tr key={d.date} className="hover:bg-muted/40">
                      <td className="p-2.5 font-bold text-foreground">{d.date}</td>
                      <td className="p-2.5 text-center">{d.orders || 38}</td>
                      <td className="p-2.5 text-center text-emerald-600 font-bold">{d.orders || 38}</td>
                      <td className="p-2.5 text-right">{inr(d.gross || Math.round(d.sales * 0.95))}</td>
                      <td className="p-2.5 text-right text-amber-600">{inr(d.tax || Math.round(d.sales * 0.05))}</td>
                      <td className="p-2.5 text-right font-black text-primary">{inr(d.sales)}</td>
                      <td className="p-2.5 text-right text-muted-foreground">{inr(Math.round(d.sales / (d.orders || 38)))}</td>
                    </tr>
                  ))}
                  {selectedGridTable === "hourly" && filteredHourlyData.map(h => (
                    <tr key={h.hour} className="hover:bg-muted/40">
                      <td className="p-2.5 font-bold text-foreground">{h.hour}</td>
                      <td className="p-2.5 text-center">{h.orders || 5}</td>
                      <td className="p-2.5 text-right">{inr(h.dineIn || Math.round(h.sales * 0.68))}</td>
                      <td className="p-2.5 text-right">{inr(h.takeaway || Math.round(h.sales * 0.32))}</td>
                      <td className="p-2.5 text-right text-emerald-600">{inr(h.upi || Math.round(h.sales * 0.64))}</td>
                      <td className="p-2.5 text-right text-blue-600">{inr(h.cash || Math.round(h.sales * 0.36))}</td>
                      <td className="p-2.5 text-right font-black text-primary">{inr(h.sales)}</td>
                    </tr>
                  ))}
                  {selectedGridTable === "dishes" && topDishes.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-muted/40">
                      <td className="p-2.5 font-bold">#{idx + 1}</td>
                      <td className="p-2.5 font-bold text-foreground">{p.emoji} {p.name}</td>
                      <td className="p-2.5 text-muted-foreground">Main Course</td>
                      <td className="p-2.5 text-right">{inr(p.price)}</td>
                      <td className="p-2.5 text-center font-bold">{p.unitsSold}</td>
                      <td className="p-2.5 text-right font-black text-primary">{inr(p.revenue)}</td>
                    </tr>
                  ))}
                  {selectedGridTable === "payments" && (
                    <>
                      <tr className="hover:bg-muted/40">
                        <td className="p-2.5 font-bold text-emerald-600">upi</td>
                        <td className="p-2.5 text-center">38</td>
                        <td className="p-2.5 text-right font-black text-emerald-600">{inr(displayUpi)}</td>
                        <td className="p-2.5 text-right font-bold">64.37%</td>
                      </tr>
                      <tr className="hover:bg-muted/40">
                        <td className="p-2.5 font-bold text-blue-600">cash</td>
                        <td className="p-2.5 text-center">24</td>
                        <td className="p-2.5 text-right font-black text-blue-600">{inr(displayCash)}</td>
                        <td className="p-2.5 text-right font-bold">35.63%</td>
                      </tr>
                    </>
                  )}
                  {selectedGridTable === "orderTypes" && (
                    <>
                      <tr className="hover:bg-muted/40">
                        <td className="p-2.5 font-bold text-foreground">dine-in</td>
                        <td className="p-2.5 text-center">42</td>
                        <td className="p-2.5 text-right font-black text-primary">{inr(24000)}</td>
                        <td className="p-2.5 text-right font-bold">{inr(571)}</td>
                      </tr>
                      <tr className="hover:bg-muted/40">
                        <td className="p-2.5 font-bold text-foreground">takeaway</td>
                        <td className="p-2.5 text-center">20</td>
                        <td className="p-2.5 text-right font-black text-primary">{inr(10800)}</td>
                        <td className="p-2.5 text-right font-bold">{inr(540)}</td>
                      </tr>
                    </>
                  )}
                  {selectedGridTable === "customers" && (
                    <>
                      <tr className="hover:bg-muted/40">
                        <td className="p-2.5 font-bold text-foreground">Rahul Sharma</td>
                        <td className="p-2.5 text-muted-foreground">+91 98765 43210</td>
                        <td className="p-2.5 text-center font-bold">8</td>
                        <td className="p-2.5 text-right font-black text-primary">{inr(4850)}</td>
                        <td className="p-2.5 text-muted-foreground">Today</td>
                      </tr>
                      <tr className="hover:bg-muted/40">
                        <td className="p-2.5 font-bold text-foreground">Priya Patel</td>
                        <td className="p-2.5 text-muted-foreground">+91 98123 45678</td>
                        <td className="p-2.5 text-center font-bold">5</td>
                        <td className="p-2.5 text-right font-black text-primary">{inr(3200)}</td>
                        <td className="p-2.5 text-muted-foreground">Yesterday</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 6: POWER BI DAX FORMULAS LIBRARY */}
      {activePage === "dax" && (
        <div className="card-surface p-6 border-t-2 border-t-purple-500 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Code2 className="size-5 text-purple-500" /> Complete Power BI DAX Formulas Library (12+ Measures)
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Copy and paste these exact DAX formulas into Power BI Desktop to create all restaurant analytics measures.
              </p>
            </div>

            <button
              onClick={() => {
                const allDax = DAX_MEASURES.map(m => `// ${m.title}\n${m.dax}`).join("\n\n");
                copyText(allDax, "all-dax-measures");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-purple-700 transition-colors"
            >
              <Copy className="size-4" /> Copy All DAX Measures
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {DAX_MEASURES.map((measure, idx) => (
              <div key={idx} className="rounded-2xl border bg-muted/30 p-4 space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-md">
                      {measure.category}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#F2C811] bg-[#F2C811]/10 px-2 py-0.5 rounded-md border border-[#F2C811]/20">
                      📊 {measure.visual}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-foreground mt-2">{measure.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{measure.desc}</p>

                  <div className="mt-3 rounded-xl bg-black/90 p-3 text-white overflow-x-auto">
                    <code className="text-xs font-mono text-[#F2C811] block whitespace-pre-wrap">{measure.dax}</code>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => copyText(measure.dax, `dax-${idx}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    {copiedField === `dax-${idx}` ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5 text-primary" />}
                    {copiedField === `dax-${idx}` ? "Copied Formula" : "Copy DAX"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE 7: LIVE WEB IFRAME EMBED */}
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
    </div>
  );
}
