import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as mock from "./mock-data";
import { 
  supabase, syncOrderToSupabase, syncCustomerToSupabase, 
  fetchOrdersFromSupabase, fetchProductsFromSupabase, fetchTablesFromSupabase,
  syncTableToSupabase, syncAllTablesToSupabase, deleteTableFromSupabase,
  isSupabaseConfigured 
} from "./supabase";
import type { Customer, Order, OrderItem, OrderStatus, PaymentMethod, Product, RestaurantTable } from "./types";
import { consolidateOrderItems } from "./utils";

interface Store {
  cart: OrderItem[];
  tableId?: string | undefined;
  customerId?: string | undefined;
  setTableId: (id?: string | undefined) => void;
  setCustomerId: (id?: string | undefined) => void;
  addCustomer: (c: { name: string; email?: string | undefined }) => Customer;
  add: (p: Product) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  clearAllOrders: () => void;
  resetToOfficialMenu: () => void;
  totals: { subtotal: number; tax: number; total: number; count: number };
  orders: Order[];
  tables: RestaurantTable[];
  products: Product[];
  customers: Customer[];
  setProducts: (fn: (p: Product[]) => Product[]) => void;
  placeOrder: (paidWithMethod?: PaymentMethod) => Order | null;
  payOrder: (id: string, method: PaymentMethod) => void;
  setOrderStatus: (id: string, s: OrderStatus) => void;
  setTables: (fn: (t: RestaurantTable[]) => RestaurantTable[]) => void;
}

const Ctx = createContext<Store | null>(null);

const CURRENT_MENU_VERSION = "meat_theory_v6_bespoke_local_photos";

// Helper for initial localStorage loading
const loadStored = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export function PosProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [tableId, setTableId] = useState<string | undefined>();
  const [customerId, setCustomerId] = useState<string | undefined>();

  // Hydrate initial state safely for SSR & Client (Start clean with 0 orders)
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>(mock.tables);
  const [products, setProducts] = useState<Product[]>(mock.products);
  const [customers, setCustomers] = useState<Customer[]>(mock.customers);

  // Client-side hydration from localStorage after mount
  useEffect(() => {
    const rawStoredOrders = loadStored<Order[]>("res_pos_orders", []);
    const cleanOrders = (rawStoredOrders || []).filter((o) => {
      if (!o || !o.id) return false;
      const isLegacyId = /^o10[3-9]\d|^o11[0-1]\d/.test(o.id);
      const isOldDate = o.createdAt ? new Date(o.createdAt).getTime() < new Date("2026-10-22T17:00:00Z").getTime() : false;
      const hasOldDishes = o.items?.some((it) =>
        ["Paneer Tikka", "Butter Chicken", "Chicken 65", "Veg Spring Rolls", "Gulab Jamun", "Dal Makhani", "Rasmalai", "Mutton Dum Biryani", "Hyderabadi Chicken Biryani"].includes(it.name)
      );
      return !isLegacyId && !isOldDate && !hasOldDishes;
    });
    setOrders(cleanOrders);
    setTables(loadStored("res_pos_tables", mock.tables));
    
    // Check if stored products are from the old catalog or version is missing/outdated
    const storedVer = typeof window !== "undefined" ? localStorage.getItem("res_pos_menu_ver") : null;
    const storedProds = loadStored<Product[]>("res_pos_products", mock.products);
    const hasOldItems = Array.isArray(storedProds) && (
      storedProds.some((p) => p.id === "p1" || p.name === "Paneer Tikka" || p.name === "Butter Chicken" || p.name === "Dal Makhani") ||
      storedProds.length === 0
    );

    if (storedVer !== CURRENT_MENU_VERSION || hasOldItems) {
      setProducts(mock.products);
      try {
        localStorage.setItem("res_pos_products", JSON.stringify(mock.products));
        localStorage.setItem("res_pos_menu_ver", CURRENT_MENU_VERSION);
      } catch (e) {
        console.error("Failed to migrate products:", e);
      }
    } else {
      setProducts(storedProds);
    }

    setCustomers(loadStored("res_pos_customers", mock.customers));
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("res_pos_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders to localStorage:", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("res_pos_tables", JSON.stringify(tables));
    } catch (e) {
      console.error("Failed to save tables to localStorage:", e);
    }
  }, [tables]);

  useEffect(() => {
    try {
      localStorage.setItem("res_pos_customers", JSON.stringify(customers));
    } catch (e) {
      console.error("Failed to save customers to localStorage:", e);
    }
  }, [customers]);

  // Fetch live orders, products, tables & subscribe to Supabase Realtime changes
  useEffect(() => {
    let isMounted = true;

    const loadData = () => {
      if (isSupabaseConfigured) {
        fetchOrdersFromSupabase().then((remoteOrders) => {
          if (isMounted && remoteOrders && Array.isArray(remoteOrders) && remoteOrders.length > 0) {
            setOrders((localOrders) => {
              const map = new Map<string, Order>();
              (localOrders || []).forEach((lo) => {
                if (lo && lo.id && !/^o10[3-9]\d|^o11[0-1]\d/.test(lo.id)) {
                  map.set(lo.id, lo);
                }
              });
              remoteOrders.forEach((ro: Order) => {
                if (!ro || !ro.id || /^o10[3-9]\d|^o11[0-1]\d/.test(ro.id)) return;
                const local = map.get(ro.id);
                if (local && local.paymentStatus === "paid" && ro.paymentStatus === "unpaid") {
                  const merged = { ...ro, paymentStatus: "paid" as const, paymentMethod: local.paymentMethod || ro.paymentMethod, status: "completed" as const };
                  map.set(ro.id, merged);
                  syncOrderToSupabase(merged);
                } else {
                  map.set(ro.id, ro);
                }
              });
              return Array.from(map.values()).sort((a, b) => {
                const timeA = a && a.createdAt ? new Date(a.createdAt).getTime() || 0 : 0;
                const timeB = b && b.createdAt ? new Date(b.createdAt).getTime() || 0 : 0;
                return timeB - timeA;
              });
            });
          }
        });

        fetchProductsFromSupabase().then((remoteProducts) => {
          if (isMounted && remoteProducts && Array.isArray(remoteProducts) && remoteProducts.length > 0) {
            const cleaned = remoteProducts.filter((rp: Product) => 
              rp.id !== "p1" && rp.id !== "p2" && rp.name !== "Paneer Tikka" && rp.name !== "Butter Chicken" && rp.name !== "Dal Makhani"
            );
            if (cleaned.length > 0) {
              setProducts((localProds) => {
                const map = new Map<string, Product>();
                (localProds || []).forEach((p) => p && p.id && map.set(p.id, p));
                cleaned.forEach((rp: Product) => {
                  if (rp && rp.id) {
                    const existing = map.get(rp.id);
                    map.set(rp.id, {
                      ...rp,
                      image: rp.image || existing?.image || mock.getDefaultProductImage(rp),
                    });
                  }
                });
                return Array.from(map.values());
              });
            }
          }
        });

        fetchTablesFromSupabase().then((remoteTables) => {
          if (isMounted && remoteTables && Array.isArray(remoteTables) && remoteTables.length > 0) {
            setTables((localTables) => {
              const map = new Map<string, RestaurantTable>();
              (localTables || []).forEach((t) => t && t.id && map.set(t.id, t));
              remoteTables.forEach((rt: RestaurantTable) => {
                if (rt && rt.id) {
                  map.set(rt.id, rt);
                }
              });
              return Array.from(map.values());
            });
          }
        });
      }
    };

    // Initial load
    loadData();

    // 1. Supabase Realtime Subscription
    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel("pos-ledger-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
          loadData();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
          loadData();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "restaurant_tables" }, () => {
          loadData();
        })
        .subscribe();
    }

    // 2. Periodic 5-Second Live Background Polling as Backup
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const totals = useMemo(() => {
    const consolidated = consolidateOrderItems(cart);
    const subtotal = consolidated.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = 0; // Tax removed from subtotal
    return { subtotal, tax, total: subtotal, count: consolidated.reduce((s, i) => s + i.qty, 0) };
  }, [cart]);

  const value: Store = {
    cart, tableId, setTableId, customerId, setCustomerId, totals, orders, tables, products, customers, setProducts, setTables,
    addCustomer: (newC) => {
      const existing = customers.find((c) => c.name.toLowerCase() === newC.name.toLowerCase());
      if (existing) {
        setCustomerId(existing.id);
        return existing;
      }
      const newCust: Customer = {
        id: `u${Date.now()}`,
        name: newC.name,
        email: newC.email,
        visits: 1,
        totalSpent: 0,
        lastVisit: new Date().toISOString(),
      };
      setCustomers((cs) => [newCust, ...cs]);
      setCustomerId(newCust.id);
      syncCustomerToSupabase(newCust);
      return newCust;
    },
    add: (p) => setCart((c) => {
      const f = c.find((i) => i.productId === p.id || i.name.toLowerCase() === p.name.toLowerCase());
      return f 
        ? c.map((i) => ((i.productId === p.id || i.name.toLowerCase() === p.name.toLowerCase()) ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { productId: p.id, name: p.name, price: p.price, qty: 1 }];
    }),
    setQty: (id, qty) => setCart((c) => qty <= 0 ? c.filter((i) => i.productId !== id) : c.map((i) => (i.productId === id ? { ...i, qty } : i))),
    clearCart: () => {
      setCart([]);
      setCustomerId(undefined);
    },
    clearAllOrders: () => {
      setOrders([]);
      try {
        localStorage.removeItem("res_pos_orders");
      } catch (e) {
        console.error("Failed to clear local orders:", e);
      }
    },
    resetToOfficialMenu: () => {
      setProducts(mock.products);
      try {
        localStorage.setItem("res_pos_products", JSON.stringify(mock.products));
        localStorage.setItem("res_pos_menu_ver", CURRENT_MENU_VERSION);
      } catch (e) {
        console.error("Failed to reset menu:", e);
      }
    },
    placeOrder: (paidWithMethod?: PaymentMethod) => {
      if (!cart.length) return null;
      const consolidatedItems = consolidateOrderItems(cart);
      const subtotal = consolidatedItems.reduce((s, i) => s + i.price * i.qty, 0);
      const tax = 0;
      const total = subtotal + tax;
      const number = Math.max(...orders.map((o) => o.number), 1000) + 1;
      const isPaidDirectly = Boolean(paidWithMethod);
      const o: Order = {
        id: `o${number}`,
        number,
        items: consolidatedItems,
        subtotal,
        tax,
        total,
        tableId,
        customerId,
        status: isPaidDirectly ? "completed" : "pending",
        paymentStatus: isPaidDirectly ? "paid" : "unpaid",
        paymentMethod: paidWithMethod,
        createdAt: new Date().toISOString(),
        type: tableId ? "dine-in" : "takeaway",
      };
      setOrders((os) => [o, ...os]);
      if (tableId) {
        setTables((ts) => {
          const updated = ts.map((t) =>
            t.id === tableId
              ? { ...t, status: "occupied" as const, orderId: o.id }
              : t
          );
          const changed = updated.find((t) => t.id === tableId);
          if (changed) syncTableToSupabase(changed);
          return updated;
        });
      }
      
      // Update customer total spent & visits if linked and paid directly
      if (isPaidDirectly && customerId) {
        setCustomers((cs) =>
          cs.map((c) => {
            if (c.id === customerId) {
              const updatedCustomer = {
                ...c,
                visits: c.visits + 1,
                totalSpent: c.totalSpent + o.total,
                lastVisit: new Date().toISOString(),
              };
              syncCustomerToSupabase(updatedCustomer);
              return updatedCustomer;
            }
            return c;
          })
        );
      }

      // Reset cart and transient customer
      setCart([]); 
      setTableId(undefined);
      setCustomerId(undefined);
      
      syncOrderToSupabase(o);
      return o;
    },
    payOrder: (id, method) => {
      let updatedOrder: Order | null = null;
      setOrders((os) => os.map((o) => {
        if (o.id === id) {
          updatedOrder = { ...o, paymentStatus: "paid", paymentMethod: method, status: o.status === "cancelled" ? o.status : "completed" };
          return updatedOrder;
        }
        return o;
      }));
      setTables((ts) => {
        const ord = updatedOrder as Order | null;
        const updated = ts.map((t) =>
          (t.orderId === id || (ord?.tableId && t.id === ord.tableId))
            ? { ...t, status: "available" as const, orderId: undefined }
            : t
        );
        const freed = updated.filter((t) => t.orderId === id || (ord?.tableId && t.id === ord.tableId));
        freed.forEach((ft) => syncTableToSupabase(ft));
        return updated;
      });
      
      // Update customer total spent & visits if linked
      if (updatedOrder) {
        const ord = updatedOrder as Order;
        if (ord.customerId) {
          setCustomers((cs) => cs.map((c) => {
            if (c.id === ord.customerId) {
              const updatedCustomer = {
                ...c,
                visits: c.visits + 1,
                totalSpent: c.totalSpent + ord.total,
                lastVisit: new Date().toISOString(),
              };
              syncCustomerToSupabase(updatedCustomer);
              return updatedCustomer;
            }
            return c;
          }));
        }
        syncOrderToSupabase(ord);
      }
    },
    setOrderStatus: (id, s) => setOrders((os) => os.map((o) => {
      const updated = o.id === id ? { ...o, status: s } : o;
      if (o.id === id) syncOrderToSupabase(updated);
      return updated;
    })),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePos() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePos must be used within PosProvider");
  return c;
}
