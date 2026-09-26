import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import * as mock from "./mock-data";
import { syncOrderToSupabase } from "./supabase";
import type { Order, OrderItem, OrderStatus, PaymentMethod, Product, RestaurantTable } from "./types";

// Local in-memory store. Replace mutations with API calls when the backend lands.
interface Store {
  cart: OrderItem[];
  tableId?: string;
  setTableId: (id?: string) => void;
  add: (p: Product) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totals: { subtotal: number; tax: number; total: number; count: number };
  orders: Order[];
  tables: RestaurantTable[];
  products: Product[];
  setProducts: (fn: (p: Product[]) => Product[]) => void;
  placeOrder: () => Order | null;
  payOrder: (id: string, method: PaymentMethod) => void;
  setOrderStatus: (id: string, s: OrderStatus) => void;
  setTables: (fn: (t: RestaurantTable[]) => RestaurantTable[]) => void;
}

const Ctx = createContext<Store | null>(null);
const round = (n: number) => Math.round(n * 100) / 100;

export function PosProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [tableId, setTableId] = useState<string | undefined>();
  const [orders, setOrders] = useState<Order[]>(mock.orders);
  const [tables, setTables] = useState<RestaurantTable[]>(mock.tables);
  const [products, setProducts] = useState<Product[]>(mock.products);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = round(subtotal * mock.TAX_RATE);
    return { subtotal, tax, total: round(subtotal + tax), count: cart.reduce((s, i) => s + i.qty, 0) };
  }, [cart]);

  const value: Store = {
    cart, tableId, setTableId, totals, orders, tables, products, setProducts, setTables,
    add: (p) => setCart((c) => {
      const f = c.find((i) => i.productId === p.id);
      return f ? c.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { productId: p.id, name: p.name, price: p.price, qty: 1 }];
    }),
    setQty: (id, qty) => setCart((c) => qty <= 0 ? c.filter((i) => i.productId !== id) : c.map((i) => (i.productId === id ? { ...i, qty } : i))),
    clearCart: () => setCart([]),
    placeOrder: () => {
      if (!cart.length) return null;
      const number = Math.max(...orders.map((o) => o.number), 1000) + 1;
      const o: Order = {
        id: `o${number}`, number, items: cart, ...totals, tableId, status: "pending", paymentStatus: "unpaid",
        createdAt: new Date().toISOString(), type: tableId ? "dine-in" : "takeaway",
      };
      setOrders((os) => [o, ...os]);
      if (tableId) setTables((ts) => ts.map((t) => (t.id === tableId ? { ...t, status: "occupied", orderId: o.id } : t)));
      setCart([]); setTableId(undefined);
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
      if (updatedOrder) {
        syncOrderToSupabase(updatedOrder);
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
