import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Phone, Search } from "lucide-react";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, ErrorState, LoadingGrid, PageHeader, StatusBadge } from "@/components/pos/ui";
import { api, inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/customers")({
  head: () => meta("Customers", "Regular guests, contact details and their order history."),
  component: Customers,
});

function Customers() {
  const q = useQuery({ queryKey: ["customers"], queryFn: api.getCustomers });
  const { orders } = usePos();
  const [s, setS] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const list = (q.data ?? []).filter((c) => (c.name + c.phone).toLowerCase().includes(s.toLowerCase()));
  const active = q.data?.find((c) => c.id === (sel ?? list[0]?.id));
  const history = orders.filter((o) => o.customerId === active?.id);

  return (
    <AppShell>
      <PageHeader title="Customers" subtitle="Your regulars and what they love" />
      {q.isLoading ? <LoadingGrid /> : q.isError ? <ErrorState onRetry={() => q.refetch()} /> : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="card-surface p-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={s} onChange={(e) => setS(e.target.value)} placeholder="Search name or phone" className="h-10 w-full rounded-xl border pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
            <ul className="mt-3 space-y-1">
              {list.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No customers found</li>}
              {list.map((c) => (
                <li key={c.id}><button onClick={() => setSel(c.id)} className={cn("flex w-full items-center gap-3 rounded-xl p-3 text-left", active?.id === c.id ? "bg-primary-soft" : "hover:bg-muted")}>
                  <span className="grid size-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{c.name.split(" ").map((w) => w[0]).join("")}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate font-bold">{c.name}</span><span className="text-xs text-muted-foreground">{c.visits} visits · {inr(c.totalSpent)}</span></span>
                </button></li>
              ))}
            </ul>
          </div>
          {active && (
            <div className="card-surface p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div><h2 className="text-xl font-extrabold">{active.name}</h2><div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="size-3.5" />{active.phone}{active.email && ` · ${active.email}`}</div></div>
                <div className="flex gap-6 text-center">
                  <div><div className="text-xl font-extrabold">{active.visits}</div><div className="text-xs text-muted-foreground">Visits</div></div>
                  <div><div className="text-xl font-extrabold text-primary">{inr(active.totalSpent)}</div><div className="text-xs text-muted-foreground">Lifetime</div></div>
                </div>
              </div>
              <h3 className="mt-6 font-extrabold">Order history</h3>
              <div className="mt-3 space-y-2">
                {history.length === 0 ? <EmptyState title="No recent orders" text="Orders from the last 30 days appear here." /> : history.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                    <div><div className="font-bold">#{o.number} · {inr(o.total)}</div><div className="text-xs text-muted-foreground">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</div></div>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
