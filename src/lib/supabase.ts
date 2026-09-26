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
