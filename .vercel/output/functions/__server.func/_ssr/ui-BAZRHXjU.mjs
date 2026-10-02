import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { J as ClipboardList, P as LayoutDashboard, R as Inbox, W as CreditCard, h as ShoppingBag, i as Users, j as LogOut, k as Menu, n as X, ot as Armchair, r as UtensilsCrossed, s as TriangleAlert, tt as ChartColumn, y as RotateCw } from "../_libs/lucide-react.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-BAZRHXjU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var categories = [
	{
		id: "c1",
		name: "Starters",
		emoji: "🥟"
	},
	{
		id: "c2",
		name: "Biryani",
		emoji: "🍛"
	},
	{
		id: "c3",
		name: "Main Course",
		emoji: "🍲"
	},
	{
		id: "c4",
		name: "Breads",
		emoji: "🫓"
	},
	{
		id: "c5",
		name: "Beverages",
		emoji: "🥤"
	},
	{
		id: "c6",
		name: "Desserts",
		emoji: "🍨"
	}
];
var products = [
	{
		id: "p1",
		name: "Paneer Tikka",
		categoryId: "c1",
		price: 240,
		emoji: "🧀",
		veg: true,
		available: true,
		soldToday: 34
	},
	{
		id: "p2",
		name: "Chicken 65",
		categoryId: "c1",
		price: 280,
		emoji: "🍗",
		veg: false,
		available: true,
		soldToday: 41
	},
	{
		id: "p3",
		name: "Veg Spring Rolls",
		categoryId: "c1",
		price: 180,
		emoji: "🥟",
		veg: true,
		available: true,
		soldToday: 12
	},
	{
		id: "p4",
		name: "Hyderabadi Chicken Biryani",
		categoryId: "c2",
		price: 320,
		emoji: "🍛",
		veg: false,
		available: true,
		soldToday: 58
	},
	{
		id: "p5",
		name: "Mutton Dum Biryani",
		categoryId: "c2",
		price: 420,
		emoji: "🍖",
		veg: false,
		available: true,
		soldToday: 22
	},
	{
		id: "p6",
		name: "Veg Biryani",
		categoryId: "c2",
		price: 240,
		emoji: "🍚",
		veg: true,
		available: true,
		soldToday: 19
	},
	{
		id: "p7",
		name: "Butter Chicken",
		categoryId: "c3",
		price: 340,
		emoji: "🍲",
		veg: false,
		available: true,
		soldToday: 37
	},
	{
		id: "p8",
		name: "Dal Makhani",
		categoryId: "c3",
		price: 220,
		emoji: "🥘",
		veg: true,
		available: true,
		soldToday: 29
	},
	{
		id: "p9",
		name: "Kadai Paneer",
		categoryId: "c3",
		price: 260,
		emoji: "🍛",
		veg: true,
		available: false,
		soldToday: 8
	},
	{
		id: "p10",
		name: "Butter Naan",
		categoryId: "c4",
		price: 50,
		emoji: "🫓",
		veg: true,
		available: true,
		soldToday: 96
	},
	{
		id: "p11",
		name: "Garlic Naan",
		categoryId: "c4",
		price: 60,
		emoji: "🧄",
		veg: true,
		available: true,
		soldToday: 71
	},
	{
		id: "p12",
		name: "Tandoori Roti",
		categoryId: "c4",
		price: 30,
		emoji: "🫓",
		veg: true,
		available: true,
		soldToday: 44
	},
	{
		id: "p13",
		name: "Mango Lassi",
		categoryId: "c5",
		price: 120,
		emoji: "🥭",
		veg: true,
		available: true,
		soldToday: 33
	},
	{
		id: "p14",
		name: "Masala Chai",
		categoryId: "c5",
		price: 40,
		emoji: "☕",
		veg: true,
		available: true,
		soldToday: 52
	},
	{
		id: "p15",
		name: "Fresh Lime Soda",
		categoryId: "c5",
		price: 90,
		emoji: "🍋",
		veg: true,
		available: true,
		soldToday: 26
	},
	{
		id: "p16",
		name: "Gulab Jamun",
		categoryId: "c6",
		price: 110,
		emoji: "🍡",
		veg: true,
		available: true,
		soldToday: 31
	},
	{
		id: "p17",
		name: "Rasmalai",
		categoryId: "c6",
		price: 140,
		emoji: "🍮",
		veg: true,
		available: true,
		soldToday: 18
	}
];
var tables = Array.from({ length: 12 }, (_, i) => {
	const status = [
		"available",
		"occupied",
		"reserved",
		"occupied",
		"available",
		"available",
		"reserved",
		"occupied",
		"available",
		"occupied",
		"available",
		"available"
	][i];
	return {
		id: `t${i + 1}`,
		name: `T${String(i + 1).padStart(2, "0")}`,
		seats: [
			2,
			4,
			4,
			6,
			2,
			4,
			8,
			4,
			2,
			6,
			4,
			2
		][i],
		status,
		reservedFor: status === "reserved" ? ["Mehta · 8:30 PM", "Iyer · 9:00 PM"][i % 2] : void 0
	};
});
var customers = [
	{
		id: "u1",
		name: "Aarav Sharma",
		email: "aarav@mail.com",
		visits: 14,
		totalSpent: 12840,
		lastVisit: "2026-09-24"
	},
	{
		id: "u2",
		name: "Priya Nair",
		email: "priya.n@mail.com",
		visits: 9,
		totalSpent: 7420,
		lastVisit: "2026-09-23"
	},
	{
		id: "u3",
		name: "Rohan Gupta",
		visits: 3,
		totalSpent: 2150,
		lastVisit: "2026-09-20"
	},
	{
		id: "u4",
		name: "Ananya Iyer",
		email: "ananya@mail.com",
		visits: 21,
		totalSpent: 19870,
		lastVisit: "2026-09-24"
	},
	{
		id: "u5",
		name: "Kabir Mehta",
		visits: 6,
		totalSpent: 4960,
		lastVisit: "2026-09-18"
	},
	{
		id: "u6",
		name: "Sneha Reddy",
		email: "sneha.r@mail.com",
		visits: 11,
		totalSpent: 9310,
		lastVisit: "2026-09-22"
	}
];
function mk(n, items, extra) {
	const its = items.map(([pid, qty]) => {
		const p = products.find((x) => x.id === pid);
		return {
			productId: pid,
			name: p.name,
			price: p.price,
			qty
		};
	});
	const subtotal = its.reduce((s, i) => s + i.price * i.qty, 0);
	return {
		id: `o${n}`,
		number: n,
		items: its,
		subtotal,
		tax: 0,
		total: subtotal,
		status: "completed",
		paymentStatus: "paid",
		paymentMethod: "upi",
		type: "dine-in",
		createdAt: (/* @__PURE__ */ new Date(Date.now() - (1050 - n) * 6 * 6e4)).toISOString(),
		...extra
	};
}
var orders = [
	mk(1042, [
		["p4", 2],
		["p10", 3],
		["p13", 2]
	], {
		tableId: "t2",
		customerId: "u1",
		status: "preparing",
		paymentStatus: "unpaid",
		paymentMethod: void 0
	}),
	mk(1041, [
		["p7", 1],
		["p11", 2],
		["p14", 2]
	], {
		tableId: "t4",
		customerId: "u4",
		status: "pending",
		paymentStatus: "unpaid",
		paymentMethod: void 0
	}),
	mk(1040, [["p2", 1], ["p5", 1]], {
		tableId: "t8",
		status: "pending",
		paymentStatus: "unpaid",
		paymentMethod: void 0
	}),
	mk(1039, [
		["p1", 1],
		["p8", 1],
		["p12", 4]
	], {
		tableId: "t10",
		customerId: "u2",
		status: "preparing",
		paymentStatus: "unpaid",
		paymentMethod: void 0
	}),
	mk(1038, [["p4", 1], ["p16", 2]], {
		customerId: "u3",
		type: "takeaway",
		paymentMethod: "cash"
	}),
	mk(1037, [["p6", 2], ["p15", 2]], {
		customerId: "u6",
		paymentMethod: "upi"
	}),
	mk(1036, [["p9", 1], ["p10", 2]], {
		status: "cancelled",
		paymentStatus: "refunded",
		paymentMethod: "upi"
	}),
	mk(1035, [
		["p7", 2],
		["p11", 4],
		["p17", 2]
	], { customerId: "u4" }),
	mk(1034, [["p3", 2], ["p13", 1]], {
		customerId: "u5",
		type: "takeaway",
		paymentMethod: "cash"
	}),
	mk(1033, [["p2", 2], ["p14", 3]], {
		customerId: "u1",
		paymentMethod: "upi"
	})
];
var hourlySales = [
	{
		hour: "11a",
		sales: 2400
	},
	{
		hour: "12p",
		sales: 6800
	},
	{
		hour: "1p",
		sales: 11200
	},
	{
		hour: "2p",
		sales: 8900
	},
	{
		hour: "3p",
		sales: 3200
	},
	{
		hour: "4p",
		sales: 2100
	},
	{
		hour: "5p",
		sales: 3900
	},
	{
		hour: "6p",
		sales: 7400
	},
	{
		hour: "7p",
		sales: 12600
	},
	{
		hour: "8p",
		sales: 14800
	},
	{
		hour: "9p",
		sales: 9700
	}
];
var supabaseUrl = "https://gxwarlojidcebchmxkpz.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d2FybG9qaWRjZWJjaG14a3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MjI1NzksImV4cCI6MjEwNTk5ODU3OX0.8ICJuZsQyeqKlenIkN9AUVuBtwA8mAMciQN3ljUyotk";
var isSupabaseConfigured = Boolean(supabaseAnonKey);
var supabase$1 = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
/**
* Helper to fetch today's total earnings directly from Supabase DB or return null if unconfigured
*/
async function fetchTodayEarningsFromSupabase() {
	if (!supabase$1) return null;
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const { data, error } = await supabase$1.from("orders").select("total, subtotal, tax").eq("payment_status", "paid").gte("created_at", `${today}T00:00:00Z`);
	if (error) {
		console.error("Error fetching today's earnings from Supabase:", error);
		return null;
	}
	const gross = data.reduce((acc, row) => acc + Number(row.subtotal || 0), 0);
	const tax = data.reduce((acc, row) => acc + Number(row.tax || 0), 0);
	const total = data.reduce((acc, row) => acc + Number(row.total || 0), 0);
	return {
		orderCount: data.length,
		gross,
		tax,
		total
	};
}
/**
* Sync customer details to Supabase database
*/
async function syncCustomerToSupabase(customer) {
	if (!supabase$1) return false;
	try {
		const { error } = await supabase$1.from("customers").upsert({
			id: customer.id,
			name: customer.name,
			phone: customer.phone,
			email: customer.email || null,
			visits: customer.visits || 1,
			total_spent: customer.totalSpent || 0,
			last_visit: customer.lastVisit || (/* @__PURE__ */ new Date()).toISOString()
		});
		if (error) {
			console.error("Failed to sync customer to Supabase:", error);
			return false;
		}
		return true;
	} catch (err) {
		console.error("Supabase customer sync error:", err);
		return false;
	}
}
/**
* Sync a newly completed billing order directly into Supabase
*/
async function syncOrderToSupabase(order) {
	if (!supabase$1) return false;
	try {
		const { error: orderError } = await supabase$1.from("orders").upsert({
			id: order.id,
			number: order.number,
			table_id: order.tableId || null,
			customer_id: order.customerId || null,
			subtotal: order.subtotal,
			tax: order.tax,
			total: order.total,
			status: order.status,
			payment_status: order.paymentStatus,
			payment_method: order.paymentMethod || null,
			order_type: order.type || "dine-in",
			created_at: order.createdAt || (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "id" });
		if (orderError) {
			console.error("Failed to sync order to Supabase:", orderError);
			return false;
		}
		if (order.items && order.items.length > 0) {
			await supabase$1.from("order_items").delete().eq("order_id", order.id);
			const lineItems = order.items.map((item) => ({
				order_id: order.id,
				product_id: item.productId || null,
				name: item.name,
				price: item.price,
				qty: item.qty
			}));
			const { error: itemsError } = await supabase$1.from("order_items").insert(lineItems);
			if (itemsError) console.error("Failed to sync order items to Supabase:", itemsError);
		}
		return true;
	} catch (err) {
		console.error("Supabase sync exception:", err);
		return false;
	}
}
/**
* Fetch all billing orders from Supabase database to hydrate state on load/refresh
*/
async function fetchOrdersFromSupabase() {
	if (!supabase$1) return null;
	try {
		const { data: ordersData, error: ordersError } = await supabase$1.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
		if (ordersError || !ordersData) {
			console.error("Error fetching orders from Supabase:", ordersError);
			return null;
		}
		return ordersData.map((o) => ({
			id: o.id,
			number: o.number,
			tableId: o.table_id || void 0,
			customerId: o.customer_id || void 0,
			subtotal: Number(o.subtotal || 0),
			tax: Number(o.tax || 0),
			total: Number(o.total || 0),
			status: o.status || "pending",
			paymentStatus: o.payment_status || "unpaid",
			paymentMethod: o.payment_method || void 0,
			type: o.order_type || (o.table_id ? "dine-in" : "takeaway"),
			createdAt: o.created_at || (/* @__PURE__ */ new Date()).toISOString(),
			items: (o.order_items || []).map((item) => ({
				productId: item.product_id || "",
				name: item.name || "Item",
				price: Number(item.price || 0),
				qty: Number(item.qty || 1)
			}))
		}));
	} catch (err) {
		console.error("Fetch orders exception:", err);
		return null;
	}
}
/**
* Sync product item to Supabase database (Insert or Update)
*/
async function syncProductToSupabase(product) {
	if (!supabase$1) return false;
	try {
		const { error } = await supabase$1.from("products").upsert({
			id: product.id,
			name: product.name,
			category_id: product.categoryId || null,
			price: product.price,
			emoji: product.emoji || "🍲",
			veg: Boolean(product.veg),
			available: product.available !== void 0 ? Boolean(product.available) : true,
			sold_today: product.soldToday || 0
		}, { onConflict: "id" });
		if (error) {
			console.error("Failed to sync product to Supabase:", error);
			return false;
		}
		return true;
	} catch (err) {
		console.error("Supabase product sync exception:", err);
		return false;
	}
}
/**
* Delete product item from Supabase database
*/
async function deleteProductFromSupabase(productId) {
	if (!supabase$1) return false;
	try {
		const { error } = await supabase$1.from("products").delete().eq("id", productId);
		if (error) {
			console.error("Failed to delete product from Supabase:", error);
			return false;
		}
		return true;
	} catch (err) {
		console.error("Supabase product delete exception:", err);
		return false;
	}
}
/**
* Sync menu category to Supabase database
*/
async function syncCategoryToSupabase(category) {
	if (!supabase$1) return false;
	try {
		const { error } = await supabase$1.from("categories").upsert({
			id: category.id,
			name: category.name,
			emoji: category.emoji || "🍽️",
			display_order: category.displayOrder || 0
		}, { onConflict: "id" });
		if (error) {
			console.error("Failed to sync category to Supabase:", error);
			return false;
		}
		return true;
	} catch (err) {
		console.error("Supabase category sync exception:", err);
		return false;
	}
}
/**
* Fetch products from Supabase to hydrate state
*/
async function fetchProductsFromSupabase() {
	if (!supabase$1) return null;
	try {
		const { data, error } = await supabase$1.from("products").select("*").order("name");
		if (error || !data) return null;
		return data.map((p) => ({
			id: p.id,
			name: p.name,
			categoryId: p.category_id || "",
			price: Number(p.price || 0),
			emoji: p.emoji || "🍲",
			veg: Boolean(p.veg),
			available: Boolean(p.available),
			soldToday: Number(p.sold_today || 0)
		}));
	} catch (err) {
		console.error("Fetch products exception:", err);
		return null;
	}
}
var Ctx = (0, import_react.createContext)(null);
var loadStored = (key, fallback) => {
	if (typeof window === "undefined") return fallback;
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : fallback;
	} catch {
		return fallback;
	}
};
function PosProvider({ children }) {
	const [cart, setCart] = (0, import_react.useState)([]);
	const [tableId, setTableId] = (0, import_react.useState)();
	const [customerId, setCustomerId] = (0, import_react.useState)();
	const [orders$1, setOrders] = (0, import_react.useState)(orders);
	const [tables$1, setTables] = (0, import_react.useState)(tables);
	const [products$1, setProducts] = (0, import_react.useState)(products);
	const [customers$1, setCustomers] = (0, import_react.useState)(customers);
	(0, import_react.useEffect)(() => {
		setOrders(loadStored("res_pos_orders", orders));
		setTables(loadStored("res_pos_tables", tables));
		setProducts(loadStored("res_pos_products", products));
		setCustomers(loadStored("res_pos_customers", customers));
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("res_pos_orders", JSON.stringify(orders$1));
		} catch (e) {
			console.error("Failed to save orders to localStorage:", e);
		}
	}, [orders$1]);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("res_pos_tables", JSON.stringify(tables$1));
		} catch (e) {
			console.error("Failed to save tables to localStorage:", e);
		}
	}, [tables$1]);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("res_pos_customers", JSON.stringify(customers$1));
		} catch (e) {
			console.error("Failed to save customers to localStorage:", e);
		}
	}, [customers$1]);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		const loadData = () => {
			if (isSupabaseConfigured) {
				fetchOrdersFromSupabase().then((remoteOrders) => {
					if (isMounted && remoteOrders && Array.isArray(remoteOrders) && remoteOrders.length > 0) setOrders((localOrders) => {
						const map = /* @__PURE__ */ new Map();
						(localOrders || []).forEach((lo) => lo && lo.id && map.set(lo.id, lo));
						remoteOrders.forEach((ro) => {
							if (!ro || !ro.id) return;
							const local = map.get(ro.id);
							if (local && local.paymentStatus === "paid" && ro.paymentStatus === "unpaid") {
								const merged = {
									...ro,
									paymentStatus: "paid",
									paymentMethod: local.paymentMethod || ro.paymentMethod,
									status: "completed"
								};
								map.set(ro.id, merged);
								syncOrderToSupabase(merged);
							} else map.set(ro.id, ro);
						});
						return Array.from(map.values()).sort((a, b) => {
							const timeA = a && a.createdAt ? new Date(a.createdAt).getTime() || 0 : 0;
							return (b && b.createdAt ? new Date(b.createdAt).getTime() || 0 : 0) - timeA;
						});
					});
				});
				fetchProductsFromSupabase().then((remoteProducts) => {
					if (isMounted && remoteProducts && Array.isArray(remoteProducts) && remoteProducts.length > 0) setProducts((localProds) => {
						const map = /* @__PURE__ */ new Map();
						(localProds || []).forEach((p) => p && p.id && map.set(p.id, p));
						remoteProducts.forEach((rp) => rp && rp.id && map.set(rp.id, rp));
						return Array.from(map.values());
					});
				});
			}
		};
		loadData();
		let channel = null;
		if (isSupabaseConfigured && supabase) channel = supabase.channel("pos-ledger-realtime").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "orders"
		}, () => {
			loadData();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "products"
		}, () => {
			loadData();
		}).subscribe();
		const interval = setInterval(() => {
			loadData();
		}, 5e3);
		return () => {
			isMounted = false;
			clearInterval(interval);
			if (channel && supabase) supabase.removeChannel(channel);
		};
	}, []);
	const totals = (0, import_react.useMemo)(() => {
		const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
		return {
			subtotal,
			tax: 0,
			total: subtotal,
			count: cart.reduce((s, i) => s + i.qty, 0)
		};
	}, [cart]);
	const value = {
		cart,
		tableId,
		setTableId,
		customerId,
		setCustomerId,
		totals,
		orders: orders$1,
		tables: tables$1,
		products: products$1,
		customers: customers$1,
		setProducts,
		setTables,
		addCustomer: (newC) => {
			const existing = customers$1.find((c) => c.name.toLowerCase() === newC.name.toLowerCase());
			if (existing) {
				setCustomerId(existing.id);
				return existing;
			}
			const newCust = {
				id: `u${Date.now()}`,
				name: newC.name,
				email: newC.email,
				visits: 1,
				totalSpent: 0,
				lastVisit: (/* @__PURE__ */ new Date()).toISOString()
			};
			setCustomers((cs) => [newCust, ...cs]);
			setCustomerId(newCust.id);
			syncCustomerToSupabase(newCust);
			return newCust;
		},
		add: (p) => setCart((c) => {
			return c.find((i) => i.productId === p.id) ? c.map((i) => i.productId === p.id ? {
				...i,
				qty: i.qty + 1
			} : i) : [...c, {
				productId: p.id,
				name: p.name,
				price: p.price,
				qty: 1
			}];
		}),
		setQty: (id, qty) => setCart((c) => qty <= 0 ? c.filter((i) => i.productId !== id) : c.map((i) => i.productId === id ? {
			...i,
			qty
		} : i)),
		clearCart: () => {
			setCart([]);
			setCustomerId(void 0);
		},
		placeOrder: () => {
			if (!cart.length) return null;
			const number = Math.max(...orders$1.map((o) => o.number), 1e3) + 1;
			const o = {
				id: `o${number}`,
				number,
				items: cart,
				...totals,
				tableId,
				customerId,
				status: "pending",
				paymentStatus: "unpaid",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				type: tableId ? "dine-in" : "takeaway"
			};
			setOrders((os) => [o, ...os]);
			if (tableId) setTables((ts) => ts.map((t) => t.id === tableId ? {
				...t,
				status: "occupied",
				orderId: o.id
			} : t));
			setCart([]);
			setTableId(void 0);
			setCustomerId(void 0);
			syncOrderToSupabase(o);
			return o;
		},
		payOrder: (id, method) => {
			let updatedOrder = null;
			setOrders((os) => os.map((o) => {
				if (o.id === id) {
					updatedOrder = {
						...o,
						paymentStatus: "paid",
						paymentMethod: method,
						status: o.status === "cancelled" ? o.status : "completed"
					};
					return updatedOrder;
				}
				return o;
			}));
			setTables((ts) => ts.map((t) => t.orderId === id ? {
				...t,
				status: "available",
				orderId: void 0
			} : t));
			if (updatedOrder) {
				const ord = updatedOrder;
				if (ord.customerId) setCustomers((cs) => cs.map((c) => {
					if (c.id === ord.customerId) {
						const updatedCustomer = {
							...c,
							visits: c.visits + 1,
							totalSpent: c.totalSpent + ord.total,
							lastVisit: (/* @__PURE__ */ new Date()).toISOString()
						};
						syncCustomerToSupabase(updatedCustomer);
						return updatedCustomer;
					}
					return c;
				}));
				syncOrderToSupabase(ord);
			}
		},
		setOrderStatus: (id, s) => setOrders((os) => os.map((o) => {
			const updated = o.id === id ? {
				...o,
				status: s
			} : o;
			if (o.id === id) syncOrderToSupabase(updated);
			return updated;
		}))
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function usePos() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("usePos must be used within PosProvider");
	return c;
}
var DEFAULT_STAFF = {
	name: "Mansoor Ahmed",
	role: "Manager",
	email: "mansoor@spiceroute.in",
	shift: "Morning Shift"
};
function getActiveStaff() {
	if (typeof window === "undefined") return DEFAULT_STAFF;
	try {
		const saved = localStorage.getItem("pos_active_staff");
		if (saved) return JSON.parse(saved);
	} catch (e) {
		console.error("Error reading staff session:", e);
	}
	return DEFAULT_STAFF;
}
function setActiveStaff(staff) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem("pos_active_staff", JSON.stringify(staff));
	} catch (e) {
		console.error("Error saving staff session:", e);
	}
}
function getStaffInitials(name) {
	if (!name) return "ST";
	const parts = name.trim().split(" ");
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
	return name.slice(0, 2).toUpperCase();
}
var nav = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/pos",
		label: "New Order",
		icon: ShoppingBag
	},
	{
		to: "/tables",
		label: "Tables",
		icon: Armchair
	},
	{
		to: "/orders",
		label: "Orders",
		icon: ClipboardList
	},
	{
		to: "/menu",
		label: "Menu",
		icon: UtensilsCrossed
	},
	{
		to: "/customers",
		label: "Customers",
		icon: Users
	},
	{
		to: "/payments",
		label: "Payments",
		icon: CreditCard
	},
	{
		to: "/powerbi",
		label: "Power BI Analytics",
		icon: ChartColumn
	}
];
function Logo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-[var(--shadow-lift)]",
			children: "T"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-extrabold text-foreground",
				children: "Tan's Kitchen"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: "Spice Route Kitchen"
			})]
		})]
	});
}
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [staff, setStaff] = (0, import_react.useState)(getActiveStaff());
	(0, import_react.useEffect)(() => {
		setStaff(getActiveStaff());
	}, []);
	const side = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full w-64 flex-col border-r bg-sidebar p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-2 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mt-6 flex flex-1 flex-col gap-1",
				children: nav.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					onClick: () => setOpen(false),
					activeOptions: { exact: to === "/" },
					className: "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
					activeProps: { className: "!bg-sidebar-accent !text-sidebar-accent-foreground" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), label]
				}, to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-xl bg-muted p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-9 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground uppercase shadow-sm",
						children: getStaffInitials(staff.name)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold truncate text-foreground",
							children: staff.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground font-medium",
							children: staff.role
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						"aria-label": "Log out",
						title: "Log out / Switch Staff",
						className: "text-muted-foreground hover:text-destructive transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-print sticky top-0 hidden h-screen lg:block",
				children: side
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-foreground/40",
					onClick: () => setOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-full w-64",
					children: side
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "no-print sticky top-0 z-40 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(!open),
						"aria-label": "Menu",
						className: "rounded-lg p-2 hover:bg-muted",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto max-w-[1400px] p-4 md:p-8",
					children
				})]
			})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
function PageHeader({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-extrabold tracking-tight md:text-3xl",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: subtitle
		})] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: actions
		})]
	});
}
var badgeTones = {
	available: "bg-success-soft text-success",
	paid: "bg-success-soft text-success",
	completed: "bg-success-soft text-success",
	occupied: "bg-primary-soft text-accent-foreground",
	preparing: "bg-info-soft text-info",
	reserved: "bg-warning-soft text-warning",
	pending: "bg-warning-soft text-warning",
	unpaid: "bg-warning-soft text-warning",
	cancelled: "bg-danger-soft text-destructive",
	refunded: "bg-danger-soft text-destructive"
};
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize", badgeTones[status] ?? "bg-muted text-muted-foreground"),
		children: status
	});
}
function VegMark({ veg }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("grid size-4 place-items-center rounded-[3px] border-2", veg ? "border-success" : "border-destructive"),
		"aria-label": veg ? "Veg" : "Non-veg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", veg ? "bg-success" : "bg-destructive") })
	});
}
function EmptyState({ title, text, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-14 place-items-center rounded-full bg-primary-soft text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 font-bold",
				children: title
			}),
			text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xs text-sm text-muted-foreground",
				children: text
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			})
		]
	});
}
function ErrorState({ onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center rounded-2xl bg-danger-soft p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-7 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-bold",
				children: "Couldn't load data"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Check your connection and try again."
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onRetry,
				className: "mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-4" }), "Retry"]
			})
		]
	});
}
function LoadingGrid({ count = 6, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className),
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" }, i))
	});
}
//#endregion
export { syncProductToSupabase as C, syncCategoryToSupabase as S, usePos as T, hourlySales as _, Logo as a, products as b, Skeleton as c, categories as d, cn as f, getActiveStaff as g, fetchTodayEarningsFromSupabase as h, LoadingGrid as i, StatusBadge as l, deleteProductFromSupabase as m, EmptyState as n, PageHeader as o, customers as p, ErrorState as r, PosProvider as s, AppShell as t, VegMark as u, isSupabaseConfigured as v, tables as w, setActiveStaff as x, orders as y };
