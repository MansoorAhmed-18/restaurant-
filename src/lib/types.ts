// Domain types — shaped to map 1:1 onto Postgres tables.
export type ID = string;

export interface Category { id: ID; name: string; emoji: string }
export interface Product {
  id: ID; name: string; categoryId: ID; price: number; emoji: string;
  veg: boolean; available: boolean; description?: string | undefined; soldToday?: number | undefined;
  image?: string | undefined;
}
export type TableStatus = "available" | "occupied" | "reserved";
export interface RestaurantTable { id: ID; name: string; seats: number; status: TableStatus; orderId?: ID | undefined; reservedFor?: string | undefined }
export interface Customer { id: ID; name: string; phone?: string | undefined; email?: string | undefined; visits: number; totalSpent: number; lastVisit: string }
export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";
export type PaymentMethod = "cash" | "upi";
export interface OrderItem { productId: ID; name: string; price: number; qty: number }
export interface Order {
  id: ID; number: number; tableId?: ID | undefined; customerId?: ID | undefined; items: OrderItem[];
  subtotal: number; tax: number; total: number; status: OrderStatus;
  paymentStatus: PaymentStatus; paymentMethod?: PaymentMethod | undefined; createdAt: string; type: "dine-in" | "takeaway";
}

export interface MonthlySalesRecord {
  month: string;
  monthIndex: number;
  year: number;
  sales: number;
  target: number;
  orders: number;
  dineIn: number;
  takeaway: number;
  upi: number;
  cash: number;
  avgOrderValue: number;
  momGrowth?: number | undefined; // percentage
}

