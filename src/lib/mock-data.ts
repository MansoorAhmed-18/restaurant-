import type { Category, Customer, Order, Product, RestaurantTable } from "./types";

export const TAX_RATE = 0;

export const categories: Category[] = [
  { id: "c_curry", name: "Beef Tawa Curry", emoji: "🍛" },
  { id: "c_beef_tikkas", name: "Beef Tikkas", emoji: "🥩" },
  { id: "c_chicken_tikkas", name: "Chicken Tikkas", emoji: "🍗" },
  { id: "c_roles_roti", name: "Roles & Roti", emoji: "🌯" },
  { id: "c_beef_steaks", name: "Beef Steaks", emoji: "🥩" },
  { id: "c_signatures", name: "Signatures", emoji: "⭐" },
  { id: "c_chicken_tandoori", name: "Chicken Tandoori", emoji: "🔥" },
  { id: "c_chinese", name: "Chinese", emoji: "🥢" },
];

export const FOOD_IMAGES = {
  beefCurry: "/images/beef_tawa_curry.jpg",
  beefTikkaAchari: "/images/beef_tikka.jpg",
  hariyaliTikka: "/images/beef_tikka.jpg",
  malaiTikka: "/images/chicken_tikka.jpg",
  afghaniTikka: "/images/chicken_tikka.jpg",
  mixedTikka: "/images/beef_tikka.jpg",
  chickenSeekhRoll: "/images/seekh_roll.jpg",
  rumaliRoti: "/images/rumali_roti.jpg",
  sirloinSteak: "/images/beef_steak.jpg",
  tandooriChicken: "/images/tandoori_chicken.jpg",
  friedRice: "/images/beef_fried_rice.jpg",
  friedNoodles: "/images/fried_noodles.jpg",
  chillyDish: "/images/chilly_dish.jpg",
};

export function getDefaultProductImage(p: { id?: string | undefined; name?: string | undefined; categoryId?: string | undefined; image?: string | undefined }): string {
  if (p.image) return p.image;
  const name = (p.name || "").toLowerCase();
  const cat = (p.categoryId || "").toLowerCase();

  if (name.includes("rumali") || name.includes("roti")) return FOOD_IMAGES.rumaliRoti;
  if (name.includes("roll") || name.includes("role") || name.includes("seekh")) return FOOD_IMAGES.chickenSeekhRoll;
  if (name.includes("hariyali")) return FOOD_IMAGES.hariyaliTikka;
  if (name.includes("malai")) return FOOD_IMAGES.malaiTikka;
  if (name.includes("afghani")) return FOOD_IMAGES.afghaniTikka;
  if (name.includes("mixed")) return FOOD_IMAGES.mixedTikka;
  if (name.includes("noodle")) return FOOD_IMAGES.friedNoodles;
  if (name.includes("rice")) return FOOD_IMAGES.friedRice;
  if (name.includes("chilly") || name.includes("pan fry")) return FOOD_IMAGES.chillyDish;
  if (name.includes("curry") || name.includes("kadai")) return FOOD_IMAGES.beefCurry;
  if (name.includes("steak") || name.includes("sirloin") || name.includes("ribeye") || name.includes("t-bone") || name.includes("tomahawk")) return FOOD_IMAGES.sirloinSteak;
  if (name.includes("tandoori")) return FOOD_IMAGES.tandooriChicken;
  if (name.includes("tikka") || cat.includes("tikka")) return FOOD_IMAGES.beefTikkaAchari;
  if (cat.includes("curry")) return FOOD_IMAGES.beefCurry;
  if (cat.includes("steak")) return FOOD_IMAGES.sirloinSteak;
  if (cat.includes("chinese")) return FOOD_IMAGES.friedRice;
  return FOOD_IMAGES.beefCurry;
}

const rawProducts: Product[] = [
  // --- BEEF TAWA CURRY (70 / 100) ---
  {
    id: "p_curry_half",
    name: "Beef Tawa Curry (Half)",
    categoryId: "c_curry",
    price: 70,
    emoji: "🍛",
    veg: false,
    available: true,
    description: "Slow-cooked spiced beef tawa curry - Half portion",
    soldToday: 18,
  },
  {
    id: "p_curry_full",
    name: "Beef Tawa Curry (Full)",
    categoryId: "c_curry",
    price: 100,
    emoji: "🍛",
    veg: false,
    available: true,
    description: "Rich and hearty beef tawa curry - Full portion",
    soldToday: 26,
  },

  // --- BEEF TIKKAS ---
  {
    id: "p_bt_achari",
    name: "Achari Beef Tikka",
    categoryId: "c_beef_tikkas",
    price: 99,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Tender beef chunks marinated in tangy achari pickle spices",
    soldToday: 15,
  },
  {
    id: "p_bt_hariyali",
    name: "Hariyali Beef Tikka",
    categoryId: "c_beef_tikkas",
    price: 119,
    emoji: "🌿",
    veg: false,
    available: true,
    description: "Char-grilled beef tikka infused with mint and fresh herbs",
    soldToday: 12,
  },
  {
    id: "p_bt_malai",
    name: "Malai Beef Tikka",
    categoryId: "c_beef_tikkas",
    price: 119,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Velvety, cream-marinated succulent beef skewers",
    soldToday: 21,
  },
  {
    id: "p_bt_afghani",
    name: "Afghani Beef Tikka",
    categoryId: "c_beef_tikkas",
    price: 119,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Mild spiced cashew-cream traditional Afghani beef skewers",
    soldToday: 14,
  },
  {
    id: "p_bt_mixed",
    name: "Mixed Beef Tikka",
    categoryId: "c_beef_tikkas",
    price: 149,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Assorted platter of chef special seasoned beef tikkas",
    soldToday: 28,
  },

  // --- CHICKEN TIKKAS ---
  {
    id: "p_ct_achari",
    name: "Achari Chicken Tikka",
    categoryId: "c_chicken_tikkas",
    price: 149,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Zesty pickling spice-rubbed grilled chicken morsels",
    soldToday: 32,
  },
  {
    id: "p_ct_hariyali",
    name: "Hariyali Chicken Tikka",
    categoryId: "c_chicken_tikkas",
    price: 149,
    emoji: "🌿",
    veg: false,
    available: true,
    description: "Fresh green herb and coriander flame-roasted chicken",
    soldToday: 19,
  },
  {
    id: "p_ct_malai",
    name: "Malai Chicken Tikka",
    categoryId: "c_chicken_tikkas",
    price: 149,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Melt-in-mouth creamy char-grilled boneless chicken",
    soldToday: 36,
  },
  {
    id: "p_ct_afghani",
    name: "Afghani Chicken Tikka",
    categoryId: "c_chicken_tikkas",
    price: 149,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Rich, mildly spiced cashew and cream roasted chicken",
    soldToday: 24,
  },
  {
    id: "p_ct_mixed",
    name: "Mixed Chicken Tikka",
    categoryId: "c_chicken_tikkas",
    price: 199,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Grand assortment of grilled chicken tikkas",
    soldToday: 41,
  },

  // --- ROLES & ROTI ---
  {
    id: "p_role_chicken",
    name: "Chicken Seekh Role",
    categoryId: "c_roles_roti",
    price: 120,
    emoji: "🌯",
    veg: false,
    available: true,
    description: "Juicy chicken seekh kebab rolled in fresh rumali with mint dip",
    soldToday: 48,
  },
  {
    id: "p_role_beef",
    name: "Beef Seekh Role",
    categoryId: "c_roles_roti",
    price: 110,
    emoji: "🌯",
    veg: false,
    available: true,
    description: "Spiced chargrilled beef seekh wrapped with sliced onions",
    soldToday: 53,
  },
  {
    id: "p_roti_rumali",
    name: "Rumali Roti",
    categoryId: "c_roles_roti",
    price: 15,
    emoji: "🫓",
    veg: true,
    available: true,
    description: "Paper-thin, piping hot traditional rumali roti",
    soldToday: 112,
  },

  // --- BEEF STEAKS ---
  {
    id: "p_steak_sirloin",
    name: "Sirlion Beef Steak",
    categoryId: "c_beef_steaks",
    price: 299,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Lean and juicy prime cut sirloin steak grilled with herb butter",
    soldToday: 17,
  },
  {
    id: "p_steak_ribeye",
    name: "Rib Eye Beef Steak",
    categoryId: "c_beef_steaks",
    price: 399,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Richly marbled tender rib eye with smoky sear",
    soldToday: 23,
  },
  {
    id: "p_steak_tomjerry",
    name: "Tom & Jerry Beef Steak",
    categoryId: "c_beef_steaks",
    price: 349,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "House-special duo cut spiced beef steak sensation",
    soldToday: 15,
  },
  {
    id: "p_steak_tbone",
    name: "T-Bone Beef Steak",
    categoryId: "c_beef_steaks",
    price: 449,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Classic robust cut with tenderloin and strip on the bone",
    soldToday: 19,
  },
  {
    id: "p_steak_tomahawk",
    name: "Toma Hawk Beef Steak",
    categoryId: "c_beef_steaks",
    price: 549,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Showstopping massive bone-in long cut steak",
    soldToday: 11,
  },

  // --- MEAT THEORY SIGNATURES ---
  {
    id: "p_sig_saucy_kadai",
    name: "Saucy Kadai Beef Steak",
    categoryId: "c_signatures",
    price: 349,
    emoji: "🍲",
    veg: false,
    available: true,
    description: "Pan-seared beef steak tossed in spicy kadai gravy",
    soldToday: 29,
  },
  {
    id: "p_sig_chinese_pan_fry",
    name: "Chinese Pan Fry Beef",
    categoryId: "c_signatures",
    price: 349,
    emoji: "🥘",
    veg: false,
    available: true,
    description: "Wok-seared beef strips glazed in dark oriental sauce",
    soldToday: 34,
  },
  {
    id: "p_sig_butter_malai",
    name: "Butter Malai Beef Steak",
    categoryId: "c_signatures",
    price: 359,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Velvety butter-cream infused luscious beef steak",
    soldToday: 26,
  },
  {
    id: "p_sig_tandoori_chicken",
    name: "Meat Theory Tandoori Chicken",
    categoryId: "c_signatures",
    price: 499,
    emoji: "🔥",
    veg: false,
    available: true,
    description: "Full signature fire-roasted clay oven spiced chicken",
    soldToday: 38,
  },

  // --- CHICKEN TANDOORI (QTR / HALF / FULL) ---
  {
    id: "p_tan_achari_qtr",
    name: "Achari Tandoori (Qtr)",
    categoryId: "c_chicken_tandoori",
    price: 120,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Achari spiced chicken tandoori - Quarter",
    soldToday: 14,
  },
  {
    id: "p_tan_achari_half",
    name: "Achari Tandoori (Half)",
    categoryId: "c_chicken_tandoori",
    price: 240,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Achari spiced chicken tandoori - Half",
    soldToday: 22,
  },
  {
    id: "p_tan_achari_full",
    name: "Achari Tandoori (Full)",
    categoryId: "c_chicken_tandoori",
    price: 450,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Achari spiced chicken tandoori - Full bird",
    soldToday: 16,
  },
  {
    id: "p_tan_hariyali_qtr",
    name: "Hariyali Tandoori (Qtr)",
    categoryId: "c_chicken_tandoori",
    price: 130,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Mint-herb coated chicken tandoori - Quarter",
    soldToday: 11,
  },
  {
    id: "p_tan_hariyali_half",
    name: "Hariyali Tandoori (Half)",
    categoryId: "c_chicken_tandoori",
    price: 250,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Mint-herb coated chicken tandoori - Half",
    soldToday: 17,
  },
  {
    id: "p_tan_hariyali_full",
    name: "Hariyali Tandoori (Full)",
    categoryId: "c_chicken_tandoori",
    price: 480,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Mint-herb coated chicken tandoori - Full bird",
    soldToday: 15,
  },
  {
    id: "p_tan_malai_qtr",
    name: "Malai Tandori (Qtr)",
    categoryId: "c_chicken_tandoori",
    price: 140,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Creamy cardamom-scented malai tandoori - Quarter",
    soldToday: 19,
  },
  {
    id: "p_tan_malai_half",
    name: "Malai Tandori (Half)",
    categoryId: "c_chicken_tandoori",
    price: 260,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Creamy cardamom-scented malai tandoori - Half",
    soldToday: 25,
  },
  {
    id: "p_tan_malai_full",
    name: "Malai Tandori (Full)",
    categoryId: "c_chicken_tandoori",
    price: 449,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Creamy cardamom-scented malai tandoori - Full bird",
    soldToday: 21,
  },

  // --- CHINESE (Shezwan & Garlic options available) ---
  {
    id: "p_ch_egg_rice",
    name: "Egg Fried Rice",
    categoryId: "c_chinese",
    price: 99,
    emoji: "🍚",
    veg: false,
    available: true,
    description: "Wok-tossed basmati rice with eggs & scallions",
    soldToday: 30,
  },
  {
    id: "p_ch_chk_rice",
    name: "Chicken Fried Rice",
    categoryId: "c_chinese",
    price: 140,
    emoji: "🍚",
    veg: false,
    available: true,
    description: "Classic Chinese wok rice with shredded chicken",
    soldToday: 42,
  },
  {
    id: "p_ch_chk_noodles",
    name: "Chicken Fried Noodles",
    categoryId: "c_chinese",
    price: 140,
    emoji: "🍜",
    veg: false,
    available: true,
    description: "Stir-fried noodles with chicken, garlic & cabbage",
    soldToday: 37,
  },
  {
    id: "p_ch_chilly_chk",
    name: "Chilly Chicken",
    categoryId: "c_chinese",
    price: 140,
    emoji: "🍗",
    veg: false,
    available: true,
    description: "Crispy chicken cubes tossed with chillies & soya glaze",
    soldToday: 45,
  },
  {
    id: "p_ch_beef_rice",
    name: "Beef Fried Rice",
    categoryId: "c_chinese",
    price: 140,
    emoji: "🍚",
    veg: false,
    available: true,
    description: "Fragrant wok-fried rice with tender spiced beef cuts",
    soldToday: 51,
  },
  {
    id: "p_ch_beef_noodles",
    name: "Beef Fried Noodles",
    categoryId: "c_chinese",
    price: 140,
    emoji: "🍜",
    veg: false,
    available: true,
    description: "Wok noodles tossed with spiced beef strips & veggies",
    soldToday: 39,
  },
  {
    id: "p_ch_chilly_beef",
    name: "Chilly Beef",
    categoryId: "c_chinese",
    price: 149,
    emoji: "🥩",
    veg: false,
    available: true,
    description: "Fiery dry pan-fried beef with onions & green chillies",
    soldToday: 56,
  },
  {
    id: "p_ch_spl_beef_rice",
    name: "Spl Beef Tawa Rice",
    categoryId: "c_chinese",
    price: 149,
    emoji: "🍛",
    veg: false,
    available: true,
    description: "Meat Theory special hot plate sizzled beef rice",
    soldToday: 62,
  },
  {
    id: "p_ch_spl_beef_kadai",
    name: "Spl Beef Tawa Kadai",
    categoryId: "c_chinese",
    price: 149,
    emoji: "🥘",
    veg: false,
    available: true,
    description: "Chef's special spicy wok-tossed beef kadai gravy",
    soldToday: 47,
  },
];

export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  image: getDefaultProductImage(p),
}));

const statuses = ["available", "available", "available", "available", "available", "reserved", "available", "available", "occupied", "available", "available", "available"] as const;
const seatCounts = [2, 4, 4, 6, 2, 4, 8, 4, 2, 6, 4, 2] as const;

export const tables: RestaurantTable[] = Array.from({ length: 12 }, (_, i) => {
  const status = statuses[i] ?? "available";
  const seats = seatCounts[i] ?? 4;
  return {
    id: `t${i + 1}`,
    name: `T${String(i + 1).padStart(2, "0")}`,
    seats,
    status,
    orderId: undefined,
    reservedFor: status === "reserved" ? "Zubair · 8:30 PM" : undefined,
  };
});

export const customers: Customer[] = [
  { id: "u1", name: "Farhan Ali", email: "farhan@mail.com", visits: 14, totalSpent: 12840, lastVisit: "2026-10-20" },
  { id: "u2", name: "Zubair Ahmed", email: "zubair@mail.com", visits: 9, totalSpent: 7420, lastVisit: "2026-10-21" },
  { id: "u3", name: "Salman Khan", visits: 3, totalSpent: 2150, lastVisit: "2026-10-18" },
  { id: "u4", name: "Aisha Begum", email: "aisha@mail.com", visits: 21, totalSpent: 19870, lastVisit: "2026-10-22" },
  { id: "u5", name: "Irfan Qureshi", visits: 6, totalSpent: 4960, lastVisit: "2026-10-19" },
];

export const orders: Order[] = [];

export const hourlySales = [
  { hour: "12p", sales: 2800 }, { hour: "1p", sales: 7400 }, { hour: "2p", sales: 9800 }, { hour: "3p", sales: 6500 },
  { hour: "4p", sales: 3100 }, { hour: "5p", sales: 4200 }, { hour: "6p", sales: 8600 }, { hour: "7p", sales: 14200 },
  { hour: "8p", sales: 18900 }, { hour: "9p", sales: 16500 }, { hour: "10p", sales: 11200 },
];

const currentYear = new Date().getFullYear();
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateYearData(year: number, baseMultiplier: number, growthFactor: number) {
  const baseSales = [480000, 520000, 590000, 640000, 710000, 680000, 730000, 760000, 790000, 860000, 820000, 910000];
  const baseOrders = [980, 1050, 1180, 1260, 1380, 1320, 1410, 1460, 1510, 1620, 1540, 1690];
  const momGrowths = [8.5, 8.3, 13.5, 8.5, 10.9, -4.2, 7.4, 4.1, 3.9, 8.9, -4.7, 11.0];

  return months.map((m, idx) => {
    const bSales = baseSales[idx] ?? 500000;
    const bOrders = baseOrders[idx] ?? 1000;
    const sales = Math.round(bSales * baseMultiplier * growthFactor);
    const target = Math.round(sales * 0.95);
    const orders = Math.round(bOrders * growthFactor);
    const dineIn = Math.round(sales * 0.65);
    const takeaway = sales - dineIn;
    const upi = Math.round(sales * 0.72);
    const cash = sales - upi;
    const avgOrderValue = Math.round(sales / orders);

    return {
      month: m,
      monthIndex: idx + 1,
      year,
      sales,
      target,
      orders,
      dineIn,
      takeaway,
      upi,
      cash,
      avgOrderValue,
      momGrowth: momGrowths[idx] ?? 0,
    };
  });
}

export const monthlySalesData: import("./types").MonthlySalesRecord[] = [
  ...generateYearData(currentYear - 1, 0.85, 0.9),
  ...generateYearData(currentYear, 1.0, 1.0),
  ...generateYearData(currentYear + 1, 1.18, 1.15),
];
