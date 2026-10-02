import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { N as LoaderCircle, S as QrCode, W as CreditCard, rt as Banknote } from "../_libs/lucide-react.mjs";
import { T as usePos, f as cn, l as StatusBadge, n as EmptyState, o as PageHeader, t as AppShell } from "./ui-BAZRHXjU.mjs";
import { n as inr } from "./api-DCKBFnnE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./payments-Tur3M1n3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-Bhgl7z0f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FakeQr({ seed }) {
	const cells = Array.from({ length: 441 }, (_, i) => {
		const x = i % 21, y = Math.floor(i / 21);
		const finder = (a, b) => x >= a && x < a + 7 && y >= b && y < b + 7 && (x === a || x === a + 6 || y === b || y === b + 6 || x > a + 1 && x < a + 5 && y > b + 1 && y < b + 5);
		if (finder(0, 0) || finder(14, 0) || finder(0, 14)) return true;
		if (x < 8 && y < 8 || x > 12 && y < 8 || x < 8 && y > 12) return false;
		return (x * 7 + y * 13 + seed) * 2654435761 % 7 < 3;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid aspect-square w-56 grid-cols-[repeat(21,1fr)] rounded-xl bg-card p-3",
		children: cells.map((on, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: on ? "bg-foreground" : "" }, i))
	});
}
function Payments() {
	const { orders, payOrder } = usePos();
	const { order } = Route.useSearch();
	const nav = useNavigate();
	const unpaid = orders.filter((o) => o.paymentStatus === "unpaid" && o.status !== "cancelled");
	const [selId, setSelId] = (0, import_react.useState)(order ?? unpaid[0]?.id);
	const [method, setMethod] = (0, import_react.useState)("upi");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const sel = orders.find((o) => o.id === selId && o.paymentStatus === "unpaid");
	const confirm = () => {
		if (!sel) return;
		setBusy(true);
		setTimeout(() => {
			payOrder(sel.id, method);
			setBusy(false);
			toast.success(`Payment received for #${sel.number}`);
			nav({
				to: "/invoice/$orderId",
				params: { orderId: sel.id }
			});
		}, 1200);
	};
	const methods = [
		{
			id: "upi",
			label: "UPI / QR",
			icon: QrCode
		},
		{
			id: "card",
			label: "Card",
			icon: CreditCard
		},
		{
			id: "cash",
			label: "Cash",
			icon: Banknote
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Payments",
		subtitle: "Collect bills and track payment status"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_420px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card-surface overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs uppercase text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Status"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					onClick: () => o.paymentStatus === "unpaid" && o.status !== "cancelled" && setSelId(o.id),
					className: cn("border-b last:border-0", o.paymentStatus === "unpaid" && "cursor-pointer hover:bg-muted/50", sel?.id === o.id && "bg-primary-soft"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-4 font-extrabold",
							children: ["#", o.number]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 font-semibold",
							children: inr(o.total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4 uppercase text-muted-foreground",
							children: o.paymentMethod ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.paymentStatus })
						})
					]
				}, o.id)) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "card-surface h-fit p-6",
			children: !sel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing to collect",
				text: "All bills are settled. Select an unpaid order to collect payment."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground",
					children: ["Collecting for order #", sel.number]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-4xl font-extrabold",
					children: inr(sel.total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid grid-cols-3 gap-2",
					children: methods.map(({ id, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setMethod(id),
						className: cn("flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-bold", method === id ? "border-primary bg-primary-soft text-accent-foreground" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), label]
					}, id))
				}),
				method === "upi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col items-center rounded-2xl bg-primary-soft p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FakeQr, { seed: sel.number }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-sm font-bold",
							children: "Scan with any UPI app"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "spiceroute@upi · GPay · PhonePe · Paytm"
						})
					]
				}),
				method === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 rounded-2xl bg-muted p-5 text-center text-sm text-muted-foreground",
					children: "Tap, insert or swipe card on the terminal."
				}),
				method === "cash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-2xl bg-muted p-5 text-center text-sm text-muted-foreground",
					children: [
						"Collect ",
						inr(sel.total),
						" in cash and confirm."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: busy,
					onClick: confirm,
					className: "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-success font-bold text-primary-foreground disabled:opacity-70",
					children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), busy ? "Confirming…" : "Mark as paid"]
				})
			] })
		})]
	})] });
}
//#endregion
export { Payments as component };
