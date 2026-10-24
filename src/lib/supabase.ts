import { createClient } from "@supabase/supabase-js";
import { consolidateOrderItems } from "./utils";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] || "https://gxwarlojidcebchmxkpz.supabase.co";
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d2FybG9qaWRjZWJjaG14a3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MjI1NzksImV4cCI6MjEwNTk5ODU3OX0.8ICJuZsQyeqKlenIkN9AUVuBtwA8mAMciQN3ljUyotk";

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

// Mutex queue to ensure sync operations for the same order run sequentially
const orderSyncQueue = new Map<string, Promise<boolean>>();

async function executeSyncOrderToSupabase(order: any): Promise<boolean> {
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

    // Insert order line items (delete existing items for this order first to avoid double counting)
    if (order.items && order.items.length > 0) {
      await supabase.from("order_items").delete().eq("order_id", order.id);

      const consolidatedItems = consolidateOrderItems(order.items);
      const lineItems = consolidatedItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.productId || null,
        name: item.name,
        price: item.price,
        qty: item.qty,
        created_at: item.isAddon && item.addedAt 
          ? item.addedAt 
          : (order.createdAt || new Date().toISOString()),
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(lineItems);
      if (itemsError) {
        console.error("Failed to sync order items to Supabase:", itemsError);
        // Fallback: If foreign key on product_id failed, insert line items with product_id: null so items are never lost!
        if (itemsError.code === "23503" || String(itemsError.message).includes("foreign key")) {
          const fallbackItems = lineItems.map((li: any) => ({ ...li, product_id: null }));
          const { error: fallbackErr } = await supabase.from("order_items").insert(fallbackItems);
          if (fallbackErr) {
            console.error("Failed fallback order items insert:", fallbackErr);
          } else {
            console.log("Successfully inserted order items with fallback");
          }
        }
      }
    }

    return true;
  } catch (err) {
    console.error("Supabase sync exception:", err);
    return false;
  }
}

/**
 * Sync a newly completed billing order directly into Supabase (queued per order ID to prevent race conditions)
 */
export async function syncOrderToSupabase(order: any): Promise<boolean> {
  if (!supabase || !order?.id) return false;

  const prev = orderSyncQueue.get(order.id) || Promise.resolve(true);
  const next = prev
    .catch(() => true)
    .then(() => executeSyncOrderToSupabase(order));

  orderSyncQueue.set(order.id, next);

  const res = await next;
  if (orderSyncQueue.get(order.id) === next) {
    orderSyncQueue.delete(order.id);
  }
  return res;
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
      const orderCreatedTime = o.created_at ? new Date(o.created_at).getTime() : 0;
      const itemsList = o.order_items || [];

      // Find timestamps of all line items
      const itemTimes = itemsList
        .map((it: any) => (it.created_at ? new Date(it.created_at).getTime() : 0))
        .filter((t: number) => t > 0);

      // Base time represents the initial ticket placement time
      const baseInitialTime = itemTimes.length > 0 
        ? Math.min(...itemTimes) 
        : orderCreatedTime;

      const maxItemTime = itemTimes.length > 0 ? Math.max(...itemTimes) : baseInitialTime;
      // An order has genuine add-ons ONLY if there is a distinct later batch (> 60s after initial items)
      const hasDistinctAddonBatch = (maxItemTime - baseInitialTime) > 60000;

      const rawItems = itemsList.map((item: any) => {
        const itemCreatedTime = item.created_at ? new Date(item.created_at).getTime() : 0;
        // ONLY mark as add-on if this specific item belongs to the later batch!
        const isAddon = Boolean(
          hasDistinctAddonBatch &&
          itemCreatedTime > 0 &&
          (itemCreatedTime - baseInitialTime > 60000)
        );

        return {
          productId: item.product_id || "",
          name: item.name || "Item",
          price: Number(item.price || 0),
          qty: Number(item.qty || 1),
          addedAt: item.created_at || undefined,
          isAddon,
        };
      });

      const consolidated = consolidateOrderItems(rawItems);
      const orderTotal = Number(o.total || 0);

      // Auto-sanitize duplicate multiples if duplicate rows exist in db
      let normalizedItems = consolidated;
      if (orderTotal > 0 && consolidated.length > 0) {
        const itemsSum = consolidated.reduce((s, i) => s + i.price * i.qty, 0);
        const ratio = Math.round(itemsSum / orderTotal);
        if (ratio > 1 && Math.abs(itemsSum - orderTotal * ratio) < 5) {
          normalizedItems = consolidated.map((item) => ({
            ...item,
            qty: Math.max(1, Math.round(item.qty / ratio)),
          }));
        }
      }

      return {
        id: o.id,
        number: o.number,
        tableId: o.table_id || undefined,
        customerId: o.customer_id || undefined,
        subtotal: Number(o.subtotal || 0),
        tax: Number(o.tax || 0),
        total: orderTotal,
        status: o.status || "pending",
        paymentStatus: o.payment_status || "unpaid",
        paymentMethod: o.payment_method || undefined,
        type: o.order_type || (o.table_id ? "dine-in" : "takeaway"),
        createdAt: o.created_at || new Date().toISOString(),
        items: normalizedItems,
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
 * Fetch restaurant tables from Supabase database
 */
export async function fetchTablesFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .order("id");

    if (error || !data) {
      console.error("Error fetching restaurant tables from Supabase:", error);
      return null;
    }

    return data.map((t: any) => ({
      id: t.id,
      name: t.name,
      seats: Number(t.seats || 4),
      status: (t.status as "available" | "occupied" | "reserved") || "available",
      orderId: t.order_id || undefined,
      reservedFor: t.reserved_for || undefined,
    }));
  } catch (err) {
    console.error("Fetch tables exception:", err);
    return null;
  }
}

/**
 * Sync single restaurant table status & details to Supabase database
 */
export async function syncTableToSupabase(table: any) {
  if (!supabase || !table?.id) return false;
  try {
    const { error } = await supabase.from("restaurant_tables").upsert(
      {
        id: table.id,
        name: table.name,
        seats: Number(table.seats || 4),
        status: table.status || "available",
        order_id: table.orderId || null,
        reserved_for: table.reservedFor || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Failed to sync table to Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase table sync exception:", err);
    return false;
  }
}

/**
 * Bulk sync all restaurant tables to Supabase
 */
export async function syncAllTablesToSupabase(tables: any[]) {
  if (!supabase || !Array.isArray(tables) || tables.length === 0) return false;
  try {
    const payload = tables.map((t) => ({
      id: t.id,
      name: t.name,
      seats: Number(t.seats || 4),
      status: t.status || "available",
      order_id: t.orderId || null,
      reserved_for: t.reservedFor || null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("restaurant_tables").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error("Bulk table sync failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Bulk table sync exception:", err);
    return false;
  }
}

/**
 * Delete a restaurant table from Supabase database
 */
export async function deleteTableFromSupabase(tableId: string) {
  if (!supabase || !tableId) return false;
  try {
    const { error } = await supabase.from("restaurant_tables").delete().eq("id", tableId);
    if (error) {
      console.error("Failed to delete table from Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Delete table exception:", err);
    return false;
  }
}

/**
 * Delete an order and its items from Supabase database
 */
export async function deleteOrderFromSupabase(orderId: string) {
  if (!supabase || !orderId) return false;
  try {
    await supabase.from("order_items").delete().eq("order_id", orderId);
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) {
      console.error("Failed to delete order from Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Delete order exception:", err);
    return false;
  }
}


/**
 * Fetch all registered staff & cashier accounts from Supabase database
 * Uses dedicated table with automatic fallback to existing database tables
 */
export async function fetchStaffAccountsFromSupabase() {
  if (!supabase) return null;

  try {
    // 1. Try fetching from dedicated staff_accounts table
    const { data: staffData, error: staffError } = await supabase
      .from("staff_accounts")
      .select("*");

    if (!staffError && staffData && Array.isArray(staffData) && staffData.length > 0) {
      return staffData.map((a: any) => ({
        id: a.id,
        username: String(a.username).toLowerCase().trim(),
        name: a.name,
        role: a.role,
        password: String(a.password).trim(),
        createdAt: a.created_at || new Date().toISOString(),
        createdBy: a.created_by,
      }));
    }

    // 2. Fail-safe fallback: Fetch staff accounts stored in database
    const { data: custData, error: custError } = await supabase
      .from("customers")
      .select("*")
      .like("id", "staff_%");

    if (!custError && custData && Array.isArray(custData) && custData.length > 0) {
      return custData.map((c: any) => {
        const [role, password] = String(c.phone || "").split(":::");
        const username = String(c.email || "").replace(/^staff:/, "").toLowerCase().trim();
        return {
          id: c.id,
          username: username || c.id.replace("staff_", ""),
          name: c.name,
          role: (role as any) || "Cashier",
          password: password ? String(password).trim() : "123",
          createdAt: c.last_visit || new Date().toISOString(),
          createdBy: "manager",
        };
      });
    }

    return null;
  } catch (err) {
    console.error("Supabase staff fetch error:", err);
    return null;
  }
}

/**
 * Sync staff account to Supabase database (with dual-layer cloud persistence)
 */
export async function syncStaffAccountToSupabase(account: any) {
  if (!supabase) return false;

  const cleanUser = String(account.username).toLowerCase().trim();
  const cleanPass = String(account.password).trim();
  const cleanName = String(account.name).trim();

  try {
    // 1. Save to dedicated staff_accounts table if exists
    try {
      await supabase.from("staff_accounts").upsert(
        {
          id: account.id,
          username: cleanUser,
          name: cleanName,
          role: account.role,
          password: cleanPass,
          created_at: account.createdAt || new Date().toISOString(),
          created_by: account.createdBy || null,
        },
        { onConflict: "id" }
      );
    } catch {
      // Table may not exist yet, ignore
    }

    // 2. Guaranteed cloud persistence in verified database table
    const { error } = await supabase.from("customers").upsert(
      {
        id: `staff_${cleanUser}`,
        name: cleanName,
        phone: `${account.role}:::${cleanPass}`,
        email: `staff:${cleanUser}`,
        visits: 1,
        total_spent: 0,
        last_visit: account.createdAt || new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    return !error;
  } catch (err) {
    console.error("Supabase staff sync error:", err);
    return false;
  }
}

/**
 * Delete staff account from Supabase database
 */
export async function deleteStaffAccountFromSupabase(id: string, username?: string) {
  if (!supabase) return false;
  const cleanUser = username ? String(username).toLowerCase().trim() : "";

  try {
    // Delete from staff_accounts
    try {
      await supabase.from("staff_accounts").delete().eq("id", id);
    } catch {
      // Ignore if table does not exist
    }
    
    // Delete from cloud store
    if (cleanUser) {
      await supabase.from("customers").delete().eq("id", `staff_${cleanUser}`);
    }
    await supabase.from("customers").delete().eq("id", id);
    return true;
  } catch {
    return false;
  }
}
