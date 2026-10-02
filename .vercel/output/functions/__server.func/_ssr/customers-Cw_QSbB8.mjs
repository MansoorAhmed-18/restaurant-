import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { T as Phone, v as Search } from "../_libs/lucide-react.mjs";
import { T as usePos, f as cn, i as LoadingGrid, l as StatusBadge, n as EmptyState, o as PageHeader, r as ErrorState, t as AppShell } from "./ui-BAZRHXjU.mjs";
import { n as inr, t as api } from "./api-DCKBFnnE.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-Cw_QSbB8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Customers() {
	const q = useQuery({
		queryKey: ["customers"],
		queryFn: api.getCustomers
	});
	const { orders } = usePos();
	const [s, setS] = (0, import_react.useState)("");
	const [sel, setSel] = (0, import_react.useState)(null);
	const list = (q.data ?? []).filter((c) => (c.name + c.phone).toLowerCase().includes(s.toLowerCase()));
	const active = q.data?.find((c) => c.id === (sel ?? list[0]?.id));
	const history = orders.filter((o) => o.customerId === active?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Customers",
		subtitle: "Your regulars and what they love"
	}), q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingGrid, {}) : q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: () => q.refetch() }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[360px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: s,
					onChange: (e) => setS(e.target.value),
					placeholder: "Search name or phone",
					className: "h-10 w-full rounded-xl border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 space-y-1",
				children: [list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "p-6 text-center text-sm text-muted-foreground",
					children: "No customers found"
				}), list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSel(c.id),
					className: cn("flex w-full items-center gap-3 rounded-xl p-3 text-left", active?.id === c.id ? "bg-primary-soft" : "hover:bg-muted"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground",
						children: c.name.split(" ").map((w) => w[0]).join("")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-bold",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								c.visits,
								" visits · ",
								inr(c.totalSpent)
							]
						})]
					})]
				}) }, c.id))]
			})]
		}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-extrabold",
						children: active.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-1.5 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }),
							active.phone,
							active.email && ` · ${active.email}`
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-6 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-extrabold",
							children: active.visits
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Visits"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-extrabold text-primary",
							children: inr(active.totalSpent)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Lifetime"
						})] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-6 font-extrabold",
					children: "Order history"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 space-y-2",
					children: history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No recent orders",
						text: "Orders from the last 30 days appear here."
					}) : history.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-bold",
							children: [
								"#",
								o.number,
								" · ",
								inr(o.total)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })]
					}, o.id))
				})
			]
		})]
	})] });
}
//#endregion
export { Customers as component };
