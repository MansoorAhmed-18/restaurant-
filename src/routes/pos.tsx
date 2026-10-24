import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { 
  Minus, Plus, Search, ShoppingCart, Trash2, Printer, 
  QrCode, Banknote, CheckCircle2, X, MessageSquare, Send 
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, ErrorState, LoadingGrid, PageHeader, VegMark } from "@/components/pos/ui";
import { api, inr } from "@/lib/api";
import { usePos } from "@/lib/pos-store";
import { cn } from "@/lib/utils";
import { meta } from "@/lib/meta";
import type { PaymentMethod } from "@/lib/types";
import { sendWhatsAppBill } from "@/lib/whatsapp";
import { isManager, getActiveStaff } from "@/lib/auth";

export const Route = createFileRoute("/pos")({
  head: () => meta("Billing POS Terminal", "Quick billing software for restaurant orders & thermal receipts."),
  component: Pos,
});

export function Pos() {
  const pos = usePos();
  const nav = useNavigate();
  const activeStaff = getActiveStaff();
  const isUserMgr = isManager(activeStaff);
  const cats = useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const [custPhone, setCustPhone] = useState("");

  // Quick Pay Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [cashTendered, setCashTendered] = useState<string>("");

  const items = useMemo(() => {
    return pos.products.filter((p) => {
      const matchCat = cat === "all" || p.categoryId === cat;
      const matchQ = p.name.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [pos.products, cat, q]);

  const qtyOf = (id: string) => pos.cart.find((c) => c.productId === id)?.qty ?? 0;

  const curTable = pos.tableId ? pos.tables.find((t) => t.id === pos.tableId) : null;
  const curActiveOrder = curTable 
    ? pos.orders.find((o) => o.tableId === curTable.id && o.paymentStatus === "unpaid" && o.status !== "cancelled")
    : null;
  const finalPayableTotal = curActiveOrder ? (curActiveOrder.total + pos.totals.total) : pos.totals.total;

  // Safety: If POS opens for a new order and pos.tableId is occupied, auto-switch to first available table
  useEffect(() => {
    if (pos.tableId && !curActiveOrder && pos.cart.length === 0) {
      const curT = pos.tables.find((t) => t.id === pos.tableId);
      const isCurOccupied = curT?.status === "occupied" || pos.orders.some((o) => o.tableId === pos.tableId && o.paymentStatus === "unpaid" && o.status !== "cancelled");
      if (isCurOccupied) {
        const firstAvail = pos.tables.find((t) => 
          t.status === "available" && !pos.orders.some((o) => o.tableId === t.id && o.paymentStatus === "unpaid" && o.status !== "cancelled")
        );
        pos.setTableId(firstAvail ? firstAvail.id : undefined);
      }
    }
  }, [pos.tableId, curActiveOrder, pos.tables, pos.orders, pos.cart.length]);

  const handlePlaceOrder = (payNow: boolean) => {
    if (pos.cart.length === 0) return;
    if (payNow) {
      if (!isUserMgr) {
        toast.error("Access restricted: Only Managers can collect payment.");
        return;
      }
      setPayModalOpen(true);
    } else {
      const hadExistingOrder = Boolean(curActiveOrder);
      const o = pos.placeOrder();
      if (!o) return;
      if (hadExistingOrder) {
        toast.success(`🛎️ Dishes added to Bill #${o.number}! Kitchen alerted with bell sound.`);
      } else {
        toast.success(`🛎️ Bill #${o.number} created & kitchen bell sounded!`);
      }
    }
  };

  const handleCompletePayment = () => {
    if (!isUserMgr) {
      toast.error("Access restricted: Only Managers can collect payment.");
      return;
    }
    const o = pos.placeOrder(selectedMethod);
    if (!o) return;
    toast.success(`Bill #${o.number} paid via ${selectedMethod.toUpperCase()}!`);
    setPayModalOpen(false);

    sendWhatsAppBill(o, custPhone);

    nav({ to: "/invoice/$orderId", params: { orderId: o.id } });
  };

  const cashGivenNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashGivenNum - finalPayableTotal);

  return (
    <AppShell>
      <PageHeader 
        title="POS Billing Terminal 🧾" 
        subtitle="Select items, print thermal bill & record collections." 
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Main Menu Selection Panel */}
        <div className="min-w-0 space-y-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search food items by name..." 
              className="h-12 w-full rounded-2xl border bg-card pl-12 pr-4 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>

          {/* Categories Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {cats.isLoading ? (
              <div className="h-10" />
            ) : cats.isError ? null : (
              [{ id: "all", name: "All Items", emoji: "🍽️" }, ...(cats.data ?? [])].map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => setCat(c.id)} 
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all", 
                    cat === c.id 
                      ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-yellow-400/40" 
                      : "bg-card hover:border-primary text-foreground"
                  )}
                >
                  <span>{c.emoji}</span>{c.name}
                </button>
              ))
            )}
          </div>

          {/* Special Category Information from Flyer */}
          {cat === "c_chinese" && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs font-bold text-foreground flex items-center gap-2 animate-in fade-in">
              <span className="text-base">🥢</span>
              <span><strong>Shezwan and Garlic options available</strong> on all Chinese Rice & Noodles.</span>
            </div>
          )}
          {cat === "c_curry" && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3.5 py-2 text-xs font-bold text-foreground flex items-center gap-2 animate-in fade-in">
              <span className="text-base">🍛</span>
              <span>Beef Tawa Curry available in <strong>Half (₹70)</strong> & <strong>Full (₹100)</strong> portions.</span>
            </div>
          )}
          {cat === "c_chicken_tandoori" && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2 text-xs font-bold text-foreground flex items-center gap-2 animate-in fade-in">
              <span className="text-base">🔥</span>
              <span>Chicken Tandoori available in <strong>Qtr, Half & Full</strong> with Achari, Hariyali & Malai marinades.</span>
            </div>
          )}

          {/* Dish Grid */}
          <div>
            {cats.isLoading ? (
              <LoadingGrid count={9} />
            ) : cats.isError ? (
              <ErrorState onRetry={() => cats.refetch()} />
            ) : items.length === 0 ? (
              <EmptyState title="No dishes found" text={`Nothing matches "${q}". Try another search or category.`} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {items.map((p) => {
                  const qty = qtyOf(p.id);
                  return (
                    <div key={p.id} className={cn("card-surface flex gap-4 p-4 transition-all hover:border-primary/50", !p.available && "opacity-55")}>
                      <div className="min-w-0 flex-1">
                        <VegMark veg={p.veg} />
                        <div className="mt-1.5 font-bold leading-snug text-foreground text-sm">{p.name}</div>
                        <div className="mt-1 font-black text-primary">{inr(p.price)}</div>
                        {!p.available && <div className="mt-1 text-xs font-bold text-destructive">Out of stock</div>}
                      </div>

                      <div className="relative w-24 shrink-0">
                        <div className="relative h-20 w-24 overflow-hidden rounded-2xl bg-primary-soft shadow-inner border border-border/50">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-4xl">{p.emoji}</div>
                          )}
                          <span className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1 py-0.5 text-[10px] text-white backdrop-blur-sm leading-none">
                            {p.emoji}
                          </span>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                          {qty === 0 ? (
                            <button 
                              disabled={!p.available} 
                              onClick={() => pos.add(p)} 
                              className="h-8 w-20 rounded-xl border bg-card text-xs font-black text-emerald-600 shadow-sm transition-all hover:bg-emerald-500 hover:text-white disabled:text-muted-foreground"
                            >
                              + ADD
                            </button>
                          ) : (
                            <div className="flex h-8 w-20 items-center justify-between rounded-xl border bg-card text-emerald-600 shadow-sm">
                              <button onClick={() => pos.setQty(p.id, qty - 1)} className="px-1.5" aria-label="Decrease"><Minus className="size-3" /></button>
                              <span className="text-xs font-black">{qty}</span>
                              <button onClick={() => pos.add(p)} className="px-1.5" aria-label="Increase"><Plus className="size-3" /></button>
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

        {/* Right Sidebar: Active Billing Order Summary */}
        <aside className="card-surface flex h-fit flex-col p-5 xl:sticky xl:top-8 border-primary/20 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="text-base font-black">Active Bill Receipt</h2>
              <p className="text-xs text-muted-foreground">Order Items & Total Payable</p>
            </div>
            {pos.cart.length > 0 && (
              <button onClick={pos.clearCart} className="flex items-center gap-1 text-xs font-bold text-destructive hover:underline">
                <Trash2 className="size-3.5" /> Clear Cart
              </button>
            )}
          </div>

          {/* Dine-in vs Takeaway and Table Selection */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 border">
              <button
                type="button"
                onClick={() => {
                  const availableTables = pos.tables.filter((t) => 
                    t.status === "available" && !pos.orders.some((o) => o.tableId === t.id && o.paymentStatus === "unpaid" && o.status !== "cancelled")
                  );
                  if (!pos.tableId) {
                    if (availableTables.length > 0) {
                      pos.setTableId(availableTables[0].id);
                    } else {
                      toast.error("All tables are currently occupied! Please vacate a table first.");
                    }
                  } else {
                    const curT = pos.tables.find((t) => t.id === pos.tableId);
                    const isCurOccupied = curT?.status === "occupied" || pos.orders.some((o) => o.tableId === pos.tableId && o.paymentStatus === "unpaid" && o.status !== "cancelled");
                    if (isCurOccupied && !curActiveOrder && availableTables.length > 0) {
                      pos.setTableId(availableTables[0].id);
                    }
                  }
                }}
                className={cn(
                  "py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5",
                  pos.tableId ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                🍽️ Dine-in
              </button>
              <button
                type="button"
                onClick={() => pos.setTableId(undefined)}
                className={cn(
                  "py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5",
                  !pos.tableId ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                🛍️ Takeaway
              </button>
            </div>

            {pos.tableId && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-muted-foreground">Table:</span>
                    <select
                      value={pos.tableId}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        const targetTable = pos.tables.find((t) => t.id === targetId);
                        const isOccupied = targetTable?.status === "occupied" || pos.orders.some((o) => o.tableId === targetId && o.paymentStatus === "unpaid" && o.status !== "cancelled");
                        if (isOccupied && (!curActiveOrder || curActiveOrder.tableId !== targetId)) {
                          toast.error(`Table ${targetTable?.name || targetId} is already occupied! You cannot select an occupied table.`);
                          return;
                        }
                        pos.setTableId(targetId);
                      }}
                      className="font-bold text-foreground bg-card border rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-primary text-xs"
                    >
                      {pos.tables.map((t) => {
                        const hasActiveOrder = pos.orders.some((o) => o.tableId === t.id && o.paymentStatus === "unpaid" && o.status !== "cancelled");
                        const isOccupied = t.status === "occupied" || hasActiveOrder;
                        const isReserved = t.status === "reserved";
                        const isDisabled = isOccupied && (!curActiveOrder || curActiveOrder.tableId !== t.id);

                        return (
                          <option 
                            key={t.id} 
                            value={t.id} 
                            disabled={isDisabled}
                          >
                            {isOccupied 
                              ? (curActiveOrder && curActiveOrder.tableId === t.id 
                                  ? `🪑 ${t.name} (${t.seats} seats) [Current Bill #${curActiveOrder.number}]` 
                                  : `🚫 ${t.name} (${t.seats} seats) [OCCUPIED]`)
                              : isReserved 
                              ? `📅 ${t.name} (${t.seats} seats) [Reserved]` 
                              : `🟢 ${t.name} (${t.seats} seats) - Available`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/tables"
                      search={{ tableId: pos.tableId }}
                      className="text-[11px] text-primary hover:underline font-bold"
                    >
                      Table Details 🪑
                    </Link>
                    <button
                      type="button"
                      onClick={() => pos.setTableId(undefined)}
                      className="text-[11px] text-muted-foreground hover:text-destructive font-bold underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {curActiveOrder && (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-xs text-primary space-y-2">
                    <div className="flex items-center justify-between font-black">
                      <span>Running Bill #{curActiveOrder.number} ({curActiveOrder.items.length} dishes · {inr(curActiveOrder.total)})</span>
                      <Link to="/invoice/$orderId" params={{ orderId: curActiveOrder.id }} className="underline font-bold text-[11px]">
                        Full Bill 🧾
                      </Link>
                    </div>

                    {/* Running items list with remove button */}
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5 divide-y divide-primary/10">
                      {curActiveOrder.items.map((item, idx) => (
                        <div key={`${item.productId || item.name}-${idx}`} className="flex items-center justify-between pt-1 text-[11px]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-bold shrink-0 text-foreground">{item.qty}×</span>
                            <span className="truncate font-semibold text-foreground">{item.name}</span>
                            {item.isAddon && (
                              <span className="text-[9px] font-black uppercase px-1 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                                Add-on
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className="font-mono font-bold text-foreground">{inr(item.price * item.qty)}</span>
                            <button
                              type="button"
                              title={`Remove ${item.name} from running bill`}
                              onClick={() => {
                                if (window.confirm(`Remove ${item.name} from Bill #${curActiveOrder.number}?`)) {
                                  pos.removeItemFromRunningOrder(curActiveOrder.id, idx);
                                }
                              }}
                              className="size-5 rounded bg-destructive/15 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                            >
                              <Trash2 className="size-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[10px] text-muted-foreground font-semibold border-t border-primary/15 pt-1">
                      💡 Tap 🗑️ to remove a dish, then pick replacement dishes below.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {pos.cart.length === 0 ? (
            <div className="py-10 text-center">
              <ShoppingCart className="mx-auto size-12 text-muted-foreground/50" />
              <div className="mt-3 font-extrabold text-sm">Cart is empty</div>
              <p className="text-xs text-muted-foreground mt-1">Tap dishes on the menu to build the bill</p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <ul className="max-h-[30vh] space-y-3 overflow-y-auto pr-1">
                {pos.cart.map((i) => (
                  <li key={i.productId} className="flex items-center gap-2 border-b border-dashed pb-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold">{i.name}</div>
                      <div className="text-[11px] text-muted-foreground">{inr(i.price)} × {i.qty}</div>
                    </div>
                    <div className="flex items-center rounded-lg border text-emerald-600 bg-background">
                      <button onClick={() => pos.setQty(i.productId, i.qty - 1)} className="p-1" aria-label="Decrease"><Minus className="size-3" /></button>
                      <span className="w-5 text-center text-xs font-black">{i.qty}</span>
                      <button onClick={() => pos.setQty(i.productId, i.qty + 1)} className="p-1" aria-label="Increase"><Plus className="size-3" /></button>
                    </div>
                    <span className="w-16 text-right text-xs font-black">{inr(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>

              {/* Total Summary */}
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-yellow-400/10 border border-primary/25 p-4 space-y-2 shadow-sm">
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <span>{curActiveOrder ? "Bill Summary (Running + Added)" : "Total Payable"}</span>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-purple-950 font-black text-[10px] shadow-sm">NET PAYABLE</span>
                </div>
                {curActiveOrder && (
                  <div className="text-xs space-y-1 text-muted-foreground border-b border-primary/15 pb-2">
                    <div className="flex justify-between">
                      <span>Existing Bill #{curActiveOrder.number}:</span>
                      <span className="font-mono font-bold text-foreground">{inr(curActiveOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Added New Items ({pos.totals.count}):</span>
                      <span className="font-mono font-bold text-primary">+{inr(pos.totals.total)}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-0.5">
                  <span className="text-xs text-muted-foreground font-semibold">
                    {curActiveOrder ? "Combined Total to Settle:" : "Total to Collect:"}
                  </span>
                  <span className="text-primary text-2xl font-black font-mono">
                    {inr(finalPayableTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={cn("grid gap-2 pt-1", isUserMgr ? "grid-cols-2" : "grid-cols-1")}>
                <button 
                  onClick={() => handlePlaceOrder(false)} 
                  className={cn(
                    "h-11 rounded-xl border-2 border-primary text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5",
                    isUserMgr 
                      ? "text-primary hover:bg-primary/10" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md text-sm"
                  )}
                >
                  <span>🍳</span>
                  <span>{curActiveOrder ? `+ Add to Bill #${curActiveOrder.number}` : "Kitchen Ticket"}</span>
                </button>
                {isUserMgr && (
                  <button 
                    onClick={() => handlePlaceOrder(true)} 
                    className="h-11 rounded-xl bg-gradient-to-r from-primary to-purple-800 text-xs font-black text-white shadow-[var(--shadow-lift)] hover:opacity-95 transition-all flex items-center justify-center gap-1.5 ring-1 ring-yellow-400/40"
                  >
                    <span className="text-yellow-300">⚡</span> {curActiveOrder ? "Pay Full Bill 🧾" : "Pay & Print 🧾"}
                  </button>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Quick Pay Modal (Cash vs UPI ONLY) */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl border bg-card p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-lg">Collect Payment & Print Bill</h3>
                <p className="text-xs text-muted-foreground">Select Cash or UPI to complete bill</p>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
            </div>

            {/* Total Amount Display */}
            <div className="rounded-2xl bg-primary/10 p-4 text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase">
                {curActiveOrder ? `Combined Bill Amount (Order #${curActiveOrder.number})` : "Total Bill Amount"}
              </div>
              <div className="text-3xl font-black text-primary mt-1">{inr(finalPayableTotal)}</div>
              {curActiveOrder && (
                <div className="text-[11px] text-muted-foreground mt-1 font-semibold">
                  Includes previous dishes ({inr(curActiveOrder.total)}) + new dishes ({inr(pos.totals.total)})
                </div>
              )}
            </div>

            {/* Payment Method Selector (Cash vs UPI ONLY) */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "upi", label: "UPI / QR Code", icon: QrCode },
                { id: "cash", label: "Cash Register", icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id as PaymentMethod)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-xs font-extrabold transition-all",
                      selectedMethod === m.id
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "bg-card text-muted-foreground hover:border-primary"
                    )}
                  >
                    <Icon className="size-6" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Cash Tendered Calculator */}
            {selectedMethod === "cash" && (
              <div className="rounded-xl border bg-muted/20 p-3.5 space-y-2">
                <label className="text-xs font-extrabold text-muted-foreground block">Cash Tendered by Customer (₹)</label>
                <input 
                  type="number" 
                  value={cashTendered} 
                  onChange={(e) => setCashTendered(e.target.value)} 
                  placeholder={`e.g. ${Math.ceil(pos.totals.total / 100) * 100}`}
                  className="h-10 w-full rounded-xl border bg-card px-3 text-sm font-bold font-mono"
                />
                {cashGivenNum > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold pt-1 border-t">
                    <span className="text-muted-foreground">Return Change:</span>
                    <span className={cn("font-extrabold font-mono text-sm", changeDue >= 0 ? "text-emerald-600" : "text-destructive")}>
                      {inr(changeDue)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* UPI QR Mock */}
            {selectedMethod === "upi" && (
              <div className="rounded-xl border bg-emerald-500/5 p-4 text-center space-y-2">
                <div className="grid size-12 mx-auto place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 font-bold">
                  <QrCode className="size-6" />
                </div>
                <div className="text-xs font-extrabold text-emerald-600">Scan QR Code on Dynamic UPI POS Terminal</div>
                <div className="text-[11px] text-muted-foreground">Accepts GPay, PhonePe, Paytm & UPI Apps</div>
              </div>
            )}

            {/* WhatsApp Bill Sharing Box */}
            <div className="rounded-xl border bg-emerald-500/10 border-emerald-500/30 p-3 space-y-2">
              <label className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <MessageSquare className="size-3.5" /> Send Digital Bill to Customer WhatsApp
              </label>
              <input 
                type="tel" 
                value={custPhone} 
                onChange={(e) => setCustPhone(e.target.value)} 
                placeholder="10-digit WhatsApp Number (e.g. 9876543210)..."
                className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Confirm Payment Button (Always redirects to WhatsApp) */}
            <div>
              <button
                onClick={handleCompletePayment}
                className="w-full h-12 rounded-xl bg-emerald-600 text-sm font-black text-white shadow hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="size-4 text-emerald-200" /> Pay ({selectedMethod.toUpperCase()}) & Send WhatsApp Bill 💬
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
