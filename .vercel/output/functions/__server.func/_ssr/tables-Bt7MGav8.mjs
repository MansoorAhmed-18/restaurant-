import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as Users } from "../_libs/lucide-react.mjs";
import { T as usePos, f as cn, l as StatusBadge, n as EmptyState, o as PageHeader, t as AppShell } from "./ui-BAZRHXjU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tables-Bt7MGav8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ring = {
	available: "border-success",
	occupied: "border-primary",
	reserved: "border-warning"
};
var next = {
	available: "reserved",
	reserved: "occupied",
	occupied: "available"
};
function Tables() {
	const { tables, setTables } = usePos();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const list = tables.filter((t) => filter === "all" || t.status === filter);
	const count = (s) => tables.filter((t) => t.status === s).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Tables",
			subtitle: "Tap a table's status to change it"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 flex flex-wrap gap-2",
			children: [
				"all",
				"available",
				"occupied",
				"reserved"
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setFilter(s),
				className: cn("rounded-full border px-4 py-2 text-sm font-bold capitalize", filter === s ? "border-primary bg-primary text-primary-foreground" : "bg-card"),
				children: [s, s !== "all" && ` · ${count(s)}`]
			}, s))
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: `No ${filter} tables` }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
			children: list.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("card-surface border-t-4 p-4", ring[t.status]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl font-extrabold",
							children: t.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }), t.seats]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTables((ts) => ts.map((x) => x.id === t.id ? {
							...x,
							status: next[x.status]
						} : x)),
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: t.status })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 min-h-4 text-xs text-muted-foreground",
						children: t.reservedFor ?? (t.status === "occupied" ? "Dining now" : "Ready to seat")
					}),
					t.status === "available" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/pos",
						className: "mt-3 block rounded-lg bg-primary-soft py-1.5 text-center text-xs font-bold text-accent-foreground",
						children: "Start order"
					})
				]
			}, t.id))
		})
	] });
}
//#endregion
export { Tables as component };
