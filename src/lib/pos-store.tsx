import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as mock from "./mock-data";
import { syncOrderToSupabase, syncCustomerToSupabase, fetchOrdersFromSupabase, fetchProductsFromSupabase, isSupabaseConfigured } from "./supabase";
import type { Customer, Order, OrderItem, OrderStatus, PaymentMethod, Product, RestaurantTable } from "./types";

interface Store {
  cart: OrderItem[];
  tableId?: string;
  customerId?: string;
  setTableId: (id?: string) => void;
  setCustomerId: (id?: string) => void;
  addCustomer: (c: { name: string; email?: string }) => Customer;
  add: (p: Product) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totals: { subtotal: number; tax: number; total: number; count: number };
  orders: Order[];
  tables: RestaurantTable[];
  products: Product[];
  customers: Customer[];
  setProducts: (fn: (p: Product[]) => Product[]) => void;
  placeOrder: () => Order | null;
  payOrder: (id: string, method: PaymentMethod) => void;
  setOrderStatus: (id: string, s: OrderStatus) => void;
  setTables: (fn: (t: RestaurantTable[]) => RestaurantTable[]) => void;
}

const Ctx = createContext<Store | null>(null);

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

  // Hydrate state from localStorage or mock defaults
  const [orders, setOrders] = useState<Order[]>(() => loadStored("res_pos_orders", mock.orders));
  const [tables, setTables] = useState<RestaurantTable[]>(() => loadStored("res_pos_tables", mock.tables));
  const [products, setProducts] = useState<Product[]>(() => loadStored("res_pos_products", mock.products));
  const [customers, setCustomers] = useState<Customer[]>(() => loadStored("res_pos_customers", mock.customers));

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

  // Fetch live orders & subscribe to Supabase Realtime changes
  useEffect(() => {
    let isMounted = true;

    const loadData = () => {
      if (isSupabaseConfigured) {
        fetchOrdersFromSupabase().then((remoteOrders) => {
          if (isMounted && remoteOrders && remoteOrders.length > 0) {
            setOrders((localOrders) => {
              const map = new Map<string, Order>();
              localOrders.forEach((lo) => map.set(lo.id, lo));
              remoteOrders.forEach((ro: Order) => {
                const local = map.get(ro.id);
                if (local && local.paymentStatus === "paid" && ro.paymentStatus === "unpaid") {
                  const merged = { ...ro, paymentStatus: "paid" as const, paymentMethod: local.paymentMethod || ro.paymentMethod, status: "completed" as const };
                  map.set(ro.id, merged);
                  syncOrderToSupabase(merged);
                } else {
                  map.set(ro.id, ro);
                }
              });
              return Array.from(map.values()).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            });
          }
        });

        fetchProductsFromSupabase().then((remoteProducts) => {
          if (isMounted && remoteProducts && remoteProducts.length > 0) {
            setProducts((localProds) => {
              const map = new Map<string, Product>();
              localProds.forEach((p) => map.set(p.id, p));
              remoteProducts.forEach((rp: Product) => map.set(rp.id, rp));
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
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = 0; // Tax removed from subtotal
    return { subtotal, tax, total: subtotal, count: cart.reduce((s, i) => s + i.qty, 0) };
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
      const f = c.find((i) => i.productId === p.id);
      return f ? c.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { productId: p.id, name: p.name, price: p.price, qty: 1 }];
    }),
    setQty: (id, qty) => setCart((c) => qty <= 0 ? c.filter((i) => i.productId !== id) : c.map((i) => (i.productId === id ? { ...i, qty } : i))),
    clearCart: () => {
      setCart([]);
      setCustomerId(undefined);
    },
    placeOrder: () => {
      if (!cart.length) return null;
      const number = Math.max(...orders.map((o) => o.number), 1000) + 1;
      const o: Order = {
        id: `o${number}`, number, items: cart, ...totals, tableId, customerId, status: "pending", paymentStatus: "unpaid",
        createdAt: new Date().toISOString(), type: tableId ? "dine-in" : "takeaway",
      };
      setOrders((os) => [o, ...os]);
      if (tableId) setTables((ts) => ts.map((t) => (t.id === tableId ? { ...t, status: "occupied", orderId: o.id } : t)));
      
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
      setTables((ts) => ts.map((t) => (t.orderId === id ? { ...t, status: "available", orderId: undefined } : t)));
      
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
