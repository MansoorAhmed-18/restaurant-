import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquare, Calendar, Clock, CheckCircle2, Lock, XCircle, Bell, Volume2, VolumeX, Flame, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, PageHeader, StatusBadge } from "@/components/pos/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { cn, consolidateOrderItems } from "@/lib/utils";
import { meta } from "@/lib/meta";
import { sendWhatsAppBill } from "@/lib/whatsapp";
import { getActiveStaff, isManager } from "@/lib/auth";
import { playKitchenBellSound, isKitchenSoundMuted, setKitchenSoundMuted } from "@/lib/sound";

export const Route = createFileRoute("/orders")({
  head: () => meta("Orders", "Active, completed and cancelled restaurant orders with details."),
  component: Orders,
});

const tabs = [
  { id: "active", label: "Active", match: (s: string) => s === "pending" || s === "preparing" },
  { id: "completed", label: "Completed", match: (s: string) => s === "completed" },
  { id: "cancelled", label: "Cancelled", match: (s: string) => s === "cancelled" },
];

function formatOrderDateTime(isoString?: string) {
  if (!isoString) return { date: "Today", time: "—", full: "Today" };
  const d = new Date(isoString);
  const date = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  return { date, time, full: `${date}, ${time}` };
}

function Orders() {
  const { orders, setOrderStatus, tables, removeItemFromRunningOrder } = usePos();
  const [tab, setTab] = useState("active");
  const [openId, setOpenId] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState(isKitchenSoundMuted());
  const activeStaff = getActiveStaff();
  const isUserMgr = isManager(activeStaff);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    setKitchenSoundMuted(next);
    if (!next) {
      playKitchenBellSound();
      toast.success("🛎️ Kitchen chime enabled! Test bell sounded.");
    } else {
      toast.info("Kitchen chime muted.");
    }
  };

  const handleCancelOrder = (orderId: string, orderNumber: number) => {
    if (!isManager()) {
      toast.error("Access Denied: Only Manager can cancel restaurant orders.");
      return;
    }
    if (!confirm(`Are you sure you want to cancel Bill #${orderNumber}? This will free the table and void this order.`)) {
      return;
    }
    setOrderStatus(orderId, "cancelled");
    toast.success(`Bill #${orderNumber} cancelled by Manager (${activeStaff?.name || "Manager"}).`);
  };
  const t = tabs.find((x) => x.id === tab)!;
  const list = orders.filter((o) => t.match(o.status));
  const sel = orders.find((o) => o.id === openId);
  return (
    <AppShell>
      <PageHeader title="Orders" subtitle="Track every ticket from kitchen to bill with live dates & times" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((x) => (
            <button key={x.id} onClick={() => setTab(x.id)} className={cn("rounded-full border px-4 py-2 text-sm font-bold transition-all", tab === x.id ? "border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-yellow-400/30" : "bg-card hover:border-primary")}>
              {x.label} · {orders.filter((o) => x.match(o.status)).length}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playKitchenBellSound();
              toast.success("🛎️ Ding-ding! Kitchen counter bell chime tested.");
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary transition-colors shadow-sm"
            title="Test Kitchen Bell Sound"
          >
            <Bell className="size-3.5 text-primary animate-pulse" />
            <span>Test Bell 🛎️</span>
          </button>
          <button
            onClick={toggleSound}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-colors shadow-sm",
              soundMuted
                ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
            )}
            title={soundMuted ? "Unmute Kitchen Notification Sound" : "Mute Kitchen Notification Sound"}
          >
            {soundMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5 text-emerald-600" />}
            <span>Kitchen Chime: {soundMuted ? "MUTED" : "ON"}</span>
          </button>
        </div>
      </div>
      {list.length === 0 ? <EmptyState title={`No ${t.label.toLowerCase()} orders`} text="Orders will show up here as they come in." /> : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr className="border-b">
              <th className="p-4">Order #</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Type</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4" />
            </tr></thead>
            <tbody>
              {list.map((o) => {
                const dt = formatOrderDateTime(o.createdAt);
                const allItemsAddon = o.items && o.items.length > 0 && o.items.every((it) => it.isAddon);
                const hasAddons = !allItemsAddon && Boolean(o.items?.some((it) => it.isAddon));
                return (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-extrabold text-foreground">
                      #{o.number}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <Calendar className="size-3.5 text-primary shrink-0" />
                        <span>{dt.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Clock className="size-3 shrink-0" />
                        <span>{dt.time}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">
                      {o.tableId ? (
                        <Link 
                          to="/tables" 
                          search={{ tableId: o.tableId }} 
                          className="text-primary hover:underline font-bold"
                          title="View Table Details"
                        >
                          {tables.find((tbl) => tbl.id === o.tableId)?.name ? `Table ${tables.find((tbl) => tbl.id === o.tableId)?.name}` : `Table ${o.tableId}`}
                        </Link>
                      ) : (
                        "Takeaway"
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>{consolidateOrderItems(o.items).reduce((s, i) => s + i.qty, 0)} items</span>
                        {hasAddons && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-600 border border-amber-500/30 animate-pulse">
                            <Flame className="size-3 text-amber-600" /> +Add-on
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-black text-foreground">{inr(o.total)}</td>
                    <td className="p-4"><StatusBadge status={o.status} /></td>
                    <td className="p-4"><StatusBadge status={o.paymentStatus} /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => setOpenId(o.id)} className="font-bold text-primary hover:underline">
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Sheet open={!!sel} onOpenChange={(v) => !v && setOpenId(null)}>
        <SheetContent className="overflow-y-auto">
          {sel && (() => {
            const dt = formatOrderDateTime(sel.createdAt);
            const consolidated = consolidateOrderItems(sel.items);
            // Safety guard: An order can never consist 100% of add-on items (stale cache safeguard)
            const allMarked = consolidated.length > 0 && consolidated.every((it) => it.isAddon);
            const displayItems = allMarked
              ? consolidated.map((it) => ({ ...it, isAddon: false }))
              : consolidated;
            const addonItems = displayItems.filter((it) => it.isAddon);
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="text-xl font-extrabold flex items-center justify-between">
                    <span>Order #{sel.number}</span>
                    <span className="text-xs font-mono font-medium text-muted-foreground">ID: {sel.id}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="space-y-4 px-4 pb-6 mt-4">
                  {/* Date & Time Highlight Card */}
                  <div className="rounded-xl border bg-muted/30 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary" /> Order Date:
                      </span>
                      <span className="font-extrabold text-foreground">{dt.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" /> Order Time:
                      </span>
                      <span className="font-bold text-foreground">{dt.time}</span>
                    </div>
                    {sel.status === "completed" && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold pt-1 border-t border-muted">
                        <CheckCircle2 className="size-3.5" /> Order Successfully Completed & Settled
                      </div>
                    )}
                  </div>

                  {/* Kitchen Alert Banner only if genuine newly added items exist */}
                  {addonItems.length > 0 && (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-700 dark:text-amber-400">
                        <Flame className="size-4 text-amber-600 animate-bounce" />
                        <span>KITCHEN NOTICE: {addonItems.reduce((s, it) => s + it.qty, 0)} NEW FOOD ITEM(S) ADDED</span>
                      </div>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-medium">
                        Chef: Prepare the newly added dishes highlighted in orange below. All other dishes are normal (already cooked).
                      </p>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {sel.tableId ? (
                      <Link 
                        to="/tables" 
                        search={{ tableId: sel.tableId }} 
                        className="text-primary hover:underline font-bold"
                      >
                        {tables.find((tbl) => tbl.id === sel.tableId)?.name ? `Table ${tables.find((tbl) => tbl.id === sel.tableId)?.name}` : `Table ${sel.tableId}`}
                      </Link>
                    ) : (
                      "Takeaway"
                    )}
                    <span>· Walk-in Guest</span>
                  </div>

                  {/* Chef ticket items list: Only newly added items have label, others are normal */}
                  <ul className="space-y-1.5 border-y py-3 text-sm">
                    {displayItems.map((i, idx) => {
                      const isNew = Boolean(i.isAddon);
                      return (
                        <li 
                          key={`${i.productId || i.name}-${idx}`} 
                          className={cn(
                            "flex items-center justify-between p-2 rounded-xl transition-all",
                            isNew 
                              ? "bg-amber-500/15 border-2 border-amber-500/50 text-amber-950 dark:text-amber-100 shadow-xs" 
                              : "hover:bg-muted/40"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span 
                              className={cn(
                                "size-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0",
                                isNew 
                                  ? "bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/40" 
                                  : "bg-muted text-foreground"
                              )}
                            >
                              {i.qty}×
                            </span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={cn(isNew ? "font-extrabold text-amber-950 dark:text-amber-100" : "font-semibold text-foreground")}>
                                  {i.name}
                                </span>
                                {isNew && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-xs animate-pulse">
                                    <Flame className="size-3" /> NEW ADD-ON
                                  </span>
                                )}
                              </div>
                              {isNew && (
                                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold block mt-0.5">
                                  🔥 Prepare Now · Added in later round
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            <span className={cn(isNew ? "font-black text-amber-950 dark:text-amber-100 font-mono" : "font-semibold text-foreground font-mono")}>
                              {inr(i.qty * i.price)}
                            </span>
                            {sel.paymentStatus === "unpaid" && sel.status !== "cancelled" && (
                              <button
                                type="button"
                                title={`Remove ${i.name} from running bill`}
                                onClick={() => {
                                  if (window.confirm(`Remove ${i.name} from Bill #${sel.number}?`)) {
                                    removeItemFromRunningOrder(sel.id, idx);
                                  }
                                }}
                                className="size-6 rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{inr(sel.subtotal)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>GST</span><span>{inr(sel.tax)}</span></div>
                    <div className="flex justify-between text-base font-extrabold"><span>Total</span><span>{inr(sel.total)}</span></div>
                  </div>
                  <div className="grid gap-2">
                    {sel.status === "pending" && <button onClick={() => setOrderStatus(sel.id, "preparing")} className="h-10 rounded-xl bg-info text-sm font-bold text-primary-foreground">Mark preparing</button>}
                    {sel.paymentStatus === "unpaid" && sel.status !== "cancelled" && isUserMgr && (
                      <Link to="/payments" search={{ order: sel.id }} className="grid h-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow">
                        Collect payment
                      </Link>
                    )}
                    {sel.status === "cancelled" && (
                      <div className="flex h-10 items-center justify-center gap-2 rounded-xl bg-destructive/10 text-xs font-black text-destructive border border-destructive/20">
                        <XCircle className="size-4" /> Cancelled Order — Non-Collectible
                      </div>
                    )}
                    {sel.paymentStatus === "paid" && (
                      <div className="space-y-2">
                        <Link to="/invoice/$orderId" params={{ orderId: sel.id }} className="grid h-10 place-items-center rounded-xl border-2 border-primary text-sm font-bold text-primary">
                          View Invoice & Receipt
                        </Link>
                        <button
                          onClick={() => {
                            sendWhatsAppBill(sel);
                          }}
                          className="w-full h-10 rounded-xl bg-emerald-600 text-xs font-extrabold text-white flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow"
                        >
                          <MessageSquare className="size-4" /> Send Bill via WhatsApp 💬
                        </button>
                      </div>
                    )}
                    {(sel.status === "pending" || sel.status === "preparing") && (
                      isUserMgr ? (
                        <button 
                          onClick={() => handleCancelOrder(sel.id, sel.number)} 
                          className="h-10 rounded-xl bg-danger-soft text-sm font-bold text-destructive hover:bg-destructive hover:text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="size-4" /> Cancel Order (Manager Only)
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-border/80 bg-muted/40 text-xs font-semibold text-muted-foreground">
                          <Lock className="size-3.5 text-muted-foreground shrink-0" />
                          <span>Order cancellation is restricted to Managers</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

