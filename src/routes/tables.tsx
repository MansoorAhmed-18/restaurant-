import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Users } from "lucide-react";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, PageHeader, StatusBadge } from "@/components/pos/ui";
import { usePos } from "@/lib/pos-store";
import type { TableStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/tables")({
  head: () => meta("Tables", "Floor view of available, occupied and reserved tables."),
  component: Tables,
});

const ring: Record<TableStatus, string> = { available: "border-success", occupied: "border-primary", reserved: "border-warning" };
const next: Record<TableStatus, TableStatus> = { available: "reserved", reserved: "occupied", occupied: "available" };

function Tables() {
  const { tables, setTables } = usePos();
  const [filter, setFilter] = useState<TableStatus | "all">("all");
  const list = tables.filter((t) => filter === "all" || t.status === filter);
  const count = (s: TableStatus) => tables.filter((t) => t.status === s).length;
  return (
    <AppShell>
      <PageHeader title="Tables" subtitle="Tap a table's status to change it" />
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "available", "occupied", "reserved"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={cn("rounded-full border px-4 py-2 text-sm font-bold capitalize", filter === s ? "border-primary bg-primary text-primary-foreground" : "bg-card")}>
            {s}{s !== "all" && ` · ${count(s)}`}
          </button>
        ))}
      </div>
      {list.length === 0 ? <EmptyState title={`No ${filter} tables`} /> : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {list.map((t) => (
            <div key={t.id} className={cn("card-surface border-t-4 p-4", ring[t.status])}>
              <div className="flex items-center justify-between"><span className="text-2xl font-extrabold">{t.name}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="size-3.5" />{t.seats}</span></div>
              <button onClick={() => setTables((ts) => ts.map((x) => (x.id === t.id ? { ...x, status: next[x.status] } : x)))} className="mt-3"><StatusBadge status={t.status} /></button>
              <div className="mt-2 min-h-4 text-xs text-muted-foreground">{t.reservedFor ?? (t.status === "occupied" ? "Dining now" : "Ready to seat")}</div>
              {t.status === "available" && <Link to="/pos" className="mt-3 block rounded-lg bg-primary-soft py-1.5 text-center text-xs font-bold text-accent-foreground">Start order</Link>}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
