import type { Category, Customer, Order, Product, RestaurantTable } from "./types";

export const TAX_RATE = 0;

export const categories: Category[] = [
  { id: "c1", name: "Starters", emoji: "🥟" },
  { id: "c2", name: "Biryani", emoji: "🍛" },
  { id: "c3", name: "Main Course", emoji: "🍲" },
  { id: "c4", name: "Breads", emoji: "🫓" },
  { id: "c5", name: "Beverages", emoji: "🥤" },
  { id: "c6", name: "Desserts", emoji: "🍨" },
];

export const products: Product[] = [
  { id: "p1", name: "Paneer Tikka", categoryId: "c1", price: 240, emoji: "🧀", veg: true, available: true, soldToday: 34 },
  { id: "p2", name: "Chicken 65", categoryId: "c1", price: 280, emoji: "🍗", veg: false, available: true, soldToday: 41 },
  { id: "p3", name: "Veg Spring Rolls", categoryId: "c1", price: 180, emoji: "🥟", veg: true, available: true, soldToday: 12 },
  { id: "p4", name: "Hyderabadi Chicken Biryani", categoryId: "c2", price: 320, emoji: "🍛", veg: false, available: true, soldToday: 58 },
  { id: "p5", name: "Mutton Dum Biryani", categoryId: "c2", price: 420, emoji: "🍖", veg: false, available: true, soldToday: 22 },
  { id: "p6", name: "Veg Biryani", categoryId: "c2", price: 240, emoji: "🍚", veg: true, available: true, soldToday: 19 },
  { id: "p7", name: "Butter Chicken", categoryId: "c3", price: 340, emoji: "🍲", veg: false, available: true, soldToday: 37 },
  { id: "p8", name: "Dal Makhani", categoryId: "c3", price: 220, emoji: "🥘", veg: true, available: true, soldToday: 29 },
  { id: "p9", name: "Kadai Paneer", categoryId: "c3", price: 260, emoji: "🍛", veg: true, available: false, soldToday: 8 },
  { id: "p10", name: "Butter Naan", categoryId: "c4", price: 50, emoji: "🫓", veg: true, available: true, soldToday: 96 },
  { id: "p11", name: "Garlic Naan", categoryId: "c4", price: 60, emoji: "🧄", veg: true, available: true, soldToday: 71 },
  { id: "p12", name: "Tandoori Roti", categoryId: "c4", price: 30, emoji: "🫓", veg: true, available: true, soldToday: 44 },
  { id: "p13", name: "Mango Lassi", categoryId: "c5", price: 120, emoji: "🥭", veg: true, available: true, soldToday: 33 },
  { id: "p14", name: "Masala Chai", categoryId: "c5", price: 40, emoji: "☕", veg: true, available: true, soldToday: 52 },
  { id: "p15", name: "Fresh Lime Soda", categoryId: "c5", price: 90, emoji: "🍋", veg: true, available: true, soldToday: 26 },
  { id: "p16", name: "Gulab Jamun", categoryId: "c6", price: 110, emoji: "🍡", veg: true, available: true, soldToday: 31 },
  { id: "p17", name: "Rasmalai", categoryId: "c6", price: 140, emoji: "🍮", veg: true, available: true, soldToday: 18 },
];

export const tables: RestaurantTable[] = Array.from({ length: 12 }, (_, i) => {
  const status = (["available", "occupied", "reserved", "occupied", "available", "available", "reserved", "occupied", "available", "occupied", "available", "available"] as const)[i];
  return {
    id: `t${i + 1}`, name: `T${String(i + 1).padStart(2, "0")}`, seats: [2, 4, 4, 6, 2, 4, 8, 4, 2, 6, 4, 2][i], status,
    reservedFor: status === "reserved" ? ["Mehta · 8:30 PM", "Iyer · 9:00 PM"][i % 2] : undefined,
  };
});

export const customers: Customer[] = [
  { id: "u1", name: "Aarav Sharma", email: "aarav@mail.com", visits: 14, totalSpent: 12840, lastVisit: "2026-09-24" },
  { id: "u2", name: "Priya Nair", email: "priya.n@mail.com", visits: 9, totalSpent: 7420, lastVisit: "2026-09-23" },
  { id: "u3", name: "Rohan Gupta", visits: 3, totalSpent: 2150, lastVisit: "2026-09-20" },
  { id: "u4", name: "Ananya Iyer", email: "ananya@mail.com", visits: 21, totalSpent: 19870, lastVisit: "2026-09-24" },
  { id: "u5", name: "Kabir Mehta", visits: 6, totalSpent: 4960, lastVisit: "2026-09-18" },
  { id: "u6", name: "Sneha Reddy", email: "sneha.r@mail.com", visits: 11, totalSpent: 9310, lastVisit: "2026-09-22" },
];

function mk(n: number, items: [string, number][], extra: Partial<Order>): Order {
  const its = items.map(([pid, qty]) => {
    const p = products.find((x) => x.id === pid)!;
    return { productId: pid, name: p.name, price: p.price, qty };
  });
  const subtotal = its.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = 0;
  return {
    id: `o${n}`, number: n, items: its, subtotal, tax, total: subtotal,
    status: "completed", paymentStatus: "paid", paymentMethod: "upi", type: "dine-in",
    createdAt: new Date(Date.now() - (1050 - n) * 6 * 60000).toISOString(), ...extra,
  };
}

export const orders: Order[] = [];

export const hourlySales = [
  { hour: "11a", sales: 2400 }, { hour: "12p", sales: 6800 }, { hour: "1p", sales: 11200 }, { hour: "2p", sales: 8900 },
  { hour: "3p", sales: 3200 }, { hour: "4p", sales: 2100 }, { hour: "5p", sales: 3900 }, { hour: "6p", sales: 7400 },
  { hour: "7p", sales: 12600 }, { hour: "8p", sales: 14800 }, { hour: "9p", sales: 9700 },
];
