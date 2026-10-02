import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { G as redirect, _ as createFileRoute, b as useNavigate, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRouteWithContext, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $ as ChartNoAxesColumn, A as Maximize2, B as Flame, D as Minus, F as Layers, G as Copy, H as Download, I as KeyRound, K as CodeXml, L as IndianRupee, M as Lock, N as LoaderCircle, O as Minimize2, Q as ChartPie, S as QrCode, U as Database, V as ExternalLink, X as ChevronRight, Y as CircleCheck, Z as Check, _ as Server, a as User, at as ArrowUpRight, b as RefreshCw, c as TrendingUp, d as Table, et as ChartNoAxesColumnIncreasing, f as Sparkles, g as ShieldCheck, i as Users, it as Award, l as Trash2, m as ShoppingCart, n as X, nt as Calendar, o as UserPlus, p as SlidersHorizontal, q as Clock, r as UtensilsCrossed, rt as Banknote, t as Zap, tt as ChartColumn, u as Target, v as Search, w as Plus, x as ReceiptText, z as Funnel } from "../_libs/lucide-react.mjs";
import { T as usePos, a as Logo, c as Skeleton, f as cn, g as getActiveStaff, h as fetchTodayEarningsFromSupabase, i as LoadingGrid, l as StatusBadge, n as EmptyState, o as PageHeader, r as ErrorState, s as PosProvider, t as AppShell, u as VegMark, v as isSupabaseConfigured, x as setActiveStaff } from "./ui-BAZRHXjU.mjs";
import { n as inr, t as api } from "./api-DCKBFnnE.mjs";
import { n as QueryClientProvider, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as meta } from "./meta-Bfy40CcT.mjs";
import { t as Route$10 } from "./invoice._orderId-CNx2zw_w.mjs";
import { n as Label, t as Input } from "./label-Dvv8K65h.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$11 } from "./payments-Tur3M1n3.mjs";
import { a as XAxis, c as Pie, d as Tooltip, f as Legend, i as YAxis, l as Cell, n as BarChart, o as Line, r as LineChart, s as Bar, t as PieChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BpaIoSWA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BKtE5jvF.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-extrabold text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-bold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground",
					children: "Go home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. Try again or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-xl border px-4 py-2 text-sm font-bold",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: " Tan's Kitchen — Restaurant Order Management" },
			{
				name: "description",
				content: "Restaurant POS and order management."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PosProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })] })
	});
}
var PIE_COLORS$1 = [
	"#10b981",
	"#3b82f6",
	"#f59e0b",
	"#8b5cf6"
];
var RAW_DAILY_TREND = [
	{
		date: "23 Sep",
		sales: 18400,
		orders: 38,
		upi: 11e3,
		cash: 7400,
		dineIn: 12e3,
		takeaway: 6400,
		tax: 876,
		gross: 17524
	},
	{
		date: "24 Sep",
		sales: 21200,
		orders: 42,
		upi: 14e3,
		cash: 7200,
		dineIn: 15e3,
		takeaway: 6200,
		tax: 1010,
		gross: 20190
	},
	{
		date: "25 Sep",
		sales: 19800,
		orders: 39,
		upi: 12500,
		cash: 7300,
		dineIn: 13e3,
		takeaway: 6800,
		tax: 943,
		gross: 18857
	},
	{
		date: "26 Sep",
		sales: 24500,
		orders: 48,
		upi: 16e3,
		cash: 8500,
		dineIn: 17500,
		takeaway: 7e3,
		tax: 1167,
		gross: 23333
	},
	{
		date: "27 Sep",
		sales: 28900,
		orders: 54,
		upi: 19500,
		cash: 9400,
		dineIn: 2e4,
		takeaway: 8900,
		tax: 1376,
		gross: 27524
	},
	{
		date: "28 Sep",
		sales: 31200,
		orders: 58,
		upi: 21e3,
		cash: 10200,
		dineIn: 22e3,
		takeaway: 9200,
		tax: 1486,
		gross: 29714
	},
	{
		date: "29 Sep (Today)",
		sales: 34800,
		orders: 62,
		upi: 22400,
		cash: 12400,
		dineIn: 24e3,
		takeaway: 10800,
		tax: 1658,
		gross: 33142
	}
];
var RAW_HOURLY_DATA = [
	{
		hour: "11 AM",
		sales: 2400,
		orders: 5,
		dineIn: 1800,
		takeaway: 600,
		upi: 1600,
		cash: 800
	},
	{
		hour: "12 PM",
		sales: 4800,
		orders: 9,
		dineIn: 3200,
		takeaway: 1600,
		upi: 3200,
		cash: 1600
	},
	{
		hour: "1 PM",
		sales: 8900,
		orders: 16,
		dineIn: 6200,
		takeaway: 2700,
		upi: 5800,
		cash: 3100
	},
	{
		hour: "2 PM",
		sales: 7200,
		orders: 14,
		dineIn: 5e3,
		takeaway: 2200,
		upi: 4800,
		cash: 2400
	},
	{
		hour: "3 PM",
		sales: 3100,
		orders: 6,
		dineIn: 2100,
		takeaway: 1e3,
		upi: 2e3,
		cash: 1100
	},
	{
		hour: "4 PM",
		sales: 2100,
		orders: 4,
		dineIn: 1200,
		takeaway: 900,
		upi: 1400,
		cash: 700
	},
	{
		hour: "5 PM",
		sales: 3500,
		orders: 7,
		dineIn: 2200,
		takeaway: 1300,
		upi: 2300,
		cash: 1200
	},
	{
		hour: "6 PM",
		sales: 5400,
		orders: 11,
		dineIn: 3800,
		takeaway: 1600,
		upi: 3700,
		cash: 1700
	},
	{
		hour: "7 PM",
		sales: 9800,
		orders: 18,
		dineIn: 6900,
		takeaway: 2900,
		upi: 6500,
		cash: 3300
	},
	{
		hour: "8 PM",
		sales: 14800,
		orders: 28,
		dineIn: 10400,
		takeaway: 4400,
		upi: 9800,
		cash: 5e3
	},
	{
		hour: "9 PM",
		sales: 11200,
		orders: 21,
		dineIn: 7800,
		takeaway: 3400,
		upi: 7400,
		cash: 3800
	},
	{
		hour: "10 PM",
		sales: 4600,
		orders: 9,
		dineIn: 3100,
		takeaway: 1500,
		upi: 3e3,
		cash: 1600
	}
];
var DAX_MEASURES = [
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
	}
];
var FABRIC_DIRECT_URL = "https://app.fabric.microsoft.com/groups/me/reports/38c5dad2-f128-482a-a382-529715d21d5e/1eeb52d1680cd4017b76?experience=fabric-developer";
function PowerBiDashboardView({ embeddedUrl: initialEmbedUrl = "", showTabsHeader = true }) {
	const { orders, products, customers } = usePos();
	const [activePage, setActivePage] = (0, import_react.useState)("live-embed");
	const [viewModeToggle, setViewModeToggle] = (0, import_react.useState)("visual");
	const [showFilters, setShowFilters] = (0, import_react.useState)(true);
	const [isFullscreen, setIsFullscreen] = (0, import_react.useState)(false);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [copiedField, setCopiedField] = (0, import_react.useState)(null);
	const [selectedGridTable, setSelectedGridTable] = (0, import_react.useState)("daily");
	const [dateSlicer, setDateSlicer] = (0, import_react.useState)("7days");
	const [orderTypeSlicer, setOrderTypeSlicer] = (0, import_react.useState)("all");
	const [paymentSlicer, setPaymentSlicer] = (0, import_react.useState)("all");
	const [searchFilter, setSearchFilter] = (0, import_react.useState)("");
	const [crossPayment, setCrossPayment] = (0, import_react.useState)(null);
	const [crossHour, setCrossHour] = (0, import_react.useState)(null);
	const [crossDate, setCrossDate] = (0, import_react.useState)(null);
	const [crossDish, setCrossDish] = (0, import_react.useState)(null);
	const isCrossFiltered = Boolean(crossPayment || crossHour || crossDate || crossDish);
	const clearCrossFilters = () => {
		setCrossPayment(null);
		setCrossHour(null);
		setCrossDate(null);
		setCrossDish(null);
		toast.success("All Power BI interactive cross-filters reset");
	};
	const [customEmbedUrl, setCustomEmbedUrl] = (0, import_react.useState)(initialEmbedUrl || "https://app.powerbi.com/reportEmbed?reportId=38c5dad2-f128-482a-a382-529715d21d5e&autoAuth=true");
	const [inputUrl, setInputUrl] = (0, import_react.useState)(customEmbedUrl);
	const copyText = (text, fieldId) => {
		navigator.clipboard.writeText(text);
		setCopiedField(fieldId);
		toast.success("Copied to clipboard!");
		setTimeout(() => setCopiedField(null), 2e3);
	};
	const downloadCsv = (csvContent, fileName) => {
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
	const paidOrders = (0, import_react.useMemo)(() => {
		return orders.filter((o) => {
			if (o.paymentStatus !== "paid") return false;
			if (orderTypeSlicer === "dine-in" && !o.tableId) return false;
			if (orderTypeSlicer === "takeaway" && o.tableId) return false;
			if (paymentSlicer === "upi" && o.paymentMethod !== "upi") return false;
			if (paymentSlicer === "cash" && o.paymentMethod !== "cash") return false;
			if (crossPayment && o.paymentMethod !== crossPayment) return false;
			if (crossDish && !o.items.some((i) => i.product.name.toLowerCase().includes(crossDish.toLowerCase()))) return false;
			return true;
		});
	}, [
		orders,
		orderTypeSlicer,
		paymentSlicer,
		crossPayment,
		crossDish
	]);
	const liveNetSales = paidOrders.reduce((s, o) => s + o.total, 0);
	const liveGrossSales = paidOrders.reduce((s, o) => s + o.subtotal, 0);
	const liveTax = paidOrders.reduce((s, o) => s + o.tax, 0);
	const baseTodaySales = 34800;
	const baseGrossSales = 33142;
	const baseTax = 1658;
	const baseOrdersCount = 62;
	const slicerMultiplier = (0, import_react.useMemo)(() => {
		let mult = 1;
		if (orderTypeSlicer === "dine-in") mult *= .68;
		if (orderTypeSlicer === "takeaway") mult *= .32;
		if (paymentSlicer === "upi") mult *= .64;
		if (paymentSlicer === "cash") mult *= .36;
		if (crossPayment === "upi") mult *= .64;
		if (crossPayment === "cash") mult *= .36;
		if (crossHour) mult *= .16;
		if (crossDate) mult *= .82;
		if (crossDish) mult *= .28;
		return mult;
	}, [
		orderTypeSlicer,
		paymentSlicer,
		crossPayment,
		crossHour,
		crossDate,
		crossDish
	]);
	const displayNetSales = liveNetSales > 0 ? liveNetSales : Math.round(baseTodaySales * slicerMultiplier);
	const displayGrossSales = liveGrossSales > 0 ? liveGrossSales : Math.round(baseGrossSales * slicerMultiplier);
	const displayTax = liveTax > 0 ? liveTax : Math.round(baseTax * slicerMultiplier);
	const displayOrderCount = paidOrders.length > 0 ? paidOrders.length : Math.max(1, Math.round(baseOrdersCount * slicerMultiplier));
	const displayAov = displayOrderCount > 0 ? Math.round(displayNetSales / displayOrderCount) : 561;
	const liveUpi = paidOrders.filter((o) => o.paymentMethod === "upi").reduce((s, o) => s + o.total, 0);
	const liveCash = paidOrders.filter((o) => o.paymentMethod === "cash").reduce((s, o) => s + o.total, 0);
	const displayUpi = crossPayment === "cash" ? 0 : liveUpi > 0 ? liveUpi : Math.round(22400 * (paymentSlicer === "cash" ? 0 : 1) * (crossHour ? .16 : 1) * (crossDish ? .28 : 1));
	const displayCash = crossPayment === "upi" ? 0 : liveCash > 0 ? liveCash : Math.round(12400 * (paymentSlicer === "upi" ? 0 : 1) * (crossHour ? .16 : 1) * (crossDish ? .28 : 1));
	const filteredDailyTrend = (0, import_react.useMemo)(() => {
		return RAW_DAILY_TREND.map((d) => {
			let val = d.sales;
			if (orderTypeSlicer === "dine-in") val = d.dineIn;
			if (orderTypeSlicer === "takeaway") val = d.takeaway;
			if (paymentSlicer === "upi" || crossPayment === "upi") val = d.upi;
			if (paymentSlicer === "cash" || crossPayment === "cash") val = d.cash;
			if (crossHour) val *= .16;
			if (crossDish) val *= .28;
			if (crossDate && d.date !== crossDate) val *= .3;
			return {
				...d,
				sales: Math.round(val)
			};
		});
	}, [
		orderTypeSlicer,
		paymentSlicer,
		crossPayment,
		crossHour,
		crossDish,
		crossDate
	]);
	const filteredHourlyData = (0, import_react.useMemo)(() => {
		return RAW_HOURLY_DATA.map((d) => {
			let val = d.sales;
			if (orderTypeSlicer === "dine-in") val = d.dineIn;
			if (orderTypeSlicer === "takeaway") val = d.takeaway;
			if (paymentSlicer === "upi" || crossPayment === "upi") val = d.upi;
			if (paymentSlicer === "cash" || crossPayment === "cash") val = d.cash;
			if (crossDish) val *= .28;
			if (crossDate) val *= .82;
			return {
				...d,
				sales: Math.round(val)
			};
		});
	}, [
		orderTypeSlicer,
		paymentSlicer,
		crossPayment,
		crossDish,
		crossDate
	]);
	const maxHourlyVal = Math.max(...filteredHourlyData.map((d) => d.sales));
	const hourlyDataWithPeaks = filteredHourlyData.map((d) => ({
		...d,
		isPeak: d.sales === maxHourlyVal && d.sales > 0
	}));
	hourlyDataWithPeaks.find((d) => d.isPeak) || hourlyDataWithPeaks[9];
	const topDishes = (0, import_react.useMemo)(() => {
		return [...products].filter((p) => !searchFilter || p.name.toLowerCase().includes(searchFilter.toLowerCase())).filter((p) => !crossDish || p.name.toLowerCase().includes(crossDish.toLowerCase())).map((p) => ({
			...p,
			unitsSold: Math.max(1, Math.round((p.soldToday ?? 12) * (crossHour ? .2 : 1) * (crossPayment ? .6 : 1))),
			revenue: Math.round((p.soldToday ?? 12) * p.price * slicerMultiplier)
		})).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
	}, [
		products,
		slicerMultiplier,
		searchFilter,
		crossDish,
		crossHour,
		crossPayment
	]);
	const pieData = [{
		name: "UPI QR Payments",
		value: displayUpi,
		mode: "upi"
	}, {
		name: "Physical Cash",
		value: displayCash,
		mode: "cash"
	}].filter((d) => d.value > 0 || crossPayment !== null);
	const getTableCsv = (type) => {
		if (type === "daily") return "Date,Total Orders,Paid Orders,Gross Sales (INR),GST Tax (INR),Net Collection (INR),AOV (INR)\n" + RAW_DAILY_TREND.map((d) => `${d.date},${d.orders},${d.orders},${d.gross},${d.tax},${d.sales},${Math.round(d.sales / d.orders)}`).join("\n");
		if (type === "hourly") return "Hour,Total Orders,Dine-In Sales,Takeaway Sales,UPI Sales,Cash Sales,Total Hourly Sales\n" + RAW_HOURLY_DATA.map((d) => `${d.hour},${d.orders},${d.dineIn},${d.takeaway},${d.upi},${d.cash},${d.sales}`).join("\n");
		if (type === "dishes") return "Rank,Dish Name,Category,Unit Price (INR),Units Sold Today,Total Revenue (INR)\n" + topDishes.map((d, i) => `${i + 1},${d.name},Main Course,${d.price},${d.unitsSold},${d.revenue}`).join("\n");
		if (type === "payments") return `Payment Method,Transaction Count,Total Revenue Collected (INR),Share Percentage
UPI QR Code,38,${displayUpi},64.37%\nPhysical Cash Register,24,${displayCash},35.63%`;
		if (type === "orderTypes") return "Order Type,Order Count,Total Revenue (INR),Average Order Spend (INR)\nDine-In Table Service,42,24000,571\nTakeaway Express Counter,20,10800,540";
		if (type === "customers") return "Customer Name,Phone Number,Total Restaurant Visits,Lifetime Spent (INR),Last Visit\n" + ((customers || []).map((c) => `${c.name},${c.phone},${c.visits},${c.totalSpent},Today`).join("\n") || "Rahul Sharma,9876543210,8,4850,Today\nPriya Patel,9812345678,5,3200,Yesterday");
		return "";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-4 font-sans ${isFullscreen ? "fixed inset-0 z-50 overflow-y-auto bg-background p-6" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-[#252423] text-white shadow-xl overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4 p-4 border-b border-white/10 bg-gradient-to-r from-[#252423] via-[#2f2e2d] to-[#1f1e1d]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 place-items-center rounded-xl bg-[#F2C811] text-black font-black text-xl shadow-md",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-6 text-black" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-black text-base md:text-lg tracking-tight text-white",
										children: "Power BI Analytics & Table Data Center"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-md bg-[#F2C811] px-2 py-0.5 text-[10px] font-black uppercase text-black",
										children: "restaurantbi.pbix"
									}),
									isSupabaseConfigured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), " Supabase PostgreSQL Connected"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-400 font-medium",
								children: "Full Data Tables Grid • Copyable CSV Datasets • 15+ Complete DAX Formulas"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center bg-black/40 rounded-xl p-1 border border-white/10 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setViewModeToggle("visual"),
										className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold transition-all ${viewModeToggle === "visual" ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-3.5" }), " Visual Canvas"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setViewModeToggle("table"),
										className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-extrabold transition-all ${viewModeToggle === "table" ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { className: "size-3.5" }), " Table Data Grid"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setShowFilters(!showFilters),
									className: `inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${showFilters ? "bg-[#F2C811] text-black border-[#F2C811]" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3.5" }),
										"Slicers ",
										showFilters ? "ON" : "OFF"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: FABRIC_DIRECT_URL,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex items-center gap-1.5 rounded-xl bg-[#F2C811] px-3.5 py-1.5 text-xs font-black text-black hover:opacity-90 transition-all shadow",
									children: ["Open in Microsoft Fabric ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleRefresh,
									disabled: isRefreshing,
									className: "inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-3.5 text-[#F2C811] ${isRefreshing ? "animate-spin" : ""}` }), "Refresh Data"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: toggleFullscreen,
									className: "inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all",
									children: isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3.5" })
								})
							]
						})]
					}),
					showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#1f1e1d] p-3.5 border-b border-white/10 text-xs flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-extrabold uppercase text-[11px] text-[#F2C811] flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3.5" }), " Report Slicers:"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3 text-slate-400 ml-1" }), [
										"today",
										"7days",
										"30days"
									].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setDateSlicer(d),
										className: `px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${dateSlicer === d ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"}`,
										children: d === "today" ? "Today" : d === "7days" ? "7 Days" : "30 Days"
									}, d))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 uppercase font-extrabold px-1",
										children: "Type:"
									}), [
										"all",
										"dine-in",
										"takeaway"
									].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setOrderTypeSlicer(t),
										className: `px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${orderTypeSlicer === t ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"}`,
										children: t === "all" ? "All Orders" : t === "dine-in" ? "Dine-In" : "Takeaway"
									}, t))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 bg-black/40 rounded-lg p-1 border border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-slate-400 uppercase font-extrabold px-1",
										children: "Pay:"
									}), [
										"all",
										"upi",
										"cash"
									].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setPaymentSlicer(p),
										className: `px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${paymentSlicer === p ? "bg-[#F2C811] text-black shadow" : "text-slate-300 hover:text-white"}`,
										children: p === "all" ? "All Modes" : p === "upi" ? "UPI QR" : "Cash"
									}, p))]
								})
							]
						}), (orderTypeSlicer !== "all" || paymentSlicer !== "all" || dateSlicer !== "7days") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setDateSlicer("7days");
								setOrderTypeSlicer("all");
								setPaymentSlicer("all");
								toast.success("All Power BI slicers reset.");
							},
							className: "text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1",
							children: "Reset Filters"
						})]
					}),
					showTabsHeader && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex bg-[#181716] overflow-x-auto border-t border-white/10 text-xs",
						children: [
							{
								id: "overview",
								label: "📊 Page 1: Executive Overview"
							},
							{
								id: "hourly",
								label: "⏰ Page 2: Hourly Rush Traffic"
							},
							{
								id: "dishes",
								label: "🍲 Page 3: Category & Dish Matrix"
							},
							{
								id: "payments",
								label: "💳 Page 4: Payment Split & Tax Ledger"
							},
							{
								id: "tables-grid",
								label: "📋 Page 5: All Data Tables & CSV Grid"
							},
							{
								id: "dax",
								label: "⚡ Page 6: Power BI DAX Formulas Library"
							},
							{
								id: "live-embed",
								label: "🌐 Page 7: Live Web Iframe Embed"
							}
						].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActivePage(tab.id),
							className: `px-4 py-2.5 font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${activePage === tab.id ? "bg-[#252423] text-[#F2C811] border-[#F2C811] shadow-inner" : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"}`,
							children: tab.label
						}, tab.id))
					})
				]
			}),
			isCrossFiltered && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F2C811]/15 border-2 border-[#F2C811] p-3 text-xs font-bold text-foreground shadow-md animate-in fade-in duration-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 font-black text-[#F2C811] uppercase tracking-wide",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 animate-spin text-[#F2C811]" }), " Active Cross-Filter:"]
						}),
						crossPayment && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-lg bg-[#F2C811] text-black px-2.5 py-1 text-[11px] font-black uppercase shadow",
							children: [
								"Payment Mode: ",
								crossPayment === "upi" ? "UPI QR Code" : "Physical Cash",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCrossPayment(null),
									className: "ml-1 text-black/70 hover:text-red-700 font-extrabold",
									children: "✕"
								})
							]
						}),
						crossHour && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-lg bg-[#F2C811] text-black px-2.5 py-1 text-[11px] font-black uppercase shadow",
							children: [
								"Rush Hour: ",
								crossHour,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCrossHour(null),
									className: "ml-1 text-black/70 hover:text-red-700 font-extrabold",
									children: "✕"
								})
							]
						}),
						crossDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-lg bg-[#F2C811] text-black px-2.5 py-1 text-[11px] font-black uppercase shadow",
							children: [
								"Date: ",
								crossDate,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCrossDate(null),
									className: "ml-1 text-black/70 hover:text-red-700 font-extrabold",
									children: "✕"
								})
							]
						}),
						crossDish && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-lg bg-[#F2C811] text-black px-2.5 py-1 text-[11px] font-black uppercase shadow",
							children: [
								"Dish Filter: ",
								crossDish,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCrossDish(null),
									className: "ml-1 text-black/70 hover:text-red-700 font-extrabold",
									children: "✕"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: clearCrossFilters,
					className: "inline-flex items-center gap-1 rounded-xl bg-black text-[#F2C811] px-3.5 py-1.5 text-xs font-black hover:bg-black/80 transition-colors shadow",
					children: "Reset Canvas Cross-Filters"
				})]
			}),
			activePage === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface p-5 border-l-4 border-l-[#F2C811] relative overflow-hidden bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider",
										children: "Power BI Net Revenue"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-9 place-items-center rounded-xl bg-[#F2C811]/15 text-yellow-600 font-bold",
										children: "₹"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-3xl font-black text-foreground",
									children: inr(displayNetSales)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-600 font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5" }), " +14.2% Growth"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground text-[11px] font-semibold",
										children: [displayOrderCount, " Orders"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface p-5 border-l-4 border-l-blue-500 bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider",
										children: "Gross Sales (Excl GST)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-9 place-items-center rounded-xl bg-blue-500/10 text-blue-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-3xl font-black text-foreground",
									children: inr(displayGrossSales)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-xs text-muted-foreground font-medium",
									children: "Before 5% CGST/SGST tax"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface p-5 border-l-4 border-l-amber-500 bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider",
										children: "GST Tax (5%)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-3xl font-black text-amber-600",
									children: inr(displayTax)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-xs text-muted-foreground font-medium",
									children: "CGST 2.5% + SGST 2.5%"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface p-5 border-l-4 border-l-purple-500 bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider",
										children: "Avg Order Value (AOV)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-9 place-items-center rounded-xl bg-purple-500/10 text-purple-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-3xl font-black text-foreground",
									children: inr(displayAov)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-xs text-purple-600 font-bold",
									children: "Per table ticket size"
								})
							]
						})
					]
				}), viewModeToggle === "visual" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-5 lg:col-span-2 border-t-2 border-t-[#F2C811]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-extrabold text-base flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-[#F2C811]" }),
									" Daily Revenue Trend Curve",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full",
										children: "⚡ Interactive Cross-Filter"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Click any node to cross-filter canvas by date"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => copyText(getTableCsv("daily"), "daily-trend-csv"),
								className: "inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-primary" }), " Copy Table Data"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: filteredDailyTrend,
									onClick: (data) => {
										if (data && data.activePayload && data.activePayload[0]) {
											const selectedDate = data.activePayload[0].payload.date;
											setCrossDate((prev) => prev === selectedDate ? null : selectedDate);
										}
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "date",
											tickLine: false,
											axisLine: false,
											fontSize: 12
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tickLine: false,
											axisLine: false,
											fontSize: 12,
											tickFormatter: (v) => `₹${v / 1e3}k`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											formatter: (v) => inr(v),
											cursor: {
												stroke: "#F2C811",
												strokeDasharray: "3 3"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "sales",
											stroke: "#F2C811",
											strokeWidth: 3.5,
											dot: {
												r: 6,
												fill: "#F2C811",
												cursor: "pointer"
											},
											activeDot: {
												r: 9,
												cursor: "pointer"
											}
										})
									]
								})
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-5 border-t-2 border-t-emerald-500 flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-extrabold text-base flex items-center gap-2 mb-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "size-4 text-emerald-500" }),
									" Payment Mode Split",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full",
										children: "⚡ Interactive Cross-Filter"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-3",
								children: "Click slice or card to filter dashboard by payment mode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setCrossPayment((prev) => prev === "upi" ? null : "upi"),
									className: `cursor-pointer transition-all border p-3 rounded-xl flex items-center justify-between ${crossPayment === "upi" ? "ring-2 ring-emerald-500 bg-emerald-500/25 font-bold shadow" : "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-foreground",
											children: "UPI QR"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-black text-emerald-600 font-mono",
										children: inr(displayUpi)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => setCrossPayment((prev) => prev === "cash" ? null : "cash"),
									className: `cursor-pointer transition-all border p-3 rounded-xl flex items-center justify-between ${crossPayment === "cash" ? "ring-2 ring-blue-500 bg-blue-500/25 font-bold shadow" : "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "size-4 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-foreground",
											children: "Cash"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-black text-blue-600 font-mono",
										children: inr(displayCash)
									})]
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-36 mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: pieData,
										cx: "50%",
										cy: "50%",
										innerRadius: 25,
										outerRadius: 50,
										paddingAngle: 5,
										dataKey: "value",
										style: { cursor: "pointer" },
										onClick: (entry) => {
											if (entry && entry.name) {
												const mode = entry.name.toLowerCase().includes("upi") ? "upi" : "cash";
												setCrossPayment((prev) => prev === mode ? null : mode);
											}
										},
										children: pieData.map((entry, index) => {
											const isSelected = !crossPayment || crossPayment === "upi" && entry.name.includes("UPI") || crossPayment === "cash" && entry.name.includes("Cash");
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
												fill: PIE_COLORS$1[index % PIE_COLORS$1.length],
												opacity: isSelected ? 1 : .25,
												stroke: crossPayment && isSelected ? "#ffffff" : "none",
												strokeWidth: 2
											}, `cell-${index}`);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (value) => inr(value) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
								] })
							})
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-lg flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { className: "size-5 text-primary" }), " Daily Earnings Ledger Table (`v_powerbi_daily_earnings`)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => copyText(getTableCsv("daily"), "daily-table"),
								className: "inline-flex items-center gap-1.5 rounded-xl border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-emerald-500" }), " Copy Table CSV"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => downloadCsv(getTableCsv("daily"), "powerbi_daily_earnings"),
								className: "inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Download CSV"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b bg-muted/50 text-muted-foreground font-extrabold uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Order Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-center",
										children: "Total Orders"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Gross Sales"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "GST Tax (5%)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Net Collection"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Avg Order Spend"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y font-mono",
								children: RAW_DAILY_TREND.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									onClick: () => setCrossDate((prev) => prev === d.date ? null : d.date),
									className: `cursor-pointer transition-colors ${crossDate === d.date ? "bg-amber-500/20 font-bold border-l-4 border-l-amber-500" : "hover:bg-muted/30"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 font-bold text-foreground font-sans",
											children: d.date
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-3 text-center font-bold text-foreground",
											children: [d.orders, " orders"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right",
											children: inr(d.gross)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right text-amber-600",
											children: inr(d.tax)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right font-black text-primary",
											children: inr(d.sales)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right text-muted-foreground",
											children: inr(Math.round(d.sales / d.orders))
										})
									]
								}, d.date))
							})]
						})
					})]
				})]
			}),
			activePage === "hourly" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6 border-t-2 border-t-amber-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-extrabold text-lg flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5 text-amber-500" }),
									" Hourly Rush Traffic Table & Chart",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full",
										children: "⚡ Interactive Cross-Filter"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-0.5",
								children: "Click any hourly bar or table row to cross-filter the report canvas by that hour window."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => copyText(getTableCsv("hourly"), "hourly-table-csv"),
									className: "inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-primary" }), " Copy Hourly Data CSV"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => downloadCsv(getTableCsv("hourly"), "powerbi_hourly_earnings"),
									className: "inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-extrabold text-black hover:opacity-90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Download CSV"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-72 mb-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: hourlyDataWithPeaks,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "hour",
											tickLine: false,
											axisLine: false,
											fontSize: 12
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tickLine: false,
											axisLine: false,
											fontSize: 12,
											tickFormatter: (v) => `₹${v}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											formatter: (v) => inr(v),
											cursor: { fill: "var(--muted)" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "sales",
											radius: [
												8,
												8,
												0,
												0
											],
											style: { cursor: "pointer" },
											onClick: (entry) => {
												if (entry && entry.hour) setCrossHour((prev) => prev === entry.hour ? null : entry.hour);
											},
											children: hourlyDataWithPeaks.map((entry, index) => {
												const isSelected = !crossHour || crossHour === entry.hour;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
													fill: crossHour === entry.hour ? "#3b82f6" : entry.isPeak ? "#f97316" : "#F2C811",
													opacity: isSelected ? 1 : .25,
													stroke: crossHour === entry.hour ? "#ffffff" : "none",
													strokeWidth: 2
												}, `hour-${index}`);
											})
										})
									]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto border rounded-xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "border-b bg-muted/60 text-muted-foreground font-extrabold uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3",
											children: "Hour Window"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3 text-center",
											children: "Orders Count"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3 text-right",
											children: "Dine-In Sales"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3 text-right",
											children: "Takeaway Sales"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3 text-right",
											children: "UPI Collection"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3 text-right",
											children: "Cash Collection"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-3 text-right",
											children: "Total Hourly Revenue"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y font-mono",
									children: RAW_HOURLY_DATA.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										onClick: () => setCrossHour((prev) => prev === h.hour ? null : h.hour),
										className: `cursor-pointer transition-colors ${crossHour === h.hour ? "bg-amber-500/25 font-black border-l-4 border-l-amber-500" : h.sales === maxHourlyVal ? "bg-amber-500/10 font-bold hover:bg-amber-500/20" : "hover:bg-muted/30"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-3 font-extrabold text-foreground font-sans flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-amber-500" }),
													" ",
													h.hour
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-center font-bold text-foreground",
												children: h.orders
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right text-muted-foreground",
												children: inr(h.dineIn)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right text-muted-foreground",
												children: inr(h.takeaway)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right text-emerald-600",
												children: inr(h.upi)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right text-blue-600",
												children: inr(h.cash)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right font-black text-foreground",
												children: inr(h.sales)
											})
										]
									}, h.hour))
								})]
							})
						})
					]
				})
			}),
			activePage === "dishes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6 border-t-2 border-t-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-lg flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5 text-amber-500" }),
								" Top Selling Dishes Matrix Table (`v_powerbi_top_dishes`)",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full",
									children: "⚡ Interactive Cross-Filter"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-0.5",
							children: "Click any dish row below to cross-filter the report canvas specifically for that dish."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => copyText(getTableCsv("dishes"), "dishes-table-csv"),
								className: "inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-primary" }), " Copy Dishes Table CSV"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => downloadCsv(getTableCsv("dishes"), "powerbi_top_dishes"),
								className: "inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground hover:opacity-90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Download CSV"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b bg-muted/50 text-muted-foreground font-extrabold uppercase tracking-wider",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Rank"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Dish Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-center",
										children: "Units Sold Today"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Unit Price"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Total Revenue"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y",
								children: topDishes.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									onClick: () => setCrossDish((prev) => prev === p.name ? null : p.name),
									className: `cursor-pointer transition-colors ${crossDish === p.name ? "bg-primary/20 font-bold border-l-4 border-l-primary" : "hover:bg-muted/30"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-grid size-6 place-items-center rounded-lg text-xs font-black ${idx === 0 ? "bg-amber-500/20 text-amber-600" : idx === 1 ? "bg-slate-500/20 text-slate-600" : idx === 2 ? "bg-orange-500/20 text-orange-600" : "bg-muted text-muted-foreground"}`,
												children: ["#", idx + 1]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 font-bold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-base",
													children: p.emoji
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-3 text-center font-bold text-foreground font-mono",
											children: [p.unitsSold, " units"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right text-muted-foreground font-mono",
											children: inr(p.price)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right font-black text-primary font-mono",
											children: inr(p.revenue)
										})
									]
								}, p.id))
							})]
						})
					})]
				})
			}),
			activePage === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6 border-t-2 border-t-emerald-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-lg flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-emerald-500" }), " Payment & Tax Table (`v_powerbi_payment_summary`)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-0.5",
							children: "UPI vs Cash register transactions and 5% GST tax settlement table."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => copyText(getTableCsv("payments"), "payments-table-csv"),
							className: "inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-emerald-500" }), " Copy Payment Table CSV"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto border rounded-xl mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b bg-muted/50 text-muted-foreground font-extrabold uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Payment Channel"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-center",
										children: "Transaction Count"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Total Revenue Collected"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Revenue Share %"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
								className: "divide-y font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-3 font-bold text-emerald-600 font-sans flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-4" }), " UPI / QR Code (GPay, PhonePe)"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-center font-bold text-foreground",
											children: "38 orders"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right font-black text-emerald-600",
											children: inr(displayUpi)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right font-bold text-emerald-700",
											children: "64.37%"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-3 font-bold text-blue-600 font-sans flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "size-4" }), " Physical Cash Register"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-center font-bold text-foreground",
											children: "24 orders"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right font-black text-blue-600",
											children: inr(displayCash)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right font-bold text-blue-700",
											children: "35.63%"
										})
									]
								})]
							})]
						})
					})]
				})
			}),
			activePage === "tables-grid" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface p-6 border-t-2 border-t-[#F2C811] space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-lg flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, { className: "size-5 text-[#F2C811]" }), " All Power BI Datasets & Exportable Table Grid"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-0.5",
							children: "Select any database table below to view, copy, or download as CSV for your Power BI report."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									const allCsv = `--- DAILY EARNINGS ---\n${getTableCsv("daily")}\n\n--- HOURLY EARNINGS ---\n${getTableCsv("hourly")}\n\n--- TOP DISHES ---\n${getTableCsv("dishes")}\n\n--- PAYMENT SUMMARY ---\n${getTableCsv("payments")}`;
									copyText(allCsv, "all-tables-csv");
								},
								className: "inline-flex items-center gap-2 rounded-xl bg-[#F2C811] px-4 py-2.5 text-xs font-black text-black hover:opacity-90 transition-opacity",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy All 6 Data Tables (CSV)"]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex border-b overflow-x-auto gap-2 pb-2 text-xs",
						children: [
							{
								id: "daily",
								label: "📊 v_powerbi_daily_earnings",
								icon: Calendar
							},
							{
								id: "hourly",
								label: "⏰ v_powerbi_hourly_earnings",
								icon: Clock
							},
							{
								id: "dishes",
								label: "🍲 v_powerbi_top_dishes",
								icon: Flame
							},
							{
								id: "payments",
								label: "💳 v_powerbi_payment_summary",
								icon: ShieldCheck
							},
							{
								id: "orderTypes",
								label: "🍽️ v_powerbi_order_type_breakdown",
								icon: Layers
							},
							{
								id: "customers",
								label: "👥 v_powerbi_customer_analytics",
								icon: Users
							}
						].map((t) => {
							const Icon = t.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelectedGridTable(t.id),
								className: `flex items-center gap-2 rounded-xl px-3.5 py-2 font-extrabold whitespace-nowrap transition-all ${selectedGridTable === t.id ? "bg-primary text-primary-foreground shadow" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }),
									" ",
									t.label
								]
							}, t.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border bg-muted/20 p-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono font-bold text-sm text-primary flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "size-4" }),
									" PostgreSQL View: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "underline",
										children: ["public.", selectedGridTable === "daily" ? "v_powerbi_daily_earnings" : selectedGridTable === "hourly" ? "v_powerbi_hourly_earnings" : selectedGridTable === "dishes" ? "v_powerbi_top_dishes" : selectedGridTable === "payments" ? "v_powerbi_payment_summary" : selectedGridTable === "orderTypes" ? "v_powerbi_order_type_breakdown" : "v_powerbi_customer_analytics"]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => copyText(getTableCsv(selectedGridTable), `grid-${selectedGridTable}`),
									className: "inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-emerald-500" }), " Copy CSV Data"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => downloadCsv(getTableCsv(selectedGridTable), `powerbi_${selectedGridTable}`),
									className: "inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground hover:opacity-90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Download CSV"]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto max-h-96",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-xs font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("thead", {
									className: "sticky top-0 bg-card border-b text-muted-foreground font-extrabold uppercase",
									children: [
										selectedGridTable === "daily" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "order_date"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-center",
												children: "total_orders"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-center",
												children: "paid_orders"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "gross_sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "total_tax_collected"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "total_net_earnings"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "avg_order_value"
											})
										] }),
										selectedGridTable === "hourly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "hour_formatted"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-center",
												children: "total_orders"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "dine_in_sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "takeaway_sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "upi_sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "cash_sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "hourly_sales"
											})
										] }),
										selectedGridTable === "dishes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "rank"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "item_name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "category_name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "unit_price"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-center",
												children: "quantity_sold"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "total_item_revenue"
											})
										] }),
										selectedGridTable === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "payment_method"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-center",
												children: "transaction_count"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "total_collected"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "share_percentage"
											})
										] }),
										selectedGridTable === "orderTypes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "order_type"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-center",
												children: "order_count"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "total_revenue"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "avg_bill_amount"
											})
										] }),
										selectedGridTable === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "customer_name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "phone"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-center",
												children: "visits"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "total_spent"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5",
												children: "last_visit"
											})
										] })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
									className: "divide-y",
									children: [
										selectedGridTable === "daily" && RAW_DAILY_TREND.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-foreground",
													children: d.date
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center",
													children: d.orders
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center text-emerald-600 font-bold",
													children: d.orders
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right",
													children: inr(d.gross)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right text-amber-600",
													children: inr(d.tax)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-primary",
													children: inr(d.sales)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right text-muted-foreground",
													children: inr(Math.round(d.sales / d.orders))
												})
											]
										}, d.date)),
										selectedGridTable === "hourly" && RAW_HOURLY_DATA.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-foreground",
													children: h.hour
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center",
													children: h.orders
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right",
													children: inr(h.dineIn)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right",
													children: inr(h.takeaway)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right text-emerald-600",
													children: inr(h.upi)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right text-blue-600",
													children: inr(h.cash)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-primary",
													children: inr(h.sales)
												})
											]
										}, h.hour)),
										selectedGridTable === "dishes" && topDishes.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-2.5 font-bold",
													children: ["#", idx + 1]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "p-2.5 font-bold text-foreground",
													children: [
														p.emoji,
														" ",
														p.name
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-muted-foreground",
													children: "Main Course"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right",
													children: inr(p.price)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center font-bold",
													children: p.unitsSold
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-primary",
													children: inr(p.revenue)
												})
											]
										}, p.id)),
										selectedGridTable === "payments" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-emerald-600",
													children: "upi"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center",
													children: "38"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-emerald-600",
													children: inr(displayUpi)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-bold",
													children: "64.37%"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-blue-600",
													children: "cash"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center",
													children: "24"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-blue-600",
													children: inr(displayCash)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-bold",
													children: "35.63%"
												})
											]
										})] }),
										selectedGridTable === "orderTypes" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-foreground",
													children: "dine-in"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center",
													children: "42"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-primary",
													children: inr(24e3)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-bold",
													children: inr(571)
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-foreground",
													children: "takeaway"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center",
													children: "20"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-primary",
													children: inr(10800)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-bold",
													children: inr(540)
												})
											]
										})] }),
										selectedGridTable === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-foreground",
													children: "Rahul Sharma"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-muted-foreground",
													children: "+91 98765 43210"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center font-bold",
													children: "8"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-primary",
													children: inr(4850)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-muted-foreground",
													children: "Today"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-foreground",
													children: "Priya Patel"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-muted-foreground",
													children: "+91 98123 45678"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-center font-bold",
													children: "5"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right font-black text-primary",
													children: inr(3200)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-muted-foreground",
													children: "Yesterday"
												})
											]
										})] })
									]
								})]
							})
						})]
					})
				]
			}),
			activePage === "dax" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface p-6 border-t-2 border-t-purple-500 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-extrabold text-lg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "size-5 text-purple-500" }), " Complete Power BI DAX Formulas Library (12+ Measures)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: "Copy and paste these exact DAX formulas into Power BI Desktop to create all restaurant analytics measures."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							const allDax = DAX_MEASURES.map((m) => `// ${m.title}\n${m.dax}`).join("\n\n");
							copyText(allDax, "all-dax-measures");
						},
						className: "inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-purple-700 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy All DAX Measures"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: DAX_MEASURES.map((measure, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border bg-muted/30 p-4 space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-black uppercase text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-md",
									children: measure.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-extrabold text-[#F2C811] bg-[#F2C811]/10 px-2 py-0.5 rounded-md border border-[#F2C811]/20",
									children: ["📊 ", measure.visual]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-extrabold text-sm text-foreground mt-2",
								children: measure.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: measure.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 rounded-xl bg-black/90 p-3 text-white overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-xs font-mono text-[#F2C811] block whitespace-pre-wrap",
									children: measure.dax
								})
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => copyText(measure.dax, `dax-${idx}`),
								className: "inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors",
								children: [copiedField === `dax-${idx}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-primary" }), copiedField === `dax-${idx}` ? "Copied Formula" : "Copy DAX"]
							})
						})]
					}, idx))
				})]
			}),
			activePage === "live-embed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface p-6 border-t-2 border-t-[#F2C811] space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-extrabold text-lg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-5 text-[#F2C811]" }), " Power BI Web Iframe & Custom URL Embed"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: "Paste your published Power BI Web report iframe or report link below to render your live report directly."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border bg-muted/30 p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-extrabold uppercase text-muted-foreground block",
							children: "Power BI Embed URL or Publish-to-Web Link:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: inputUrl,
								onChange: (e) => setInputUrl(e.target.value),
								placeholder: "https://app.powerbi.com/view?r=eyJrIjoi...",
								className: "flex-1 rounded-xl border bg-background px-4 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setCustomEmbedUrl(inputUrl);
									toast.success("Power BI report iframe URL updated!");
								},
								className: "rounded-xl bg-[#F2C811] px-5 py-2.5 text-xs font-extrabold text-black hover:opacity-90 transition-opacity",
								children: "Apply Embed URL"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border bg-black/90 p-4 text-center min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden",
						children: customEmbedUrl && customEmbedUrl.includes("app.powerbi.com") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: "Power BI Report Embed",
							src: customEmbedUrl,
							className: "w-full h-[500px] rounded-xl border-0",
							allowFullScreen: true
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-md space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-16 place-items-center rounded-2xl bg-[#F2C811]/10 text-[#F2C811] mx-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-8" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-extrabold text-base text-white",
									children: "Power BI Report Viewer Container"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-slate-400",
									children: [
										"Publish your ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "text-[#F2C811] font-bold",
											children: "restaurantbi.pbix"
										}),
										" file in Power BI Desktop to your Power BI Service workspace, click ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "File > Embed report > Publish to web" }),
										", and paste the URL here."
									]
								})
							]
						})
					})
				]
			})
		]
	});
}
var Route$8 = createFileRoute("/")({
	head: () => meta("Billing Dashboard", "Live restaurant collection, POS billing terminal & daily sales metrics."),
	component: Dashboard
});
var PIE_COLORS = ["#10b981", "#3b82f6"];
var DAILY_SALES_TREND = [
	{
		date: "22 Sep",
		sales: 18400,
		orders: 38
	},
	{
		date: "23 Sep",
		sales: 21200,
		orders: 42
	},
	{
		date: "24 Sep",
		sales: 19800,
		orders: 39
	},
	{
		date: "25 Sep",
		sales: 24500,
		orders: 48
	},
	{
		date: "26 Sep",
		sales: 28900,
		orders: 54
	},
	{
		date: "27 Sep",
		sales: 31200,
		orders: 58
	},
	{
		date: "28 Sep (Today)",
		sales: 34800,
		orders: 62
	}
];
var SALES_BY_DAY_OF_WEEK = [
	{
		day: "Mon",
		sales: 19400,
		isPeak: false
	},
	{
		day: "Tue",
		sales: 21800,
		isPeak: false
	},
	{
		day: "Wed",
		sales: 20500,
		isPeak: false
	},
	{
		day: "Thu",
		sales: 24900,
		isPeak: false
	},
	{
		day: "Fri",
		sales: 32400,
		isPeak: false
	},
	{
		day: "Sat",
		sales: 41800,
		isPeak: true
	},
	{
		day: "Sun",
		sales: 44200,
		isPeak: true
	}
];
function Dashboard() {
	const { orders, products } = usePos();
	const sales = useQuery({
		queryKey: ["hourly"],
		queryFn: api.getHourlySales
	});
	const categories = useQuery({
		queryKey: ["categories"],
		queryFn: api.getCategories
	});
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [viewMode, setViewMode] = (0, import_react.useState)("powerbi");
	const [staff, setStaff] = (0, import_react.useState)(getActiveStaff());
	(0, import_react.useEffect)(() => {
		setStaff(getActiveStaff());
	}, []);
	const getTimeGreeting = () => {
		const hr = (/* @__PURE__ */ new Date()).getHours();
		if (hr < 12) return "Good morning";
		if (hr < 17) return "Good afternoon";
		return "Good evening";
	};
	const safeOrders = orders || [];
	const safeProducts = products || [];
	const paidOrders = safeOrders.filter((o) => o?.paymentStatus === "paid");
	const liveNetSales = paidOrders.reduce((s, o) => s + (o?.total || 0), 0);
	const liveCash = paidOrders.filter((o) => o?.paymentMethod === "cash").reduce((s, o) => s + (o?.total || 0), 0);
	const liveUpi = paidOrders.filter((o) => o?.paymentMethod === "upi").reduce((s, o) => s + (o?.total || 0), 0);
	const todaySales = liveNetSales > 0 ? liveNetSales : 34800;
	const cashCollection = liveCash > 0 ? liveCash : 12400;
	const upiCollection = liveUpi > 0 ? liveUpi : 22400;
	const pendingOrders = safeOrders.filter((o) => o?.status === "pending" || o?.status === "preparing");
	const totalOrdersCount = safeOrders.length;
	const avgOrderValue = paidOrders.length > 0 ? Math.round(liveNetSales / paidOrders.length) : 642;
	const monthlyRevenue = 284500 + todaySales;
	const dailyTarget = 4e4;
	const targetProgressPct = Math.min(100, Math.round(todaySales / dailyTarget * 100));
	const topDishes = (0, import_react.useMemo)(() => {
		return [...safeProducts].map((p) => ({
			...p,
			unitsSold: p?.soldToday ?? 12,
			revenue: (p?.soldToday ?? 12) * (p?.price || 0)
		})).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
	}, [safeProducts]);
	const categoryRevenue = (0, import_react.useMemo)(() => {
		const catsMap = {};
		safeProducts.forEach((p) => {
			if (!p) return;
			const catName = categories.data?.find((c) => c.id === p.categoryId)?.name || "Main Course";
			if (!catsMap[catName]) catsMap[catName] = {
				name: catName,
				revenue: 0,
				itemsSold: 0
			};
			const sold = p.soldToday ?? 10;
			catsMap[catName].revenue += sold * (p.price || 0);
			catsMap[catName].itemsSold += sold;
		});
		return Object.values(catsMap).sort((a, b) => b.revenue - a.revenue);
	}, [safeProducts, categories.data]);
	const hourlyDataWithPeaks = (0, import_react.useMemo)(() => {
		if (!sales.data) return [];
		const maxVal = Math.max(...sales.data.map((d) => d.sales));
		return sales.data.map((d) => ({
			...d,
			isPeak: d.sales === maxVal
		}));
	}, [sales.data]);
	const peakHourItem = (0, import_react.useMemo)(() => {
		if (!sales.data || sales.data.length === 0) return {
			hour: "8:00 PM",
			sales: 14800
		};
		return [...sales.data].sort((a, b) => b.sales - a.sales)[0];
	}, [sales.data]);
	const pieData = [{
		name: "UPI / QR Code",
		value: upiCollection
	}, {
		name: "Cash Register",
		value: cashCollection
	}].filter((d) => d.value > 0);
	const handleRefreshCollection = async () => {
		setIsRefreshing(true);
		toast.info("Syncing daily collection with Supabase database...");
		if (isSupabaseConfigured) {
			const liveStats = await fetchTodayEarningsFromSupabase();
			if (liveStats) toast.success(`Daily collection synced! ${liveStats.orderCount} paid orders today.`);
			else toast.success("Daily collection metrics updated!");
		} else setTimeout(() => {
			toast.success("Daily collection metrics refreshed.");
		}, 500);
		setTimeout(() => setIsRefreshing(false), 800);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `${getTimeGreeting()}, ${staff.name.split(" ")[0]} 👋`,
			subtitle: `Logged in as ${staff.role} • Here's your restaurant analytics & billing control center.`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleRefreshCollection,
					disabled: isRefreshing,
					className: "inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `size-4 text-primary ${isRefreshing ? "animate-spin" : ""}` }), "Refresh Analytics"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/pos",
					className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Quick Bill (+ New Order)"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid size-3 place-items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2.5 rounded-full bg-emerald-500" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm font-bold",
					children: ["Live Restaurant Ledger: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
							weekday: "long",
							year: "numeric",
							month: "short",
							day: "numeric"
						})
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-3",
				children: isSupabaseConfigured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), " Supabase DB Connected"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-600",
					children: "Demo Mode Active"
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-gradient-to-r from-card to-muted/40 p-2 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setViewMode("powerbi"),
					className: `flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${viewMode === "powerbi" ? "bg-[#252423] text-[#F2C811] shadow-md border border-[#F2C811]/30" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4 text-[#F2C811]" }), " Power BI Dashboard View 🟡"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setViewMode("standard"),
					className: `flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${viewMode === "standard" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "size-4" }), " Standard Billing View"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "https://app.fabric.microsoft.com/groups/me/reports/38c5dad2-f128-482a-a382-529715d21d5e/1eeb52d1680cd4017b76?experience=fabric-developer",
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex items-center gap-1.5 rounded-xl bg-[#F2C811] px-3.5 py-2 text-xs font-black text-black hover:opacity-90 transition-opacity shadow-sm",
					children: "Open in Microsoft Fabric ↗"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/powerbi",
					className: "inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pr-2",
					children: ["Power BI Integration Hub ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })]
				})]
			})]
		}),
		viewMode === "powerbi" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerBiDashboardView, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-5 border-l-4 border-l-primary relative overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider",
									children: "Today Sales"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 place-items-center rounded-xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "size-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 text-2xl font-black text-foreground",
								children: inr(todaySales)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3" }), " +14.2%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "vs yesterday"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-5 border-l-4 border-l-blue-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider",
									children: "Total Orders"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReceiptText, { className: "size-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 text-2xl font-black text-foreground",
								children: [totalOrdersCount, " Orders"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-xs text-muted-foreground font-semibold",
								children: [
									paidOrders.length + 110,
									" Paid • ",
									pendingOrders.length,
									" In Kitchen"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-5 border-l-4 border-l-emerald-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider",
									children: "Avg Order Value"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 text-2xl font-black text-foreground",
								children: inr(avgOrderValue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-xs text-emerald-600 font-bold",
								children: "Sales / Total Orders"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-5 border-l-4 border-l-purple-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider",
									children: "Monthly Revenue"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 text-2xl font-black text-foreground",
								children: inr(monthlyRevenue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-xs text-purple-600 font-bold",
								children: "Current Month Run Rate"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4 text-primary" }), " Target vs Actual Sales"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-black text-primary font-mono",
								children: [targetProgressPct, "% Achieved"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground font-semibold",
								children: "Actual Sales Today"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-black text-foreground",
								children: inr(todaySales)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground font-semibold",
									children: "Daily Target"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-base font-extrabold text-muted-foreground",
									children: inr(dailyTarget)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-3 w-full rounded-full bg-muted overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500",
									style: { width: `${targetProgressPct}%` }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[11px] font-bold text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "₹0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [inr(Math.max(0, dailyTarget - todaySales)), " Remaining"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inr(dailyTarget) })
								]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-xl bg-emerald-500/10 p-3 text-xs font-bold text-emerald-600 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "On track to exceed daily revenue goal!" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5 lg:col-span-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-base font-extrabold flex items-center gap-2 text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-amber-500" }), " Executive Business Insights 💡"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full",
							children: "Automated Intelligence"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-card/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-extrabold text-muted-foreground uppercase",
										children: "Best-Selling Dish"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-black text-foreground mt-1 flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🍛" }),
											" ",
											topDishes[0]?.name || "Chicken Biryani"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-emerald-600 font-bold mt-0.5",
										children: [topDishes[0]?.unitsSold || 58, " units sold today"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-card/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-extrabold text-muted-foreground uppercase",
										children: "Highest Revenue Category"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-black text-foreground mt-1 flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🍲" }),
											" ",
											categoryRevenue[0]?.name || "Biryani"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-emerald-600 font-bold mt-0.5",
										children: [inr(categoryRevenue[0]?.revenue || 24960), " revenue"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-card/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-extrabold text-muted-foreground uppercase",
										children: "Peak Sales Hour"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-black text-foreground mt-1 flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-amber-500" }),
											" ",
											peakHourItem?.hour || "8:00 PM"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-amber-600 font-bold mt-0.5",
										children: [inr(peakHourItem?.sales || 14800), " sales volume"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-card/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-extrabold text-muted-foreground uppercase",
										children: "Sales Growth vs Yesterday"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-black text-emerald-600 mt-1 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-emerald-600" }), " +14.2% Growth"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground font-medium mt-0.5",
										children: "+₹4,280 higher collection"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-card/60 p-3 sm:col-span-2 lg:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] font-extrabold text-muted-foreground uppercase",
										children: "Best-Performing Day"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-black text-foreground mt-1 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4 text-amber-500" }), " Sunday (Weekend Rush)"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground font-medium mt-0.5",
										children: "Averages ₹44,200 per Sunday shift"
									})
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-primary" }), " Daily Sales Trend (Sales by Date)"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-muted-foreground",
							children: "Last 7 Days"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: DAILY_SALES_TREND,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										tickLine: false,
										axisLine: false,
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tickLine: false,
										axisLine: false,
										fontSize: 12,
										tickFormatter: (v) => `₹${v / 1e3}k`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v) => inr(v),
										cursor: {
											stroke: "var(--primary)",
											strokeDasharray: "3 3"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "sales",
										stroke: "var(--primary)",
										strokeWidth: 3,
										dot: {
											r: 5,
											fill: "var(--primary)"
										},
										activeDot: { r: 8 }
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "size-4 text-blue-500" }), " Sales by Day of Week"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Monday to Sunday revenue split"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: SALES_BY_DAY_OF_WEEK,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "day",
											tickLine: false,
											axisLine: false,
											fontSize: 11
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											formatter: (v) => inr(v),
											cursor: { fill: "var(--muted)" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "sales",
											radius: [
												6,
												6,
												0,
												0
											],
											children: SALES_BY_DAY_OF_WEEK.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.isPeak ? "#f97316" : "#3b82f6" }, `cell-${index}`))
										})
									]
								})
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-extrabold text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-primary" }), " Hourly Sales & Peak Hour Analysis"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Highlighted orange bars represent peak rush hours"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-extrabold text-amber-600",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5" }),
								" Peak: ",
								peakHourItem?.hour
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: sales.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-full rounded-xl" }) : sales.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: () => sales.refetch() }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: hourlyDataWithPeaks,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "hour",
										tickLine: false,
										axisLine: false,
										fontSize: 12
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v) => inr(v),
										cursor: { fill: "var(--muted)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "sales",
										radius: [
											8,
											8,
											0,
											0
										],
										children: hourlyDataWithPeaks.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
											fill: entry.isPeak ? "#f97316" : "var(--primary)",
											opacity: entry.isPeak ? 1 : .7
										}, `hour-${index}`))
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-purple-500" }), " Revenue by Category"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Sales contribution by menu category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-3 max-h-[250px] overflow-y-auto pr-1",
							children: categoryRevenue.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs font-bold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground",
											children: cat.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary font-mono",
											children: inr(cat.revenue)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 w-full rounded-full bg-muted overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-primary",
											style: { width: `${Math.min(100, Math.round(cat.revenue / (todaySales || 1) * 100))}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground text-right",
										children: [cat.itemsSold ?? cat.itemsSold, " items sold"]
									})
								]
							}, cat.name))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-extrabold text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4 text-amber-500" }), " Top Selling Dishes Leaderboard 🥇"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Ranked by unit volume & total revenue generated"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/menu",
							className: "text-xs font-bold text-primary hover:underline flex items-center gap-1",
							children: ["View Menu ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b bg-muted/40 text-muted-foreground font-extrabold uppercase tracking-wider",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Rank"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3",
										children: "Dish Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-center",
										children: "Qty Sold"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Unit Price"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 text-right",
										children: "Total Revenue"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y",
								children: topDishes.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30 transition-colors font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `inline-grid size-6 place-items-center rounded-lg text-xs font-black ${idx === 0 ? "bg-amber-500/15 text-amber-600" : idx === 1 ? "bg-slate-500/15 text-slate-600" : idx === 2 ? "bg-orange-500/15 text-orange-600" : "bg-muted text-muted-foreground"}`,
												children: ["#", idx + 1]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5 font-bold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-lg",
													children: p.emoji
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-3 text-center font-bold text-foreground",
											children: [p.unitsSold, " units"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right text-muted-foreground font-mono",
											children: inr(p.price)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-right font-black text-primary font-mono",
											children: inr(p.revenue)
										})
									]
								}, p.id))
							})]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-5 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-extrabold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payment Methods Analysis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-foreground font-bold font-mono",
								children: ["Total: ", inr(cashCollection + upiCollection)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mb-4",
							children: "Direct breakdown of UPI QR payments vs Physical Cash"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-2xl border bg-emerald-500/5 p-4 border-emerald-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-extrabold text-muted-foreground uppercase",
										children: "UPI / QR Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-black text-emerald-600",
										children: inr(upiCollection)
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-black text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-xl",
									children: [Math.round(upiCollection / (cashCollection + upiCollection || 1) * 100), "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-2xl border bg-blue-500/5 p-4 border-blue-500/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-10 place-items-center rounded-xl bg-blue-500/15 text-blue-600 font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "size-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-extrabold text-muted-foreground uppercase",
										children: "Cash Register"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl font-black text-blue-600",
										children: inr(cashCollection)
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-black text-blue-700 bg-blue-500/10 px-2.5 py-1 rounded-xl",
									children: [Math.round(cashCollection / (cashCollection + upiCollection || 1) * 100), "%"]
								})]
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-36",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: pieData.length > 0 ? pieData : [{
										name: "UPI / Cash",
										value: 1
									}],
									cx: "50%",
									cy: "50%",
									innerRadius: 25,
									outerRadius: 50,
									paddingAngle: 5,
									dataKey: "value",
									children: pieData.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[index % PIE_COLORS.length] }, `cell-${index}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (value) => inr(value) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
							] })
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface mt-6 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-extrabold text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-primary" }), " Live Pending Kitchen Orders"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/orders",
						className: "inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline",
						children: ["View All Bills ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
					children: pendingOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-4 bg-muted/20 hover:border-primary transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-extrabold text-base",
									children: ["Bill #", o.number]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground font-medium",
								children: [
									o.tableId ? `Table ${o.tableId.slice(1)}` : "Takeaway",
									" • ",
									o.items.length,
									" items"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between border-t pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-extrabold text-foreground",
									children: inr(o.total)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/payments",
									search: { order: o.id },
									className: "rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20",
									children: "Pay Bill"
								})]
							})
						]
					}, o.id))
				})]
			})
		] })
	] });
}
var Route$7 = createFileRoute("/analytics")({ beforeLoad: () => {
	throw redirect({ to: "/powerbi" });
} });
var $$splitComponentImporter$3 = () => import("./customers-Cw_QSbB8.mjs");
var Route$6 = createFileRoute("/customers")({
	head: () => meta("Customers", "Regular guests, contact details and their order history."),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var Route$5 = createFileRoute("/login")({
	head: () => meta("Staff Sign In", "Restaurant staff & manager portal sign-in."),
	component: Login
});
function Login() {
	const nav = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [loginMode, setLoginMode] = (0, import_react.useState)("passcode");
	const [role, setRole] = (0, import_react.useState)("Manager");
	const [staffName, setStaffName] = (0, import_react.useState)("Mansoor Ahmed");
	const [passcode, setPasscode] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("mansoor@spiceroute.in");
	const [password, setPassword] = (0, import_react.useState)("demo1234");
	const [shift, setShift] = (0, import_react.useState)("Morning Shift");
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!staffName.trim()) {
			toast.error("Please enter your staff name.");
			return;
		}
		if (loginMode === "passcode" && passcode.length < 4) {
			toast.error("Please enter a 4-digit staff passcode.");
			return;
		}
		if (loginMode === "email" && (!email || !password)) {
			toast.error("Please enter both email and password.");
			return;
		}
		setLoading(true);
		toast.info(`Authenticating ${staffName} (${role})...`);
		setActiveStaff({
			name: staffName.trim(),
			role,
			email,
			shift
		});
		setTimeout(() => {
			setLoading(false);
			toast.success(`Welcome, ${staffName.trim()} (${role} - ${shift})!`);
			nav({ to: "/" });
		}, 500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden flex-col justify-between bg-gradient-to-br from-primary via-primary/95 to-orange-600 p-12 text-primary-foreground lg:flex relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-20 -bottom-20 size-96 rounded-full bg-white/10 blur-3xl pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-12 place-items-center rounded-2xl bg-white text-primary text-xl font-black shadow-lg",
							children: "T"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-black",
								children: "Tan's Kitchen"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs opacity-80",
								children: "Spice Route Kitchen Systems"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-md",
						children: "v2.4 Pro"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "z-10 my-auto py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-7xl mb-6",
							children: "🍛 🥘 🍢 🍹"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-4xl font-black leading-tight tracking-tight",
							children: [
								"Fast Billing. Real-Time Collections.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Zero Lag."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-md text-base opacity-90 leading-relaxed font-medium",
							children: "Complete billing software built for high-volume restaurant floors, table order tracking, and live Supabase + Power BI analytics."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex items-center gap-6 border-t border-white/20 pt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-black",
									children: "₹3,024"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs opacity-80",
									children: "Today's Net Collection"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-px bg-white/20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-black",
									children: "100% Sync"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs opacity-80",
									children: "Supabase & Power BI Live"
								})] })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "z-10 flex items-center justify-between text-xs opacity-80 border-t border-white/10 pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Spice Route Kitchen • Bengaluru, KA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Active Shift: ", shift] })]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6 md:p-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:hidden mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-black tracking-tight",
						children: "Staff Sign In 🔒"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Select your role, enter staff name & credentials to start shift"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							{
								id: "Cashier",
								label: "Cashier",
								icon: User
							},
							{
								id: "Manager",
								label: "Manager",
								icon: ShieldCheck
							},
							{
								id: "Kitchen Admin",
								label: "Kitchen",
								icon: UtensilsCrossed
							}
						].map((r) => {
							const Icon = r.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRole(r.id),
								className: cn("flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-bold transition-all", role === r.id ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20" : "bg-card text-muted-foreground hover:border-primary"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.label })]
							}, r.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-xl bg-muted p-1 text-xs font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLoginMode("passcode"),
							className: cn("flex-1 py-2 rounded-lg transition-colors", loginMode === "passcode" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"),
							children: "Quick PIN Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLoginMode("email"),
							className: cn("flex-1 py-2 rounded-lg transition-colors", loginMode === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"),
							children: "Email & Password"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "card-surface p-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "staffName",
								className: "text-xs font-extrabold text-muted-foreground uppercase",
								children: "Staff / User Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "staffName",
								type: "text",
								value: staffName,
								onChange: (e) => setStaffName(e.target.value),
								placeholder: "Enter your name (e.g., Mansoor Ahmed)",
								className: "mt-1 h-11 rounded-xl text-sm font-bold"
							})] }),
							loginMode === "passcode" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "passcode",
									className: "text-xs font-extrabold text-muted-foreground uppercase",
									children: "Staff 4-Digit Quick PIN (Default: 1234)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "passcode",
										type: "password",
										maxLength: 4,
										value: passcode,
										onChange: (e) => setPasscode(e.target.value),
										placeholder: "• • • •",
										className: "h-12 pl-10 text-center font-mono text-xl tracking-[0.5em] font-black rounded-xl"
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									className: "text-xs font-extrabold text-muted-foreground uppercase",
									children: "Staff Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									className: "mt-1 h-11 rounded-xl"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "password",
									className: "text-xs font-extrabold text-muted-foreground uppercase",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: "mt-1 h-11 rounded-xl"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 pt-1 border-t",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-extrabold text-muted-foreground uppercase",
									children: "Work Shift"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: shift,
									onChange: (e) => setShift(e.target.value),
									className: "h-10 w-full rounded-xl border bg-card px-3 text-xs font-bold shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Morning Shift",
											children: "Morning Shift (09:00 AM - 04:00 PM)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Evening Shift",
											children: "Evening Shift (04:00 PM - 11:30 PM)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Night Shift",
											children: "Night Shift (11:30 PM - 04:00 AM)"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: loading,
								type: "submit",
								className: "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 disabled:opacity-70 transition-all mt-4",
								children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Sign In as ",
									staffName || "Staff",
									" (",
									role,
									")"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-xs text-muted-foreground pt-1",
								children: "Demo Mode Active — Any PIN (e.g. 1234) or credentials will sign in."
							})
						]
					})
				]
			})
		})]
	});
}
var $$splitComponentImporter$2 = () => import("./menu-g0lCVWrG.mjs");
var Route$4 = createFileRoute("/menu")({
	head: () => meta("Menu", "Add, edit and manage dishes and menu categories."),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./orders-3qztr73p.mjs");
var Route$3 = createFileRoute("/orders")({
	head: () => meta("Orders", "Active, completed and cancelled restaurant orders with details."),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var Route$2 = createFileRoute("/pos")({
	head: () => meta("Billing POS Terminal", "Quick billing software for restaurant orders, customer details & thermal receipts."),
	component: Pos
});
function Pos() {
	const pos = usePos();
	const nav = useNavigate();
	const cats = useQuery({
		queryKey: ["categories"],
		queryFn: api.getCategories
	});
	const [cat, setCat] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [vegOnly, setVegOnly] = (0, import_react.useState)(false);
	const [showAddCustomer, setShowAddCustomer] = (0, import_react.useState)(false);
	const [custName, setCustName] = (0, import_react.useState)("");
	const [payModalOpen, setPayModalOpen] = (0, import_react.useState)(false);
	const [selectedMethod, setSelectedMethod] = (0, import_react.useState)("upi");
	const [cashTendered, setCashTendered] = (0, import_react.useState)("");
	const items = (0, import_react.useMemo)(() => {
		return pos.products.filter((p) => {
			const matchCat = cat === "all" || p.categoryId === cat;
			const matchQ = p.name.toLowerCase().includes(q.toLowerCase());
			const matchVeg = vegOnly ? p.veg : true;
			return matchCat && matchQ && matchVeg;
		});
	}, [
		pos.products,
		cat,
		q,
		vegOnly
	]);
	const qtyOf = (id) => pos.cart.find((c) => c.productId === id)?.qty ?? 0;
	const handleAddQuickCustomer = (e) => {
		e.preventDefault();
		if (!custName) {
			toast.error("Please enter customer name.");
			return;
		}
		const newC = pos.addCustomer({ name: custName });
		toast.success(`Customer ${newC.name} saved & linked to bill!`);
		setShowAddCustomer(false);
		setCustName("");
	};
	const handlePlaceOrder = (payNow) => {
		if (pos.cart.length === 0) return;
		if (payNow) setPayModalOpen(true);
		else {
			const o = pos.placeOrder();
			if (!o) return;
			toast.success(`Bill #${o.number} created & sent to kitchen!`);
		}
	};
	const handleCompletePayment = () => {
		const o = pos.placeOrder();
		if (!o) return;
		pos.payOrder(o.id, selectedMethod);
		toast.success(`Bill #${o.number} paid via ${selectedMethod.toUpperCase()}!`);
		setPayModalOpen(false);
		nav({
			to: "/invoice/$orderId",
			params: { orderId: o.id }
		});
	};
	const cashGivenNum = parseFloat(cashTendered) || 0;
	const changeDue = Math.max(0, cashGivenNum - pos.totals.total);
	const selectedCustomer = pos.customers.find((c) => c.id === pos.customerId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "POS Billing Terminal 🧾",
			subtitle: "Select items, collect customer details, print thermal bill & record collections."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 xl:grid-cols-[1fr_400px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search food items by name...",
								className: "h-12 w-full rounded-2xl border bg-card pl-12 pr-4 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setVegOnly(!vegOnly),
							className: cn("h-12 shrink-0 flex items-center gap-2 rounded-2xl border px-4 text-xs font-extrabold transition-colors", vegOnly ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "bg-card text-muted-foreground hover:border-primary"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-emerald-500" }), " Veg Only"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto pb-2",
						children: cats.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10" }) : cats.isError ? null : [{
							id: "all",
							name: "All Items",
							emoji: "🍽️"
						}, ...cats.data ?? []].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setCat(c.id),
							className: cn("flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all", cat === c.id ? "border-primary bg-primary text-primary-foreground shadow-sm" : "bg-card hover:border-primary text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.emoji }), c.name]
						}, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: cats.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingGrid, { count: 9 }) : cats.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: () => cats.refetch() }) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No dishes found",
						text: `Nothing matches "${q}". Try another search or category.`
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 2xl:grid-cols-3",
						children: items.map((p) => {
							const qty = qtyOf(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("card-surface flex gap-4 p-4 transition-all hover:border-primary/50", !p.available && "opacity-55"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VegMark, { veg: p.veg }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1.5 font-bold leading-snug text-foreground text-sm",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 font-black text-primary",
											children: inr(p.price)
										}),
										!p.available && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-xs font-bold text-destructive",
											children: "Out of stock"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative w-24 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-20 place-items-center rounded-2xl bg-primary-soft text-4xl",
										children: p.emoji
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute -bottom-2 left-1/2 -translate-x-1/2",
										children: qty === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: !p.available,
											onClick: () => pos.add(p),
											className: "h-8 w-20 rounded-xl border bg-card text-xs font-black text-emerald-600 shadow-sm transition-all hover:bg-emerald-500 hover:text-white disabled:text-muted-foreground",
											children: "+ ADD"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex h-8 w-20 items-center justify-between rounded-xl border bg-card text-emerald-600 shadow-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => pos.setQty(p.id, qty - 1),
													className: "px-1.5",
													"aria-label": "Decrease",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-black",
													children: qty
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => pos.add(p),
													className: "px-1.5",
													"aria-label": "Increase",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" })
												})
											]
										})
									})]
								})]
							}, p.id);
						})
					}) })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "card-surface flex h-fit flex-col p-5 xl:sticky xl:top-8 border-primary/20 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-black",
							children: "Active Bill Receipt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Order Items & Total Payable"
						})] }), pos.cart.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: pos.clearCart,
							className: "flex items-center gap-1 text-xs font-bold text-destructive hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Clear Cart"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-muted/20 p-3 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-extrabold text-muted-foreground uppercase flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5 text-primary" }), " Customer Info"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setShowAddCustomer(!showAddCustomer),
									className: "text-[11px] font-bold text-primary flex items-center gap-1 hover:underline",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3" }),
										" ",
										showAddCustomer ? "Cancel" : "+ New Customer"
									]
								})]
							}),
							showAddCustomer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleAddQuickCustomer,
								className: "space-y-2 pt-1 border-t",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: custName,
									onChange: (e) => setCustName(e.target.value),
									placeholder: "Customer Name (e.g., Rajesh)",
									className: "h-8 w-full rounded-lg border bg-card px-2 text-xs font-medium"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "h-8 w-full rounded-lg bg-primary text-xs font-bold text-primary-foreground",
									children: "Save Customer & Link to Bill"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: pos.customerId ?? "",
								onChange: (e) => pos.setCustomerId(e.target.value || void 0),
								className: "h-9 w-full rounded-lg border bg-card px-2 text-xs font-bold shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "-- Guest / Walk-in Customer --"
								}), pos.customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [
										c.name,
										" • ",
										c.visits,
										" Visits"
									]
								}, c.id))]
							}),
							selectedCustomer && !showAddCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-emerald-600 font-bold flex items-center gap-1 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }),
									" Linked to ",
									selectedCustomer.name,
									" (",
									selectedCustomer.visits,
									" visits, ",
									inr(selectedCustomer.totalSpent),
									" spent)"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-1",
						children: "Select Order Type / Table"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: pos.tableId ?? "",
						onChange: (e) => pos.setTableId(e.target.value || void 0),
						className: "h-10 w-full rounded-xl border bg-card px-3 text-xs font-bold shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Takeaway / Parcel Counter"
						}), pos.tables.filter((t) => t.status === "available").map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: t.id,
							children: [
								"Dine-in Table ",
								t.name,
								" (",
								t.seats,
								" Seats)"
							]
						}, t.id))]
					})] }),
					pos.cart.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-10 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mx-auto size-12 text-muted-foreground/50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 font-extrabold text-sm",
								children: "Cart is empty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Tap dishes on the menu to build the bill"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "max-h-[30vh] space-y-3 overflow-y-auto pr-1",
							children: pos.cart.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2 border-b border-dashed pb-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-xs font-bold",
											children: i.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												inr(i.price),
												" × ",
												i.qty
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center rounded-lg border text-emerald-600 bg-background",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => pos.setQty(i.productId, i.qty - 1),
												className: "p-1",
												"aria-label": "Decrease",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-5 text-center text-xs font-black",
												children: i.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => pos.setQty(i.productId, i.qty + 1),
												className: "p-1",
												"aria-label": "Increase",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" })
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-16 text-right text-xs font-black",
										children: inr(i.price * i.qty)
									})
								]
							}, i.productId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5 border-t border-dashed pt-3 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-t pt-2 text-sm font-black text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Payable" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary text-base",
									children: inr(pos.totals.total)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handlePlaceOrder(false),
								className: "h-11 rounded-xl border-2 border-primary text-xs font-extrabold text-primary hover:bg-primary/5 transition-colors",
								children: "Send Kitchen Ticket"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handlePlaceOrder(true),
								className: "h-11 rounded-xl bg-primary text-xs font-black text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity",
								children: "Pay & Print Bill 🧾"
							})]
						})
					] })
				]
			})]
		}),
		payModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-lg",
							children: "Collect Payment & Print Bill"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Select Cash or UPI to complete bill"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPayModalOpen(false),
							className: "rounded-lg p-1 text-muted-foreground hover:bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-primary/10 p-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold text-muted-foreground uppercase",
								children: "Total Bill Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-3xl font-black text-primary mt-1",
								children: inr(pos.totals.total)
							}),
							selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-bold text-emerald-600 mt-1",
								children: ["Customer: ", selectedCustomer.name]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [{
							id: "upi",
							label: "UPI / QR Code",
							icon: QrCode
						}, {
							id: "cash",
							label: "Cash Register",
							icon: Banknote
						}].map((m) => {
							const Icon = m.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelectedMethod(m.id),
								className: cn("flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-extrabold transition-all", selectedMethod === m.id ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20" : "bg-card text-muted-foreground hover:border-primary"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.label })]
							}, m.id);
						})
					}),
					selectedMethod === "cash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-muted/20 p-3.5 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-extrabold text-muted-foreground block",
								children: "Cash Tendered by Customer (₹)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: cashTendered,
								onChange: (e) => setCashTendered(e.target.value),
								placeholder: `e.g. ${Math.ceil(pos.totals.total / 100) * 100}`,
								className: "h-10 w-full rounded-xl border bg-card px-3 text-sm font-bold font-mono"
							}),
							cashGivenNum > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs font-bold pt-1 border-t",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Return Change:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("font-extrabold font-mono text-sm", changeDue >= 0 ? "text-emerald-600" : "text-destructive"),
									children: inr(changeDue)
								})]
							})
						]
					}),
					selectedMethod === "upi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-emerald-500/5 p-4 text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-12 mx-auto place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 font-bold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-extrabold text-emerald-600",
								children: "Scan QR Code on Dynamic UPI POS Terminal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: "Accepts GPay, PhonePe, Paytm & UPI Apps"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleCompletePayment,
						className: "w-full h-12 rounded-xl bg-emerald-600 text-sm font-extrabold text-white shadow-[var(--shadow-lift)] hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }), " Record Payment & Print Thermal Bill"]
					})
				]
			})
		})
	] });
}
var Route$1 = createFileRoute("/powerbi")({
	head: () => meta("Power BI & Supabase Integration", "Connect Power BI desktop with Supabase database to track live restaurant revenue and analytics."),
	component: PowerBiIntegration
});
function PowerBiIntegration() {
	const [copiedField, setCopiedField] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("credentials");
	const copyText = (text, fieldId) => {
		navigator.clipboard.writeText(text);
		setCopiedField(fieldId);
		setTimeout(() => setCopiedField(null), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Power BI Embedded Dashboard Hub 📊",
			subtitle: "Live Power BI report visuals, PostgreSQL analytical views, and desktop integration for restaurantbi.pbix."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerBiDashboardView, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8 rounded-2xl border bg-card p-5 shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `grid size-12 place-items-center rounded-2xl ${isSupabaseConfigured ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "size-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-extrabold text-lg",
							children: "Supabase Database Connection"
						}), isSupabaseConfigured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " Connected"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600",
							children: "Demo Mode (Env Pending)"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: isSupabaseConfigured ? "Live orders are syncing in real-time to your PostgreSQL database." : "Using local demo state. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to sync live."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://supabase.com/dashboard",
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 transition-colors",
						children: ["Supabase Dashboard ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex border-b mb-6 overflow-x-auto gap-2",
			children: [
				{
					id: "credentials",
					label: "Power BI Connection",
					icon: Server
				},
				{
					id: "sql",
					label: "SQL Schema & Views",
					icon: Layers
				},
				{
					id: "powerbi-steps",
					label: "Step-by-Step Setup Guide",
					icon: ChartNoAxesColumnIncreasing
				},
				{
					id: "dax",
					label: "Useful DAX Measures",
					icon: Zap
				}
			].map((tab) => {
				const Icon = tab.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab(tab.id),
					className: `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-extrabold whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
						" ",
						tab.label
					]
				}, tab.id);
			})
		}),
		activeTab === "credentials" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-extrabold text-lg flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Server, { className: "size-5 text-primary" }), " PostgreSQL Credentials for Power BI Desktop"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-1 mb-4",
							children: [
								"In Power BI Desktop, select ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: "Get Data > PostgreSQL Database"
								}),
								" and enter these parameters:"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: [
								{
									label: "Server / Host",
									value: "db.gxwarlojidcebchmxkpz.supabase.co",
									key: "host"
								},
								{
									label: "Port",
									value: "5432 (Direct) or 6543 (Pooler)",
									key: "port"
								},
								{
									label: "Database Name",
									value: "postgres",
									key: "dbname"
								},
								{
									label: "User",
									value: "postgres",
									key: "user"
								},
								{
									label: "Encryption Mode / SSL",
									value: "Require",
									key: "ssl"
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border bg-muted/30 p-3.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
									children: item.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "text-sm font-mono font-bold text-foreground",
									children: item.value
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => copyText(item.value, item.key),
									className: "self-start sm:self-center flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors",
									children: [copiedField === item.key ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copiedField === item.key ? "Copied" : "Copy"]
								})]
							}, item.key))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-extrabold text-lg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-emerald-500" }), " Security & Connection Options"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-500 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Import vs DirectQuery Mode:" }),
								" For real-time billing updates, choose ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DirectQuery" }),
								" in Power BI. For fast offline dashboards, select ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Import" }),
								" mode with scheduled refresh."
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-500 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Database Password:" }), " Use your Supabase Database password (set during project setup in Settings > Database)."] })]
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-extrabold text-base mb-3",
						children: "Power BI Visual Metrics Included"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "size-4" }), " Today's Total Gross Revenue & Tax"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 p-2 rounded-lg bg-muted text-foreground font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumnIncreasing, { className: "size-4 text-blue-500" }), " Hourly Sales Peak Analysis"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 p-2 rounded-lg bg-muted text-foreground font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-purple-500" }), " Top Selling Menu Dishes"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 p-2 rounded-lg bg-muted text-foreground font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4 text-emerald-500" }), " UPI vs Cash vs Card Split"]
							})
						]
					})]
				})
			})]
		}),
		activeTab === "sql" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-extrabold text-lg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-5 text-primary" }), " Pre-built Power BI Database Views"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: "These views aggregate raw billing transactions into ready-to-visualize tables inside Power BI."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs bg-muted px-3 py-1.5 rounded-xl font-mono font-bold text-foreground",
						children: "Location: /supabase/schema.sql"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						{
							name: "v_powerbi_daily_earnings",
							desc: "Daily revenue, tax, net earnings, order counts and average bill size."
						},
						{
							name: "v_powerbi_hourly_earnings",
							desc: "Hourly sales breakdown for peak hour traffic analysis."
						},
						{
							name: "v_powerbi_sales_by_category",
							desc: "Revenue generated per category (Starters, Biryani, Beverages, etc.)."
						},
						{
							name: "v_powerbi_top_dishes",
							desc: "Most popular items sold, quantity count, and total item revenue."
						},
						{
							name: "v_powerbi_payment_summary",
							desc: "Revenue distribution across Cash, UPI, and Card transactions."
						},
						{
							name: "v_powerbi_order_type_breakdown",
							desc: "Comparison of Dine-In vs Takeaway sales performance."
						}
					].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-muted/20 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono font-extrabold text-sm text-primary",
							children: v.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs text-muted-foreground",
							children: v.desc
						})]
					}, v.name))
				})]
			})
		}),
		activeTab === "powerbi-steps" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface p-6 space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-extrabold text-lg",
				children: "Step-by-Step Power BI Setup Instructions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold",
							children: "1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-extrabold text-base",
							children: "Open Power BI Desktop & Choose Connector"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-0.5",
							children: [
								"Click on ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Get Data" }),
								" > Search for ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "PostgreSQL Database" }),
								" > Click ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Connect" }),
								"."
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold",
							children: "2"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-extrabold text-base",
							children: "Enter Server & Database Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-0.5",
							children: [
								"Enter Server: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-muted px-1.5 py-0.5 rounded font-bold text-foreground",
									children: "db.gxwarlojidcebchmxkpz.supabase.co"
								}),
								" and Database: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-muted px-1.5 py-0.5 rounded font-bold text-foreground",
									children: "postgres"
								}),
								". Select Data Connectivity mode: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DirectQuery" }),
								"."
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold",
							children: "3"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-extrabold text-base",
							children: "Select Analytical Views"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-0.5",
							children: [
								"In the Navigator window, expand the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-muted px-1.5 py-0.5 rounded font-bold text-foreground",
									children: "public"
								}),
								" schema and select ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-muted px-1.5 py-0.5 rounded font-bold text-foreground",
									children: "v_powerbi_daily_earnings"
								}),
								", ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-muted px-1.5 py-0.5 rounded font-bold text-foreground",
									children: "v_powerbi_top_dishes"
								}),
								", and ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-muted px-1.5 py-0.5 rounded font-bold text-foreground",
									children: "v_powerbi_payment_summary"
								}),
								"."
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold",
							children: "4"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-extrabold text-base",
							children: "Build Visual Dashboard Cards"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-0.5",
							children: [
								"Drag ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "total_net_earnings" }),
								" into a Card Visual for \"Today's Earnings\", drag ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "category_name" }),
								" vs ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "category_revenue" }),
								" into a Donut Chart, and drag ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "hour_formatted" }),
								" vs ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "hourly_sales" }),
								" into a Bar Chart."
							]
						})] })]
					})
				]
			})]
		}),
		activeTab === "dax" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface p-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-extrabold text-lg",
					children: "Copy-Paste Power BI DAX Formulas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Create these DAX measures inside Power BI for rapid calculation of earnings, growth, and tax metrics:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: [
						{
							title: "Today Net Earnings",
							code: "Today Earnings = CALCULATE(SUM(v_powerbi_daily_earnings[total_net_earnings]), v_powerbi_daily_earnings[order_date] = TODAY())"
						},
						{
							title: "Average Daily Revenue",
							code: "Avg Daily Sales = AVERAGE(v_powerbi_daily_earnings[total_net_earnings])"
						},
						{
							title: "Total Tax Collected",
							code: "Total GST Collected = SUM(v_powerbi_daily_earnings[total_tax_collected])"
						},
						{
							title: "UPI Payment Share %",
							code: "UPI Share % = DIVIDE(CALCULATE(SUM(v_powerbi_payment_summary[total_collected]), v_powerbi_payment_summary[payment_method] = \"upi\"), SUM(v_powerbi_payment_summary[total_collected]), 0)"
						}
					].map((dax, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-muted/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-extrabold text-primary uppercase tracking-wider",
							children: dax.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-xs font-mono font-bold text-foreground mt-1 block",
							children: dax.code
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => copyText(dax.code, `dax-${i}`),
							className: "self-start sm:self-center flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted",
							children: [copiedField === `dax-${i}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copiedField === `dax-${i}` ? "Copied" : "Copy DAX"]
						})]
					}, i))
				})
			]
		})
	] });
}
var $$splitComponentImporter = () => import("./tables-Bt7MGav8.mjs");
var Route = createFileRoute("/tables")({
	head: () => meta("Tables", "Floor view of available, occupied and reserved tables."),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	AnalyticsRoute: Route$7.update({
		id: "/analytics",
		path: "/analytics",
		getParentRoute: () => Route$9
	}),
	CustomersRoute: Route$6.update({
		id: "/customers",
		path: "/customers",
		getParentRoute: () => Route$9
	}),
	LoginRoute: Route$5.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$9
	}),
	MenuRoute: Route$4.update({
		id: "/menu",
		path: "/menu",
		getParentRoute: () => Route$9
	}),
	OrdersRoute: Route$3.update({
		id: "/orders",
		path: "/orders",
		getParentRoute: () => Route$9
	}),
	PaymentsRoute: Route$11.update({
		id: "/payments",
		path: "/payments",
		getParentRoute: () => Route$9
	}),
	PosRoute: Route$2.update({
		id: "/pos",
		path: "/pos",
		getParentRoute: () => Route$9
	}),
	PowerbiRoute: Route$1.update({
		id: "/powerbi",
		path: "/powerbi",
		getParentRoute: () => Route$9
	}),
	TablesRoute: Route.update({
		id: "/tables",
		path: "/tables",
		getParentRoute: () => Route$9
	}),
	InvoiceOrderIdRoute: Route$10.update({
		id: "/invoice/$orderId",
		path: "/invoice/$orderId",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
