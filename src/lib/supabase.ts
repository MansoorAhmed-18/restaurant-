import { createClient } from "@supabase/supabase-js";
import { consolidateOrderItems } from "./utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gxwarlojidcebchmxkpz.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d2FybG9qaWRjZWJjaG14a3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MjI1NzksImV4cCI6MjEwNTk5ODU3OX0.8ICJuZsQyeqKlenIkN9AUVuBtwA8mAMciQN3ljUyotk";

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
    const { error: orderError } = await supabase.from("orders").upsert(
      {
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
      },
      { onConflict: "id" }
    );

    if (orderError) {
      console.error("Failed to sync order to Supabase:", orderError);
      return false;
    }

    // Insert order line items (delete existing items for this order first to avoid double counting!)
    if (order.items && order.items.length > 0) {
      await supabase.from("order_items").delete().eq("order_id", order.id);

      const consolidatedItems = consolidateOrderItems(order.items);
      const lineItems = consolidatedItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId || null,
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

    return ordersData.map((o: any) => {
      const rawItems = (o.order_items || []).map((item: any) => ({
        productId: item.product_id || "",
        name: item.name || "Item",
        price: Number(item.price || 0),
        qty: Number(item.qty || 1),
      }));

      return {
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
        items: consolidateOrderItems(rawItems),
      };
    });
  } catch (err) {
    console.error("Fetch orders exception:", err);
    return null;
  }
}

/**
 * Sync product item to Supabase database (Insert or Update)
 */
export async function syncProductToSupabase(product: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("products").upsert(
      {
        id: product.id,
        name: product.name,
        category_id: product.categoryId || null,
        price: product.price,
        emoji: product.emoji || "🍲",
        veg: Boolean(product.veg),
        available: product.available !== undefined ? Boolean(product.available) : true,
        sold_today: product.soldToday || 0,
      },
      { onConflict: "id" }
    );

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
export async function deleteProductFromSupabase(productId: string) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("products").delete().eq("id", productId);
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
export async function syncCategoryToSupabase(category: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("categories").upsert(
      {
        id: category.id,
        name: category.name,
        emoji: category.emoji || "🍽️",
        display_order: category.displayOrder || 0,
      },
      { onConflict: "id" }
    );

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
export async function fetchProductsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error || !data) return null;
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      categoryId: p.category_id || "",
      price: Number(p.price || 0),
      emoji: p.emoji || "🍲",
      veg: Boolean(p.veg),
      available: Boolean(p.available),
      soldToday: Number(p.sold_today || 0),
    }));
  } catch (err) {
    console.error("Fetch products exception:", err);
    return null;
  }
}

/**
 * Fetch categories from Supabase
 */
export async function fetchCategoriesFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("categories").select("*").order("display_order");
    if (error || !data) return null;
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji || "🍽️",
    }));
  } catch (err) {
    console.error("Fetch categories exception:", err);
    return null;
  }
}

/**
 * Fetch all registered staff & cashier accounts from Supabase database
 */
export async function fetchStaffAccountsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("staff_accounts").select("*");
    if (error || !data) return null;
    return data.map((a: any) => ({
      id: a.id,
      username: a.username,
      name: a.name,
      role: a.role,
      password: a.password,
      createdAt: a.created_at || new Date().toISOString(),
      createdBy: a.created_by,
    }));
  } catch {
    return null;
  }
}

/**
 * Sync staff account to Supabase database
 */
export async function syncStaffAccountToSupabase(account: any) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("staff_accounts").upsert(
      {
        id: account.id,
        username: account.username.toLowerCase().trim(),
        name: account.name.trim(),
        role: account.role,
        password: account.password.trim(),
        created_at: account.createdAt || new Date().toISOString(),
        created_by: account.createdBy || null,
      },
      { onConflict: "id" }
    );
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete staff account from Supabase database
 */
export async function deleteStaffAccountFromSupabase(id: string) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("staff_accounts").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}
