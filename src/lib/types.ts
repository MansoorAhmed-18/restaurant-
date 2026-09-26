// Domain types — shaped to map 1:1 onto future Strapi collections / Postgres tables.
export type ID = string;

export interface Category { id: ID; name: string; emoji: string }
export interface Product {
  id: ID; name: string; categoryId: ID; price: number; emoji: string;
  veg: boolean; available: boolean; description?: string; soldToday?: number;
}
export type TableStatus = "available" | "occupied" | "reserved";
export interface RestaurantTable { id: ID; name: string; seats: number; status: TableStatus; orderId?: ID; reservedFor?: string }
export interface Customer { id: ID; name: string; phone: string; email?: string; visits: number; totalSpent: number; lastVisit: string }
export type OrderStatus = "pending" | "preparing" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";
export type PaymentMethod = "cash" | "card" | "upi";
export interface OrderItem { productId: ID; name: string; price: number; qty: number }
export interface Order {
  id: ID; number: number; tableId?: ID; customerId?: ID; items: OrderItem[];
  subtotal: number; tax: number; total: number; status: OrderStatus;
  paymentStatus: PaymentStatus; paymentMethod?: PaymentMethod; createdAt: string; type: "dine-in" | "takeaway";
}
