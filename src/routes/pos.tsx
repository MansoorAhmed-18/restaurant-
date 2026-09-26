import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, ErrorState, LoadingGrid, PageHeader, VegMark } from "@/components/pos/ui";
import { api, inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/pos")({
  head: () => meta("New Order", "Take orders by category, build the cart and send to the kitchen."),
  component: Pos,
});

function Pos() {
  const pos = usePos();
  const nav = useNavigate();
  const cats = useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const items = useMemo(() => pos.products.filter((p) => (cat === "all" || p.categoryId === cat) && p.name.toLowerCase().includes(q.toLowerCase())), [pos.products, cat, q]);
  const qtyOf = (id: string) => pos.cart.find((c) => c.productId === id)?.qty ?? 0;

  const place = (payNow: boolean) => {
    const o = pos.placeOrder();
    if (!o) return;
    toast.success(`Order #${o.number} sent to kitchen`);
    if (payNow) nav({ to: "/payments", search: { order: o.id } });
  };

  return (
    <AppShell>
      <PageHeader title="New Order" subtitle="Tap dishes to add them to the cart" />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for dishes…" className="h-12 w-full rounded-2xl border bg-card pl-12 pr-4 text-sm font-medium shadow-[var(--shadow-card)] outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {cats.isLoading ? <div className="h-10" /> : cats.isError ? null : [{ id: "all", name: "All", emoji: "🍽️" }, ...(cats.data ?? [])].map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors", cat === c.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary")}>
                <span>{c.emoji}</span>{c.name}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {cats.isLoading ? <LoadingGrid count={9} /> : cats.isError ? <ErrorState onRetry={() => cats.refetch()} /> : items.length === 0 ? (
              <EmptyState title="No dishes found" text={`Nothing matches "${q}". Try another search or category.`} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {items.map((p) => {
                  const qty = qtyOf(p.id);
                  return (
                    <div key={p.id} className={cn("card-surface flex gap-4 p-4", !p.available && "opacity-55")}>
                      <div className="min-w-0 flex-1">
                        <VegMark veg={p.veg} />
                        <div className="mt-1.5 font-bold leading-snug">{p.name}</div>
                        <div className="mt-1 font-semibold">{inr(p.price)}</div>
                        {!p.available && <div className="mt-1 text-xs font-bold text-destructive">Out of stock</div>}
                      </div>
                      <div className="relative w-28 shrink-0">
                        <div className="grid h-24 place-items-center rounded-xl bg-primary-soft text-5xl">{p.emoji}</div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                          {qty === 0 ? (
                            <button disabled={!p.available} onClick={() => pos.add(p)} className="h-9 w-24 rounded-lg border bg-card text-sm font-extrabold text-success shadow-[var(--shadow-card)] disabled:text-muted-foreground">ADD</button>
                          ) : (
                            <div className="flex h-9 w-24 items-center justify-between rounded-lg border bg-card text-success shadow-[var(--shadow-card)]">
                              <button onClick={() => pos.setQty(p.id, qty - 1)} className="px-2" aria-label="Decrease"><Minus className="size-4" /></button>
                              <span className="text-sm font-extrabold">{qty}</span>
                              <button onClick={() => pos.add(p)} className="px-2" aria-label="Increase"><Plus className="size-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <aside className="card-surface flex h-fit flex-col p-5 xl:sticky xl:top-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Cart</h2>
            {pos.cart.length > 0 && <button onClick={pos.clearCart} className="flex items-center gap-1 text-xs font-bold text-destructive"><Trash2 className="size-3.5" />Clear</button>}
          </div>
          <select value={pos.tableId ?? ""} onChange={(e) => pos.setTableId(e.target.value || undefined)} className="mt-3 h-10 rounded-xl border bg-card px-3 text-sm font-semibold">
            <option value="">Takeaway</option>
            {pos.tables.filter((t) => t.status === "available").map((t) => <option key={t.id} value={t.id}>Table {t.name} · {t.seats} seats</option>)}
          </select>
          {pos.cart.length === 0 ? (
            <div className="py-10 text-center">
              <ShoppingCart className="mx-auto size-10 text-muted-foreground" />
              <div className="mt-2 font-bold">Cart is empty</div>
              <p className="text-sm text-muted-foreground">Add dishes from the menu</p>
            </div>
          ) : (
            <>
              <ul className="mt-4 max-h-[40vh] space-y-3 overflow-y-auto">
                {pos.cart.map((i) => (
                  <li key={i.productId} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{i.name}</div><div className="text-xs text-muted-foreground">{inr(i.price)} each</div></div>
                    <div className="flex items-center rounded-lg border text-success">
                      <button onClick={() => pos.setQty(i.productId, i.qty - 1)} className="p-1.5" aria-label="Decrease"><Minus className="size-3.5" /></button>
                      <span className="w-6 text-center text-sm font-extrabold">{i.qty}</span>
                      <button onClick={() => pos.setQty(i.productId, i.qty + 1)} className="p-1.5" aria-label="Increase"><Plus className="size-3.5" /></button>
                    </div>
                    <span className="w-16 text-right text-sm font-bold">{inr(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-2 border-t border-dashed pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Item total</span><span>{inr(pos.totals.subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>GST (5%)</span><span>{inr(pos.totals.tax)}</span></div>
                <div className="flex justify-between border-t pt-2 text-base font-extrabold"><span>To pay</span><span>{inr(pos.totals.total)}</span></div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => place(false)} className="h-11 rounded-xl border-2 border-primary text-sm font-bold text-primary">Send to kitchen</button>
                <button onClick={() => place(true)} className="h-11 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-[var(--shadow-lift)]">Pay now</button>
              </div>
            </>
          )}
        </aside>
      </div>
      {pos.totals.count > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-2xl bg-success px-5 py-3.5 font-bold text-primary-foreground xl:hidden">
          <span>{pos.totals.count} items · {inr(pos.totals.total)}</span><span>View cart ↑</span>
        </div>
      )}
    </AppShell>
  );
}
