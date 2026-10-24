import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as mock from "./mock-data";
import { 
  supabase, syncOrderToSupabase, syncCustomerToSupabase, 
  fetchOrdersFromSupabase, fetchProductsFromSupabase, fetchTablesFromSupabase,
  syncTableToSupabase, syncAllTablesToSupabase, deleteTableFromSupabase,
  deleteOrderFromSupabase,
  isSupabaseConfigured 
} from "./supabase";
import type { Customer, Order, OrderItem, OrderStatus, PaymentMethod, Product, RestaurantTable } from "./types";
import { consolidateOrderItems } from "./utils";
import { playKitchenBellSound } from "./sound";

/**
 * Auto-merge multiple unpaid orders for the same table into a single unified bill.
 * Preserves the original order number, combines all items, and deletes secondary order duplicates.
 */
export function mergeDuplicateTableOrders(ordersList: Order[]): {
  cleanedOrders: Order[];
  ordersToSync: Order[];
  ordersToDelete: string[];
} {
  if (!ordersList || !Array.isArray(ordersList)) {
    return { cleanedOrders: [], ordersToSync: [], ordersToDelete: [] };
  }

  const tableUnpaidMap = new Map<string, Order[]>();
  const ordersToSync: Order[] = [];
  const ordersToDelete: string[] = [];

  // Group unpaid dine-in orders by tableId
  ordersList.forEach((o) => {
    if (o && o.tableId && o.paymentStatus === "unpaid" && o.status !== "cancelled") {
      const arr = tableUnpaidMap.get(o.tableId) || [];
      arr.push(o);
      tableUnpaidMap.set(o.tableId, arr);
    }
  });

  const idsToRemove = new Set<string>();

  tableUnpaidMap.forEach((tableOrders) => {
    if (tableOrders.length > 1) {
      // Sort so earliest order is first (lowest number or earliest createdAt)
      tableOrders.sort((a, b) => {
        const numDiff = (a.number || 0) - (b.number || 0);
        if (numDiff !== 0) return numDiff;
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      });

      const primary = { ...tableOrders[0] };
      const others = tableOrders.slice(1);

      // Collect all items from primary and other duplicates
      const allItems = [...(primary.items || [])];
      others.forEach((other) => {
        if (other.items && Array.isArray(other.items)) {
          allItems.push(...other.items);
        }
        idsToRemove.add(other.id);
        ordersToDelete.push(other.id);
      });

      const consolidated = consolidateOrderItems(allItems);
      const subtotal = consolidated.reduce((sum, i) => sum + i.price * i.qty, 0);
      const total = subtotal;

      primary.items = consolidated;
      primary.subtotal = subtotal;
      primary.tax = 0;
      primary.total = total;

      ordersToSync.push(primary);
    }
  });

  const cleanedOrders = ordersList
    .filter((o) => !idsToRemove.has(o.id))
    .map((o) => {
      const synced = ordersToSync.find((s) => s.id === o.id);
      return synced || o;
    });

  return { cleanedOrders, ordersToSync, ordersToDelete };
}

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

  // Audio & kitchen notification tracking refs
  const previousOrderCountsRef = useRef<Map<string, number>>(new Map());
  const isInitialOrdersLoadedRef = useRef<boolean>(false);

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
    const mergedInitial = mergeDuplicateTableOrders(cleanOrders);
    setOrders(mergedInitial.cleanedOrders);
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
            // Check for new incoming orders or added food items to trigger kitchen bell chime
            const currentCounts = new Map<string, number>();
            remoteOrders.forEach((ro) => {
              if (ro && ro.id && ro.status !== "cancelled") {
                const totalItems = (ro.items || []).reduce((sum, item) => sum + (item.qty || 1), 0);
                currentCounts.set(ro.id, totalItems);
              }
            });

            if (isInitialOrdersLoadedRef.current) {
              let detectedNewFood = false;
              for (const [orderId, count] of currentCounts.entries()) {
                const prev = previousOrderCountsRef.current.get(orderId);
                if (prev === undefined) {
                  detectedNewFood = true;
                  break;
                } else if (count > prev) {
                  detectedNewFood = true;
                  break;
                }
              }
              if (detectedNewFood) {
                playKitchenBellSound();
              }
            } else {
              isInitialOrdersLoadedRef.current = true;
            }
            previousOrderCountsRef.current = currentCounts;

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
                } else if (local && local.items && local.items.length > 0 && (!ro.items || ro.items.length === 0)) {
                  map.set(ro.id, { ...ro, items: local.items });
                } else {
                  map.set(ro.id, ro);
                }
              });

              // Auto-merge duplicate active unpaid orders for the same table
              const mergedRemote = mergeDuplicateTableOrders(Array.from(map.values()));
              mergedRemote.ordersToDelete.forEach((delId) => deleteOrderFromSupabase(delId));
              mergedRemote.ordersToSync.forEach((syncOrd) => syncOrderToSupabase(syncOrd));

              return mergedRemote.cleanedOrders.sort((a, b) => {
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
        .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, () => {
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
      const isPaidDirectly = Boolean(paidWithMethod);

      // Check if this table already has an active unpaid order (Dine-in add-on flow)
      const existingTableOrder = tableId
        ? orders.find((o) => o.tableId === tableId && o.paymentStatus === "unpaid" && o.status !== "cancelled")
        : null;

      if (existingTableOrder) {
        // Tag newly added food items with isAddon: true & current timestamp
        const nowIso = new Date().toISOString();
        const taggedNewItems = consolidatedItems.map((item) => ({
          ...item,
          isAddon: true,
          addedAt: nowIso,
        }));

        // APPEND TO EXISTING BILL: Combine items into existing order and keep same order #
        const combinedItems = consolidateOrderItems([
          ...(existingTableOrder.items || []),
          ...taggedNewItems,
        ]);
        const subtotal = combinedItems.reduce((s, i) => s + i.price * i.qty, 0);
        const tax = 0;
        const total = subtotal + tax;

        const updatedOrder: Order = {
          ...existingTableOrder,
          items: combinedItems,
          subtotal,
          tax,
          total,
          customerId: customerId || existingTableOrder.customerId,
          status: isPaidDirectly ? "completed" : (existingTableOrder.status === "completed" ? "completed" : "preparing"),
          paymentStatus: isPaidDirectly ? "paid" : "unpaid",
          paymentMethod: isPaidDirectly ? paidWithMethod : existingTableOrder.paymentMethod,
        };

        setOrders((os) => os.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));

        // Update tracking ref so remote echo doesn't double-chime
        const newTotalCount = combinedItems.reduce((s, i) => s + (i.qty || 1), 0);
        previousOrderCountsRef.current.set(updatedOrder.id, newTotalCount);

        // Sound authentic kitchen bell chime immediately! 🛎️
        playKitchenBellSound();

        if (tableId) {
          setTables((ts) => {
            const updated = ts.map((t) =>
              t.id === tableId
                ? {
                    ...t,
                    status: isPaidDirectly ? ("available" as const) : ("occupied" as const),
                    orderId: isPaidDirectly ? undefined : updatedOrder.id,
                  }
                : t
            );
            const changed = updated.find((t) => t.id === tableId);
            if (changed) syncTableToSupabase(changed);
            return updated;
          });
        }

        if (isPaidDirectly && updatedOrder.customerId) {
          setCustomers((cs) =>
            cs.map((c) => {
              if (c.id === updatedOrder.customerId) {
                const updatedCustomer = {
                  ...c,
                  visits: c.visits + 1,
                  totalSpent: c.totalSpent + updatedOrder.total,
                  lastVisit: new Date().toISOString(),
                };
                syncCustomerToSupabase(updatedCustomer);
                return updatedCustomer;
              }
              return c;
            })
          );
        }

        setCart([]);
        setTableId(undefined);
        setCustomerId(undefined);

        syncOrderToSupabase(updatedOrder);
        return updatedOrder;
      }

      // Brand new order
      const subtotal = consolidatedItems.reduce((s, i) => s + i.price * i.qty, 0);
      const tax = 0;
      const total = subtotal + tax;
      const number = Math.max(...orders.map((o) => o.number), 1000) + 1;
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

      // Update tracking ref so remote echo doesn't double-chime
      const newTotalCount = consolidatedItems.reduce((s, i) => s + (i.qty || 1), 0);
      previousOrderCountsRef.current.set(o.id, newTotalCount);

      // Sound authentic kitchen bell chime immediately! 🛎️
      playKitchenBellSound();
      if (tableId) {
        setTables((ts) => {
          const updated = ts.map((t) =>
            t.id === tableId
              ? { ...t, status: isPaidDirectly ? ("available" as const) : ("occupied" as const), orderId: isPaidDirectly ? undefined : o.id }
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
      if (o.id === id) {
        syncOrderToSupabase(updated);
        // If order was cancelled, immediately free any linked occupied table
        if (s === "cancelled" && updated.tableId) {
          setTables((ts) => {
            const updatedTables = ts.map((t) =>
              t.id === updated.tableId && t.orderId === id
                ? { ...t, status: "available" as const, orderId: undefined }
                : t
            );
            const freed = updatedTables.filter((t) => t.id === updated.tableId);
            freed.forEach((ft) => syncTableToSupabase(ft));
            return updatedTables;
          });
        }
      }
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
