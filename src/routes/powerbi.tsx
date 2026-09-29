import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Database, BarChart, Server, CheckCircle2, Copy, Check, Download, 
  ExternalLink, Layers, PieChart, ShieldCheck, Zap, HelpCircle 
} from "lucide-react";
import { AppShell } from "@/components/pos/AppShell";
import { PageHeader } from "@/components/pos/ui";
import { meta } from "@/lib/meta";
import { isSupabaseConfigured } from "@/lib/supabase";
import { PowerBiDashboardView } from "@/components/pos/PowerBiDashboardView";

export const Route = createFileRoute("/powerbi")({
  head: () => meta("Power BI & Supabase Integration", "Connect Power BI desktop with Supabase database to track live restaurant revenue and analytics."),
  component: PowerBiIntegration,
});

export function PowerBiIntegration() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"credentials" | "sql" | "powerbi-steps" | "dax">("credentials");

  const copyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const connectionDetails = [
    { label: "Server / Host", value: "db.[YOUR-SUPABASE-PROJECT-REF].supabase.co", key: "host" },
    { label: "Port", value: "5432 (Direct) or 6543 (Pooler)", key: "port" },
    { label: "Database Name", value: "postgres", key: "dbname" },
    { label: "User", value: "postgres", key: "user" },
    { label: "Encryption Mode / SSL", value: "Require", key: "ssl" },
  ];

  const sqlViews = [
    { name: "v_powerbi_daily_earnings", desc: "Daily revenue, tax, net earnings, order counts and average bill size." },
    { name: "v_powerbi_hourly_earnings", desc: "Hourly sales breakdown for peak hour traffic analysis." },
    { name: "v_powerbi_sales_by_category", desc: "Revenue generated per category (Starters, Biryani, Beverages, etc.)." },
    { name: "v_powerbi_top_dishes", desc: "Most popular items sold, quantity count, and total item revenue." },
    { name: "v_powerbi_payment_summary", desc: "Revenue distribution across Cash, UPI, and Card transactions." },
    { name: "v_powerbi_order_type_breakdown", desc: "Comparison of Dine-In vs Takeaway sales performance." },
  ];

  return (
    <AppShell>
      <PageHeader 
        title="Power BI Embedded Dashboard Hub 📊" 
        subtitle="Live Power BI report visuals, PostgreSQL analytical views, and desktop integration for restaurantbi.pbix."
      />

      {/* Main Power BI Embedded Dashboard */}
      <div className="mb-8">
        <PowerBiDashboardView />
      </div>

      {/* Integration Status Banner */}
      <div className="mb-8 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`grid size-12 place-items-center rounded-2xl ${isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
              <Database className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg">Supabase Database Connection</h3>
                {isSupabaseConfigured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="size-3.5" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600">
                    Demo Mode (Env Pending)
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isSupabaseConfigured 
                  ? "Live orders are syncing in real-time to your PostgreSQL database." 
                  : "Using local demo state. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to sync live."}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Supabase Dashboard <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto gap-2">
        {[
          { id: "credentials", label: "Power BI Connection", icon: Server },
          { id: "sql", label: "SQL Schema & Views", icon: Layers },
          { id: "powerbi-steps", label: "Step-by-Step Setup Guide", icon: BarChart },
          { id: "dax", label: "Useful DAX Measures", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-extrabold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Connection Credentials */}
      {activeTab === "credentials" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-surface p-6">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <Server className="size-5 text-primary" /> PostgreSQL Credentials for Power BI Desktop
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                In Power BI Desktop, select <strong className="text-foreground">Get Data &gt; PostgreSQL Database</strong> and enter these parameters:
              </p>

              <div className="space-y-3">
                {connectionDetails.map((item) => (
                  <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border bg-muted/30 p-3.5">
                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.label}</div>
                      <code className="text-sm font-mono font-bold text-foreground">{item.value}</code>
                    </div>
                    <button
                      onClick={() => copyText(item.value, item.key)}
                      className="self-start sm:self-center flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      {copiedField === item.key ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                      {copiedField === item.key ? "Copied" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-6">
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-500" /> Security & Connection Options
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Import vs DirectQuery Mode:</strong> For real-time billing updates, choose <strong>DirectQuery</strong> in Power BI. For fast offline dashboards, select <strong>Import</strong> mode with scheduled refresh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Database Password:</strong> Use your Supabase Database password (set during project setup in Settings &gt; Database).</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-surface p-6">
              <h3 className="font-extrabold text-base mb-3">Power BI Visual Metrics Included</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary font-bold">
                  <PieChart className="size-4" /> Today&apos;s Total Gross Revenue & Tax
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted text-foreground font-semibold">
                  <BarChart className="size-4 text-blue-500" /> Hourly Sales Peak Analysis
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted text-foreground font-semibold">
                  <Layers className="size-4 text-purple-500" /> Top Selling Menu Dishes
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted text-foreground font-semibold">
                  <Zap className="size-4 text-emerald-500" /> UPI vs Cash vs Card Split
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SQL Schema & Views */}
      {activeTab === "sql" && (
        <div className="space-y-6">
          <div className="card-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-2">
                  <Layers className="size-5 text-primary" /> Pre-built Power BI Database Views
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  These views aggregate raw billing transactions into ready-to-visualize tables inside Power BI.
                </p>
              </div>
              <div className="text-xs bg-muted px-3 py-1.5 rounded-xl font-mono font-bold text-foreground">
                Location: /supabase/schema.sql
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sqlViews.map((v) => (
                <div key={v.name} className="rounded-xl border bg-muted/20 p-4">
                  <div className="font-mono font-extrabold text-sm text-primary">{v.name}</div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Power BI Setup Guide */}
      {activeTab === "powerbi-steps" && (
        <div className="card-surface p-6 space-y-6">
          <h3 className="font-extrabold text-lg">Step-by-Step Power BI Setup Instructions</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
              <div>
                <h4 className="font-extrabold text-base">Open Power BI Desktop & Choose Connector</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Click on <strong>Get Data</strong> &gt; Search for <strong>PostgreSQL Database</strong> &gt; Click <strong>Connect</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
              <div>
                <h4 className="font-extrabold text-base">Enter Server & Database Name</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Enter Server: <code className="bg-muted px-1.5 py-0.5 rounded font-bold text-foreground">db.[PROJECT-REF].supabase.co</code> and Database: <code className="bg-muted px-1.5 py-0.5 rounded font-bold text-foreground">postgres</code>. Select Data Connectivity mode: <strong>DirectQuery</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
              <div>
                <h4 className="font-extrabold text-base">Select Analytical Views</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  In the Navigator window, expand the <code className="bg-muted px-1.5 py-0.5 rounded font-bold text-foreground">public</code> schema and select <code className="bg-muted px-1.5 py-0.5 rounded font-bold text-foreground">v_powerbi_daily_earnings</code>, <code className="bg-muted px-1.5 py-0.5 rounded font-bold text-foreground">v_powerbi_top_dishes</code>, and <code className="bg-muted px-1.5 py-0.5 rounded font-bold text-foreground">v_powerbi_payment_summary</code>.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-bold">4</div>
              <div>
                <h4 className="font-extrabold text-base">Build Visual Dashboard Cards</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Drag <strong>total_net_earnings</strong> into a Card Visual for &quot;Today&apos;s Earnings&quot;, drag <strong>category_name</strong> vs <strong>category_revenue</strong> into a Donut Chart, and drag <strong>hour_formatted</strong> vs <strong>hourly_sales</strong> into a Bar Chart.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: DAX Measures */}
      {activeTab === "dax" && (
        <div className="card-surface p-6 space-y-4">
          <h3 className="font-extrabold text-lg">Copy-Paste Power BI DAX Formulas</h3>
          <p className="text-sm text-muted-foreground">
            Create these DAX measures inside Power BI for rapid calculation of earnings, growth, and tax metrics:
          </p>

          <div className="space-y-3">
            {[
              { title: "Today Net Earnings", code: "Today Earnings = CALCULATE(SUM(v_powerbi_daily_earnings[total_net_earnings]), v_powerbi_daily_earnings[order_date] = TODAY())" },
              { title: "Average Daily Revenue", code: "Avg Daily Sales = AVERAGE(v_powerbi_daily_earnings[total_net_earnings])" },
              { title: "Total Tax Collected", code: "Total GST Collected = SUM(v_powerbi_daily_earnings[total_tax_collected])" },
              { title: "UPI Payment Share %", code: "UPI Share % = DIVIDE(CALCULATE(SUM(v_powerbi_payment_summary[total_collected]), v_powerbi_payment_summary[payment_method] = \"upi\"), SUM(v_powerbi_payment_summary[total_collected]), 0)" }
            ].map((dax, i) => (
              <div key={i} className="rounded-xl border bg-muted/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold text-primary uppercase tracking-wider">{dax.title}</div>
                  <code className="text-xs font-mono font-bold text-foreground mt-1 block">{dax.code}</code>
                </div>
                <button
                  onClick={() => copyText(dax.code, `dax-${i}`)}
                  className="self-start sm:self-center flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  {copiedField === `dax-${i}` ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  {copiedField === `dax-${i}` ? "Copied" : "Copy DAX"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
