import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Pencil, Plus, Trash2, Search, SlidersHorizontal } from "lucide-react";
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
import { syncProductToSupabase, deleteProductFromSupabase, syncCategoryToSupabase } from "@/lib/supabase";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = cat === "all" || p.categoryId === cat;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchVeg = vegOnly ? p.veg : true;
      return matchCat && matchSearch && matchVeg;
    });
  }, [products, cat, searchQuery, vegOnly]);

  const save = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      name: String(f.get("name")),
      price: Number(f.get("price")),
      categoryId: String(f.get("categoryId")),
      emoji: String(f.get("emoji") || "🍽️"),
      veg: f.get("veg") === "on",
    };

    if (!data.name || !data.price) return toast.error("Name and price are required");

    if (editing === "new") {
      const newProd = { ...data, id: `p${Date.now()}`, available: true, soldToday: 0 };
      setProducts((ps) => [...ps, newProd]);
      syncProductToSupabase(newProd);
      toast.success(`Dish "${data.name}" created!`);
    } else if (editing) {
      const updatedProd = { ...editing, ...data };
      setProducts((ps) => ps.map((p) => (p.id === editing.id ? updatedProd : p)));
      syncProductToSupabase(updatedProd);
      toast.success(`Dish "${data.name}" updated!`);
    }

    setEditing(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Menu & Dishes 🍲"
        subtitle={`${products.length} dishes across ${cats.length} categories`}
        actions={
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                const n = prompt("New category name");
                if (n) {
                  const newCat = { id: `c${Date.now()}`, name: n, emoji: "🍽️" };
                  setExtraCats((c) => [...c, newCat]);
                  syncCategoryToSupabase(newCat);
                  toast.success(`Category "${n}" created`);
                }
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-xl border bg-card px-3.5 py-2.5 text-xs font-extrabold shadow-sm hover:bg-muted transition-colors"
            >
              + Category
            </button>
            <button
              onClick={() => setEditing("new")}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground shadow hover:opacity-90 transition-opacity"
            >
              <Plus className="size-4" /> Add Dish
            </button>
          </div>
        }
      />

      {/* Mobile Search & Filter Toolbar */}
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food items by name..."
            className="h-11 w-full rounded-2xl border bg-card pl-10 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={cn(
            "h-11 shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border px-4 text-xs font-extrabold transition-colors shadow-sm",
            vegOnly ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "bg-card text-muted-foreground hover:border-primary"
          )}
        >
          <span className="size-2 rounded-full bg-emerald-500"></span> Veg Only
        </button>
      </div>

      {/* Category Scroll Chips */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[{ id: "all", name: "All Items", emoji: "🍽️" }, ...cats].map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all shadow-sm",
              cat === c.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary text-foreground"
            )}
          >
            {c.emoji} {c.name} · {c.id === "all" ? products.length : products.filter((p) => p.categoryId === c.id).length}
          </button>
        ))}
      </div>

      {/* Dish Grid */}
      {q.isLoading ? (
        <LoadingGrid />
      ) : q.isError ? (
        <ErrorState onRetry={() => q.refetch()} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No dishes found"
          text={searchQuery ? `No items match "${searchQuery}".` : "No dishes in this category."}
          action={
            <button onClick={() => setEditing("new")} className="rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground">
              Add Dish
            </button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <div key={p.id} className="card-surface flex items-center justify-between gap-3 p-3.5 sm:p-4 hover:border-primary/40 transition-all shadow-sm">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="grid size-12 sm:size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-2xl sm:text-3xl shadow-sm">
                  {p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <VegMark veg={p.veg} />
                    <span className="truncate font-extrabold text-sm text-foreground">{p.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-medium flex items-center gap-1.5 flex-wrap">
                    <span>{cats.find((c) => c.id === p.categoryId)?.name || "Main"}</span>
                    <span>•</span>
                    <span className="font-black text-primary">{inr(p.price)}</span>
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-[11px] font-bold cursor-pointer">
                    <Switch
                      checked={p.available}
                      onCheckedChange={(v) => {
                        setProducts((ps) =>
                          ps.map((x) => {
                            if (x.id === p.id) {
                              const updated = { ...x, available: v };
                              syncProductToSupabase(updated);
                              return updated;
                            }
                            return x;
                          })
                        );
                      }}
                    />
                    <span className={p.available ? "text-emerald-600 font-extrabold" : "text-destructive font-bold"}>
                      {p.available ? "In Stock" : "Out of Stock"}
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0 border-l pl-2">
                <button
                  onClick={() => setEditing(p)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${p.name}?`)) {
                      setProducts((ps) => ps.filter((x) => x.id !== p.id));
                      deleteProductFromSupabase(p.id);
                      toast.success(`Deleted ${p.name}`);
                    }
                  }}
                  className="rounded-lg p-2 text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">
              {editing === "new" ? "Add New Dish 🍲" : "Edit Dish"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={save} className="space-y-4 pt-2">
              {(() => {
                const p = editing === "new" ? undefined : editing;
                return (
                  <>
                    <div>
                      <Label htmlFor="name" className="text-xs font-extrabold uppercase text-muted-foreground">Dish Name</Label>
                      <Input id="name" name="name" defaultValue={p?.name} placeholder="e.g. Paneer Butter Masala" className="mt-1 h-10 font-bold" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="price" className="text-xs font-extrabold uppercase text-muted-foreground">Price (₹)</Label>
                        <Input id="price" name="price" type="number" defaultValue={p?.price} placeholder="240" className="mt-1 h-10 font-bold font-mono" required />
                      </div>
                      <div>
                        <Label htmlFor="emoji" className="text-xs font-extrabold uppercase text-muted-foreground">Emoji Icon</Label>
                        <Input id="emoji" name="emoji" defaultValue={p?.emoji ?? "🍽️"} placeholder="🍲" className="mt-1 h-10 text-center font-bold" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="categoryId" className="text-xs font-extrabold uppercase text-muted-foreground">Category</Label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        defaultValue={p?.categoryId ?? cats[0]?.id}
                        className="mt-1 h-10 w-full rounded-xl border bg-card px-3 text-xs font-bold"
                      >
                        {cats.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.emoji} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-bold pt-1 cursor-pointer">
                      <input type="checkbox" name="veg" defaultChecked={p?.veg ?? true} className="size-4 accent-emerald-600 rounded" />
                      <VegMark veg={true} /> Vegetarian Dish
                    </label>
                    <button type="submit" className="h-11 w-full rounded-xl bg-primary font-extrabold text-xs text-primary-foreground shadow hover:opacity-90 transition-opacity">
                      Save Dish
                    </button>
                  </>
                );
              })()}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
