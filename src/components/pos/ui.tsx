import type { ReactNode } from "react";
import { AlertTriangle, Inbox, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon, tone = "primary" }: { label: string; value: string; hint?: string; icon: ReactNode; tone?: "primary" | "success" | "warning" | "info" }) {
  const tones = { primary: "bg-primary-soft text-primary", success: "bg-success-soft text-success", warning: "bg-warning-soft text-warning", info: "bg-info-soft text-info" };
  return (
    <div className="card-surface flex items-start gap-4 p-5">
      <div className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", tones[tone])}>{icon}</div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-2xl font-extrabold">{value}</div>
        {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}

const badgeTones: Record<string, string> = {
  available: "bg-success-soft text-success", paid: "bg-success-soft text-success", completed: "bg-success-soft text-success",
  occupied: "bg-primary-soft text-accent-foreground", preparing: "bg-info-soft text-info",
  reserved: "bg-warning-soft text-warning", pending: "bg-warning-soft text-warning", unpaid: "bg-warning-soft text-warning",
  cancelled: "bg-danger-soft text-destructive", refunded: "bg-danger-soft text-destructive",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize", badgeTones[status] ?? "bg-muted text-muted-foreground")}>{status}</span>;
}

export function VegMark({ veg }: { veg: boolean }) {
  return (
    <span className={cn("grid size-4 place-items-center rounded-[3px] border-2", veg ? "border-success" : "border-destructive")} aria-label={veg ? "Veg" : "Non-veg"}>
      <span className={cn("size-1.5 rounded-full", veg ? "bg-success" : "bg-destructive")} />
    </span>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary"><Inbox className="size-6" /></div>
      <div className="mt-3 font-bold">{title}</div>
      {text && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-danger-soft p-8 text-center">
      <AlertTriangle className="size-7 text-destructive" />
      <div className="mt-2 font-bold">Couldn't load data</div>
      <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
      {onRetry && <button onClick={onRetry} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary"><RotateCw className="size-4" />Retry</button>}
    </div>
  );
}

export function LoadingGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
    </div>
  );
}
