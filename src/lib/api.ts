/**
 * Data access layer. Every screen reads through these functions, so swapping the
 * mock implementation for Strapi REST calls (backed by Supabase Postgres) only
 * touches this file. E.g. getProducts -> fetch(`${STRAPI_URL}/api/products?populate=category`).
 */
import * as mock from "./mock-data";
import type { Category, Customer, Order, Product, RestaurantTable } from "./types";

const delay = <T,>(v: T, ms = 450) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), ms));

export const api = {
  getCategories: (): Promise<Category[]> => delay(mock.categories),
  getProducts: (): Promise<Product[]> => delay(mock.products),
  getTables: (): Promise<RestaurantTable[]> => delay(mock.tables),
  getCustomers: (): Promise<Customer[]> => delay(mock.customers),
  getSeedOrders: (): Promise<Order[]> => delay(mock.orders),
  getHourlySales: () => delay(mock.hourlySales),
};

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
