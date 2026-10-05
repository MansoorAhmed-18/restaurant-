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
  { id: "u1", name: "Aarav Sharma", email: "aarav@mail.com", visits: 14, totalSpent: 12840, lastVisit: "2027-10-14" },
  { id: "u2", name: "Priya Nair", email: "priya.n@mail.com", visits: 9, totalSpent: 7420, lastVisit: "2027-11-23" },
  { id: "u3", name: "Rohan Gupta", visits: 3, totalSpent: 2150, lastVisit: "2027-12-05" },
  { id: "u4", name: "Ananya Iyer", email: "ananya@mail.com", visits: 21, totalSpent: 19870, lastVisit: "2028-01-18" },
  { id: "u5", name: "Kabir Mehta", visits: 6, totalSpent: 4960, lastVisit: "2028-02-14" },
  { id: "u6", name: "Sneha Reddy", email: "sneha.r@mail.com", visits: 11, totalSpent: 9310, lastVisit: "2028-03-02" },
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

export const monthlySalesData: import("./types").MonthlySalesRecord[] = [
  // 2027 Monthly Records
  { month: "Jan", monthIndex: 1, year: 2027, sales: 480000, target: 450000, orders: 980, dineIn: 312000, takeaway: 168000, upi: 336000, cash: 144000, avgOrderValue: 490, momGrowth: 8.5 },
  { month: "Feb", monthIndex: 2, year: 2027, sales: 520000, target: 500000, orders: 1050, dineIn: 340000, takeaway: 180000, upi: 370000, cash: 150000, avgOrderValue: 495, momGrowth: 8.3 },
  { month: "Mar", monthIndex: 3, year: 2027, sales: 590000, target: 550000, orders: 1180, dineIn: 385000, takeaway: 205000, upi: 425000, cash: 165000, avgOrderValue: 500, momGrowth: 13.5 },
  { month: "Apr", monthIndex: 4, year: 2027, sales: 640000, target: 600000, orders: 1260, dineIn: 416000, takeaway: 224000, upi: 460000, cash: 180000, avgOrderValue: 508, momGrowth: 8.5 },
  { month: "May", monthIndex: 5, year: 2027, sales: 710000, target: 650000, orders: 1380, dineIn: 460000, takeaway: 250000, upi: 518000, cash: 192000, avgOrderValue: 514, momGrowth: 10.9 },
  { month: "Jun", monthIndex: 6, year: 2027, sales: 680000, target: 650000, orders: 1320, dineIn: 442000, takeaway: 238000, upi: 496000, cash: 184000, avgOrderValue: 515, momGrowth: -4.2 },
  { month: "Jul", monthIndex: 7, year: 2027, sales: 730000, target: 700000, orders: 1410, dineIn: 475000, takeaway: 255000, upi: 533000, cash: 197000, avgOrderValue: 518, momGrowth: 7.4 },
  { month: "Aug", monthIndex: 8, year: 2027, sales: 760000, target: 720000, orders: 1460, dineIn: 494000, takeaway: 266000, upi: 562000, cash: 198000, avgOrderValue: 521, momGrowth: 4.1 },
  { month: "Sep", monthIndex: 9, year: 2027, sales: 790000, target: 750000, orders: 1510, dineIn: 513000, takeaway: 277000, upi: 585000, cash: 205000, avgOrderValue: 523, momGrowth: 3.9 },
  { month: "Oct", monthIndex: 10, year: 2027, sales: 860000, target: 800000, orders: 1620, dineIn: 560000, takeaway: 300000, upi: 645000, cash: 215000, avgOrderValue: 531, momGrowth: 8.9 },
  { month: "Nov", monthIndex: 11, year: 2027, sales: 820000, target: 800000, orders: 1540, dineIn: 533000, takeaway: 287000, upi: 615000, cash: 205000, avgOrderValue: 532, momGrowth: -4.7 },
  { month: "Dec", monthIndex: 12, year: 2027, sales: 910000, target: 850000, orders: 1690, dineIn: 600000, takeaway: 310000, upi: 692000, cash: 218000, avgOrderValue: 538, momGrowth: 11.0 },

  // 2028 Monthly Records
  { month: "Jan", monthIndex: 1, year: 2028, sales: 620000, target: 600000, orders: 1190, dineIn: 403000, takeaway: 217000, upi: 477000, cash: 143000, avgOrderValue: 521, momGrowth: 29.2 },
  { month: "Feb", monthIndex: 2, year: 2028, sales: 670000, target: 650000, orders: 1270, dineIn: 435000, takeaway: 235000, upi: 522000, cash: 148000, avgOrderValue: 528, momGrowth: 8.1 },
  { month: "Mar", monthIndex: 3, year: 2028, sales: 740000, target: 700000, orders: 1390, dineIn: 481000, takeaway: 259000, upi: 584000, cash: 156000, avgOrderValue: 532, momGrowth: 10.4 },
  { month: "Apr", monthIndex: 4, year: 2028, sales: 810000, target: 750000, orders: 1490, dineIn: 526000, takeaway: 284000, upi: 648000, cash: 162000, avgOrderValue: 544, momGrowth: 9.5 },
  { month: "May", monthIndex: 5, year: 2028, sales: 880000, target: 820000, orders: 1600, dineIn: 572000, takeaway: 308000, upi: 712000, cash: 168000, avgOrderValue: 550, momGrowth: 8.6 },
  { month: "Jun", monthIndex: 6, year: 2028, sales: 850000, target: 820000, orders: 1530, dineIn: 552000, takeaway: 298000, upi: 697000, cash: 153000, avgOrderValue: 555, momGrowth: -3.4 },
  { month: "Jul", monthIndex: 7, year: 2028, sales: 920000, target: 880000, orders: 1640, dineIn: 607000, takeaway: 313000, upi: 763000, cash: 157000, avgOrderValue: 561, momGrowth: 8.2 },
  { month: "Aug", monthIndex: 8, year: 2028, sales: 960000, target: 900000, orders: 1700, dineIn: 633000, takeaway: 327000, upi: 806000, cash: 154000, avgOrderValue: 565, momGrowth: 4.3 },
  { month: "Sep", monthIndex: 9, year: 2028, sales: 990000, target: 920000, orders: 1740, dineIn: 653000, takeaway: 337000, upi: 831000, cash: 159000, avgOrderValue: 569, momGrowth: 3.1 },
  { month: "Oct", monthIndex: 10, year: 2028, sales: 1080000, target: 1000000, orders: 1880, dineIn: 723000, takeaway: 357000, upi: 918000, cash: 162000, avgOrderValue: 574, momGrowth: 9.1 },
  { month: "Nov", monthIndex: 11, year: 2028, sales: 1040000, target: 1000000, orders: 1790, dineIn: 696000, takeaway: 344000, upi: 884000, cash: 156000, avgOrderValue: 581, momGrowth: -3.7 },
  { month: "Dec", monthIndex: 12, year: 2028, sales: 1150000, target: 1050000, orders: 1960, dineIn: 782000, takeaway: 368000, upi: 989000, cash: 161000, avgOrderValue: 587, momGrowth: 10.6 },
];

