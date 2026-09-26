import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { AppShell } from "@/components/pos/AppShell";
import { PageHeader } from "@/components/pos/ui";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/analytics")({
  head: () => meta("Analytics", "Business analytics — Power BI reports coming soon."),
  component: Analytics,
});

function Analytics() {
  return (
    <AppShell>
      <PageHeader title="Analytics" subtitle="Deep-dive reports for your restaurant" />
      <div className="card-surface flex min-h-[420px] flex-col items-center justify-center p-10 text-center">
        <div className="grid size-20 place-items-center rounded-3xl bg-primary-soft text-primary"><BarChart3 className="size-10" /></div>
        <h2 className="mt-5 text-xl font-extrabold">Power BI reports coming soon</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">Sales trends, item performance and staff reports will be embedded here once your Power BI workspace is connected.</p>
        <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
          {["Sales trends", "Menu performance", "Peak hours"].map((t) => (
            <div key={t} className="rounded-2xl border-2 border-dashed p-6 text-sm font-bold text-muted-foreground">{t}</div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
