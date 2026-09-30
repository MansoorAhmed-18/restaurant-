import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper to fetch today's total earnings directly from Supabase DB or return null if unconfigured
 */
export async function fetchTodayEarningsFromSupabase() {
  if (!supabase) return null;

  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("orders")
    .select("total, subtotal, tax")
    .eq("payment_status", "paid")
    .gte("created_at", `${today}T00:00:00Z`);

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
    total,
  };
}

/**
 * Sync customer details to Supabase database
 */
export async function syncCustomerToSupabase(customer: any) {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("customers").upsert({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email || null,
      visits: customer.visits || 1,
      total_spent: customer.totalSpent || 0,
      last_visit: customer.lastVisit || new Date().toISOString(),
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
export async function syncOrderToSupabase(order: any) {
  if (!supabase) return false;

  try {
    const { error: orderError } = await supabase.from("orders").upsert({
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
      created_at: order.createdAt || new Date().toISOString(),
    });

    if (orderError) {
      console.error("Failed to sync order to Supabase:", orderError);
      return false;
    }

    // Insert order line items
    if (order.items && order.items.length > 0) {
      const lineItems = order.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(lineItems);
      if (itemsError) {
        console.error("Failed to sync order items to Supabase:", itemsError);
      }
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
export async function fetchOrdersFromSupabase() {
  if (!supabase) return null;
  try {
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (ordersError || !ordersData) {
      console.error("Error fetching orders from Supabase:", ordersError);
      return null;
    }

    return ordersData.map((o: any) => ({
      id: o.id,
      number: o.number,
      tableId: o.table_id || undefined,
      customerId: o.customer_id || undefined,
      subtotal: Number(o.subtotal || 0),
      tax: Number(o.tax || 0),
      total: Number(o.total || 0),
      status: o.status || "pending",
      paymentStatus: o.payment_status || "unpaid",
      paymentMethod: o.payment_method || undefined,
      type: o.order_type || (o.table_id ? "dine-in" : "takeaway"),
      createdAt: o.created_at || new Date().toISOString(),
      items: (o.order_items || []).map((item: any) => ({
        productId: item.product_id || "",
        name: item.name || "Item",
        price: Number(item.price || 0),
        qty: Number(item.qty || 1),
      })),
    }));
  } catch (err) {
    console.error("Fetch orders exception:", err);
    return null;
  }
}
