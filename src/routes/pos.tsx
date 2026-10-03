import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { 
  Minus, Plus, Search, ShoppingCart, Trash2, Printer, 
  QrCode, Banknote, CheckCircle2, X, User, UserPlus, MessageSquare, Send 
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

export const Route = createFileRoute("/pos")({
  head: () => meta("Billing POS Terminal", "Quick billing software for restaurant orders, customer details & thermal receipts."),
  component: Pos,
});

export function Pos() {
  const pos = usePos();
  const nav = useNavigate();
  const cats = useQuery({ queryKey: ["categories"], queryFn: api.getCategories });
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  // Quick Customer Input Modal / Toggle State
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");

  // Quick Pay Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [cashTendered, setCashTendered] = useState<string>("");
  const [sendWhatsAppOnPay, setSendWhatsAppOnPay] = useState(true);

  const items = useMemo(() => {
    return pos.products.filter((p) => {
      const matchCat = cat === "all" || p.categoryId === cat;
      const matchQ = p.name.toLowerCase().includes(q.toLowerCase());
      const matchVeg = vegOnly ? p.veg : true;
      return matchCat && matchQ && matchVeg;
    });
  }, [pos.products, cat, q, vegOnly]);

  const qtyOf = (id: string) => pos.cart.find((c) => c.productId === id)?.qty ?? 0;

  const handleAddQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName) {
      toast.error("Please enter customer name.");
      return;
    }
    const newC = pos.addCustomer({ name: custName, phone: custPhone });
    toast.success(`Customer ${newC.name} saved & linked to bill!`);
    setShowAddCustomer(false);
    setCustName("");
  };

  const handlePlaceOrder = (payNow: boolean) => {
    if (pos.cart.length === 0) return;
    if (payNow) {
      setPayModalOpen(true);
    } else {
      const o = pos.placeOrder();
      if (!o) return;
      toast.success(`Bill #${o.number} created & sent to kitchen!`);
    }
  };

  const selectedCustomer = pos.customers.find((c) => c.id === pos.customerId);

  const handleCompletePayment = (shouldSendWhatsApp: boolean = false) => {
    const o = pos.placeOrder();
    if (!o) return;
    pos.payOrder(o.id, selectedMethod);
    toast.success(`Bill #${o.number} paid via ${selectedMethod.toUpperCase()}!`);
    setPayModalOpen(false);

    const targetPhone = custPhone || selectedCustomer?.phone || "";
    if (shouldSendWhatsApp || sendWhatsAppOnPay) {
      sendWhatsAppBill(o, targetPhone, selectedCustomer?.name || custName);
    }

    nav({ to: "/invoice/$orderId", params: { orderId: o.id } });
  };

  const cashGivenNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashGivenNum - pos.totals.total);

  return (
    <AppShell>
      <PageHeader 
        title="POS Billing Terminal 🧾" 
        subtitle="Select items, collect customer details, print thermal bill & record collections." 
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Main Menu Selection Panel */}
        <div className="min-w-0 space-y-4">
          {/* Search & Veg Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <input 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                placeholder="Search food items by name..." 
                className="h-12 w-full rounded-2xl border bg-card pl-12 pr-4 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>
            
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={cn(
                "h-12 shrink-0 flex items-center gap-2 rounded-2xl border px-4 text-xs font-extrabold transition-colors",
                vegOnly ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "bg-card text-muted-foreground hover:border-primary"
              )}
            >
              <span className="size-2.5 rounded-full bg-emerald-500"></span> Veg Only
            </button>
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
                      ? "border-primary bg-primary text-primary-foreground shadow-sm" 
                      : "bg-card hover:border-primary text-foreground"
                  )}
                >
                  <span>{c.emoji}</span>{c.name}
                </button>
              ))
            )}
          </div>

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
                        <div className="grid h-20 place-items-center rounded-2xl bg-primary-soft text-4xl">{p.emoji}</div>
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

          {/* Customer Selection & Quick Add */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-muted-foreground uppercase flex items-center gap-1">
                <User className="size-3.5 text-primary" /> Customer Info
              </span>
              <button 
                onClick={() => setShowAddCustomer(!showAddCustomer)} 
                className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <UserPlus className="size-3" /> {showAddCustomer ? "Cancel" : "+ New Customer"}
              </button>
            </div>

            {showAddCustomer ? (
              <form onSubmit={handleAddQuickCustomer} className="space-y-2 pt-1 border-t">
                <input 
                  value={custName} 
                  onChange={(e) => setCustName(e.target.value)} 
                  placeholder="Customer Name (e.g., Rajesh)" 
                  className="h-8 w-full rounded-lg border bg-card px-2 text-xs font-medium"
                />
                <button type="submit" className="h-8 w-full rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  Save Customer & Link to Bill
                </button>
              </form>
            ) : (
              <select 
                value={pos.customerId ?? ""} 
                onChange={(e) => pos.setCustomerId(e.target.value || undefined)} 
                className="h-9 w-full rounded-lg border bg-card px-2 text-xs font-bold shadow-sm"
              >
                <option value="">-- Guest / Walk-in Customer --</option>
                {pos.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} • {c.visits} Visits
                  </option>
                ))}
              </select>
            )}

            {selectedCustomer && !showAddCustomer && (
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 pt-1">
                <CheckCircle2 className="size-3" /> Linked to {selectedCustomer.name} ({selectedCustomer.visits} visits, {inr(selectedCustomer.totalSpent)} spent)
              </div>
            )}
          </div>

          {/* Order Type / Table */}
          <div>
            <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-1">Select Order Type / Table</label>
            <select 
              value={pos.tableId ?? ""} 
              onChange={(e) => pos.setTableId(e.target.value || undefined)} 
              className="h-10 w-full rounded-xl border bg-card px-3 text-xs font-bold shadow-sm"
            >
              <option value="">Takeaway / Parcel Counter</option>
              {pos.tables.filter((t) => t.status === "available").map((t) => (
                <option key={t.id} value={t.id}>Dine-in Table {t.name} ({t.seats} Seats)</option>
              ))}
            </select>
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

              {/* Total Summary - GST removed */}
              <div className="space-y-1.5 border-t border-dashed pt-3 text-xs">
                <div className="flex justify-between border-t pt-2 text-sm font-black text-foreground"><span>Total Payable</span><span className="text-primary text-base">{inr(pos.totals.total)}</span></div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => handlePlaceOrder(false)} 
                  className="h-11 rounded-xl border-2 border-primary text-xs font-extrabold text-primary hover:bg-primary/5 transition-colors"
                >
                  Send Kitchen Ticket
                </button>
                <button 
                  onClick={() => handlePlaceOrder(true)} 
                  className="h-11 rounded-xl bg-primary text-xs font-black text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity"
                >
                  Pay & Print Bill 🧾
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Quick Pay Modal (Cash vs UPI ONLY) */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-lg">Collect Payment & Print Bill</h3>
                <p className="text-xs text-muted-foreground">Select Cash or UPI to complete bill</p>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted"><X className="size-5" /></button>
            </div>

            {/* Total Amount Display */}
            <div className="rounded-2xl bg-primary/10 p-4 text-center">
              <div className="text-xs font-bold text-muted-foreground uppercase">Total Bill Amount</div>
              <div className="text-3xl font-black text-primary mt-1">{inr(pos.totals.total)}</div>
              {selectedCustomer && (
                <div className="text-xs font-bold text-emerald-600 mt-1">
                  Customer: {selectedCustomer.name}
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

            {/* Confirm Payment Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleCompletePayment(true)}
                className="w-full h-11 rounded-xl bg-emerald-600 text-xs font-extrabold text-white shadow hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="size-4 text-emerald-200" /> Pay ({selectedMethod.toUpperCase()}) & Send WhatsApp Bill 💬
              </button>

              <button
                onClick={() => handleCompletePayment(false)}
                className="w-full h-10 rounded-xl border bg-card text-xs font-bold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="size-4 text-emerald-600" /> Record Payment Only
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
