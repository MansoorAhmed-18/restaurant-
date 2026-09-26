import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, ErrorState, LoadingGrid, PageHeader, VegMark } from "@/components/pos/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { api, inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/menu")({
  head: () => meta("Menu", "Add, edit and manage dishes and menu categories."),
  component: MenuPage,
});

function MenuPage() {
  const { products, setProducts } = usePos();
  const q = useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
  const [extraCats, setExtraCats] = useState<Category[]>([]);
  const cats = [...(q.data ?? []), ...extraCats];
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const list = products.filter((p) => cat === "all" || p.categoryId === cat);

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = { name: String(f.get("name")), price: Number(f.get("price")), categoryId: String(f.get("categoryId")), emoji: String(f.get("emoji") || "🍽️"), veg: f.get("veg") === "on" };
    if (!data.name || !data.price) return toast.error("Name and price are required");
    if (editing === "new") setProducts((ps) => [...ps, { ...data, id: `p${Date.now()}`, available: true, soldToday: 0 }]);
    else if (editing) setProducts((ps) => ps.map((p) => (p.id === editing.id ? { ...p, ...data } : p)));
    toast.success("Menu saved"); setEditing(null);
  };

  return (
    <AppShell>
      <PageHeader title="Menu" subtitle={`${products.length} dishes across ${cats.length} categories`}
        actions={<>
          <button onClick={() => { const n = prompt("New category name"); if (n) setExtraCats((c) => [...c, { id: `c${Date.now()}`, name: n, emoji: "🍽️" }]); }} className="rounded-xl border bg-card px-4 py-2.5 text-sm font-bold">+ Category</button>
          <button onClick={() => setEditing("new")} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"><Plus className="size-4" />Add dish</button>
        </>} />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {[{ id: "all", name: "All", emoji: "🍽️" }, ...cats].map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-bold", cat === c.id ? "border-primary bg-primary text-primary-foreground" : "bg-card")}>
            {c.emoji} {c.name} · {c.id === "all" ? products.length : products.filter((p) => p.categoryId === c.id).length}
          </button>
        ))}
      </div>
      {q.isLoading ? <LoadingGrid /> : q.isError ? <ErrorState onRetry={() => q.refetch()} /> : list.length === 0 ? (
        <EmptyState title="No dishes in this category" action={<button onClick={() => setEditing("new")} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Add dish</button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p) => (
            <div key={p.id} className="card-surface flex items-center gap-4 p-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-primary-soft text-3xl">{p.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><VegMark veg={p.veg} /><span className="truncate font-bold">{p.name}</span></div>
                <div className="text-sm text-muted-foreground">{cats.find((c) => c.id === p.categoryId)?.name} · <span className="font-semibold text-foreground">{inr(p.price)}</span></div>
                <label className="mt-2 flex items-center gap-2 text-xs font-semibold">
                  <Switch checked={p.available} onCheckedChange={(v) => setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, available: v } : x)))} />
                  {p.available ? "In stock" : "Out of stock"}
                </label>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => setEditing(p)} className="rounded-lg p-2 hover:bg-muted" aria-label="Edit"><Pencil className="size-4" /></button>
                <button onClick={() => { if (confirm(`Delete ${p.name}?`)) setProducts((ps) => ps.filter((x) => x.id !== p.id)); }} className="rounded-lg p-2 text-destructive hover:bg-danger-soft" aria-label="Delete"><Trash2 className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing === "new" ? "Add dish" : "Edit dish"}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={save} className="space-y-4">
              {(() => { const p = editing === "new" ? undefined : editing; return (<>
                <div><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={p?.name} className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label htmlFor="price">Price (₹)</Label><Input id="price" name="price" type="number" defaultValue={p?.price} className="mt-1.5" /></div>
                  <div><Label htmlFor="emoji">Icon</Label><Input id="emoji" name="emoji" defaultValue={p?.emoji ?? "🍽️"} className="mt-1.5" /></div>
                </div>
                <div><Label htmlFor="categoryId">Category</Label>
                  <select id="categoryId" name="categoryId" defaultValue={p?.categoryId ?? cats[0]?.id} className="mt-1.5 h-9 w-full rounded-md border bg-card px-3 text-sm">
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="veg" defaultChecked={p?.veg ?? true} className="accent-[var(--success)]" />Vegetarian</label>
                <button className="h-10 w-full rounded-xl bg-primary font-bold text-primary-foreground">Save</button>
              </>); })()}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
