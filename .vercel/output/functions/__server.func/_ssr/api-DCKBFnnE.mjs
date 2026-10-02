import { _ as hourlySales, b as products, d as categories, p as customers, w as tables, y as orders } from "./ui-BAZRHXjU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DCKBFnnE.js
/**
* Data access layer. Every screen reads through these functions, so swapping the
* mock implementation for Strapi REST calls (backed by Supabase Postgres) only
* touches this file. E.g. getProducts -> fetch(`${STRAPI_URL}/api/products?populate=category`).
*/
var delay = (v, ms = 450) => new Promise((r) => setTimeout(() => r(structuredClone(v)), ms));
var api = {
	getCategories: () => delay(categories),
	getProducts: () => delay(products),
	getTables: () => delay(tables),
	getCustomers: () => delay(customers),
	getSeedOrders: () => delay(orders),
	getHourlySales: () => delay(hourlySales)
};
var inr = (n) => "₹" + n.toLocaleString("en-IN", {
	minimumFractionDigits: n % 1 ? 2 : 0,
	maximumFractionDigits: 2
});
//#endregion
export { inr as n, api as t };
