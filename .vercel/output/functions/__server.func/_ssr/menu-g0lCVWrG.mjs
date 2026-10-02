import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as Pencil, l as Trash2, n as X, w as Plus } from "../_libs/lucide-react.mjs";
import { C as syncProductToSupabase, S as syncCategoryToSupabase, T as usePos, f as cn, i as LoadingGrid, m as deleteProductFromSupabase, n as EmptyState, o as PageHeader, r as ErrorState, t as AppShell, u as VegMark } from "./ui-BAZRHXjU.mjs";
import { n as inr, t as api } from "./api-DCKBFnnE.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as Label, t as Input } from "./label-Dvv8K65h.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/menu-g0lCVWrG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function MenuPage() {
	const { products, setProducts } = usePos();
	const q = useQuery({
		queryKey: ["categories"],
		queryFn: api.getCategories
	});
	const [extraCats, setExtraCats] = (0, import_react.useState)([]);
	const cats = [...q.data ?? [], ...extraCats];
	const [cat, setCat] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const list = products.filter((p) => cat === "all" || p.categoryId === cat);
	const save = (e) => {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		const data = {
			name: String(f.get("name")),
			price: Number(f.get("price")),
			categoryId: String(f.get("categoryId")),
			emoji: String(f.get("emoji") || "🍽️"),
			veg: f.get("veg") === "on"
		};
		if (!data.name || !data.price) return toast.error("Name and price are required");
		if (editing === "new") {
			const newProd = {
				...data,
				id: `p${Date.now()}`,
				available: true,
				soldToday: 0
			};
			setProducts((ps) => [...ps, newProd]);
			syncProductToSupabase(newProd);
		} else if (editing) {
			const updatedProd = {
				...editing,
				...data
			};
			setProducts((ps) => ps.map((p) => p.id === editing.id ? updatedProd : p));
			syncProductToSupabase(updatedProd);
		}
		toast.success("Menu saved & synced to Supabase");
		setEditing(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Menu",
			subtitle: `${products.length} dishes across ${cats.length} categories`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					const n = prompt("New category name");
					if (n) {
						const newCat = {
							id: `c${Date.now()}`,
							name: n,
							emoji: "🍽️"
						};
						setExtraCats((c) => [...c, newCat]);
						syncCategoryToSupabase(newCat);
						toast.success(`Category ${n} created`);
					}
				},
				className: "rounded-xl border bg-card px-4 py-2.5 text-sm font-bold",
				children: "+ Category"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setEditing("new"),
				className: "flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add dish"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 flex gap-2 overflow-x-auto pb-2",
			children: [{
				id: "all",
				name: "All",
				emoji: "🍽️"
			}, ...cats].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setCat(c.id),
				className: cn("shrink-0 rounded-full border px-4 py-2 text-sm font-bold", cat === c.id ? "border-primary bg-primary text-primary-foreground" : "bg-card"),
				children: [
					c.emoji,
					" ",
					c.name,
					" · ",
					c.id === "all" ? products.length : products.filter((p) => p.categoryId === c.id).length
				]
			}, c.id))
		}),
		q.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingGrid, {}) : q.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: () => q.refetch() }) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No dishes in this category",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setEditing("new"),
				className: "rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground",
				children: "Add dish"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface flex items-center gap-4 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-16 shrink-0 place-items-center rounded-xl bg-primary-soft text-3xl",
						children: p.emoji
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VegMark, { veg: p.veg }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate font-bold",
									children: p.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted-foreground",
								children: [
									cats.find((c) => c.id === p.categoryId)?.name,
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: inr(p.price)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 flex items-center gap-2 text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: p.available,
									onCheckedChange: (v) => {
										setProducts((ps) => ps.map((x) => {
											if (x.id === p.id) {
												const updated = {
													...x,
													available: v
												};
												syncProductToSupabase(updated);
												return updated;
											}
											return x;
										}));
									}
								}), p.available ? "In stock" : "Out of stock"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setEditing(p),
							className: "rounded-lg p-2 hover:bg-muted",
							"aria-label": "Edit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								if (confirm(`Delete ${p.name}?`)) {
									setProducts((ps) => ps.filter((x) => x.id !== p.id));
									deleteProductFromSupabase(p.id);
									toast.success(`Deleted ${p.name}`);
								}
							},
							className: "rounded-lg p-2 text-destructive hover:bg-danger-soft",
							"aria-label": "Delete",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					})
				]
			}, p.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editing,
			onOpenChange: (v) => !v && setEditing(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing === "new" ? "Add dish" : "Edit dish" }) }), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: save,
				className: "space-y-4",
				children: (() => {
					const p = editing === "new" ? void 0 : editing;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							name: "name",
							defaultValue: p?.name,
							className: "mt-1.5"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "price",
								children: "Price (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "price",
								name: "price",
								type: "number",
								defaultValue: p?.price,
								className: "mt-1.5"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "emoji",
								children: "Icon"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "emoji",
								name: "emoji",
								defaultValue: p?.emoji ?? "🍽️",
								className: "mt-1.5"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "categoryId",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "categoryId",
							name: "categoryId",
							defaultValue: p?.categoryId ?? cats[0]?.id,
							className: "mt-1.5 h-9 w-full rounded-md border bg-card px-3 text-sm",
							children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								name: "veg",
								defaultChecked: p?.veg ?? true,
								className: "accent-[var(--success)]"
							}), "Vegetarian"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "h-10 w-full rounded-xl bg-primary font-bold text-primary-foreground",
							children: "Save"
						})
					] });
				})()
			})] })
		})
	] });
}
//#endregion
export { MenuPage as component };
