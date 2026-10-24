import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { 
  Users, Plus, Search, Trash2, Edit3, CheckCircle2, Clock, 
  ArrowRight, Utensils, Receipt, Calendar, X, Sparkles, RefreshCw, 
  Info, CreditCard, ChevronRight, Hash, Phone, Lock 
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/pos/AppShell";
import { EmptyState, PageHeader, StatusBadge } from "@/components/pos/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { usePos } from "@/lib/pos-store";
import type { TableStatus, RestaurantTable, Order } from "@/lib/types";
import { cn, consolidateOrderItems } from "@/lib/utils";
import { meta } from "@/lib/meta";
import { inr } from "@/lib/api";
import { syncTableToSupabase, syncAllTablesToSupabase, deleteTableFromSupabase } from "@/lib/supabase";
import { isManager, getActiveStaff } from "@/lib/auth";

export const Route = createFileRoute("/tables")({
  validateSearch: (s: Record<string, unknown>) => ({
    tableId: typeof s["tableId"] === "string" ? s["tableId"] : undefined,
  }),
  head: () => meta("Table Management", "Floor view of available, occupied and reserved tables with full details."),
  component: Tables,
});

const ring: Record<TableStatus, string> = { 
  available: "border-t-emerald-500 hover:border-emerald-500/80 shadow-[0_4px_20px_rgba(16,185,129,0.08)]", 
  occupied: "border-t-primary hover:border-primary shadow-[0_4px_20px_rgba(107,33,168,0.12)]", 
  reserved: "border-t-amber-500 hover:border-amber-500/80 shadow-[0_4px_20px_rgba(245,158,11,0.08)]" 
};

function Tables() {
  const { tables, setTables, setTableId, orders, removeItemFromRunningOrder } = usePos();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const activeStaff = getActiveStaff();
  const isUserMgr = isManager(activeStaff);
  const [filter, setFilter] = useState<TableStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Table Details Sheet State
  const [selectedTableId, setSelectedTableId] = useState<string | null>(search.tableId ?? null);

  useEffect(() => {
    if (search.tableId) {
      setSelectedTableId(search.tableId);
    }
  }, [search.tableId]);

  // Add Table Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableSeats, setNewTableSeats] = useState<number>(4);

  // Reserve Table Modal State
  const [reserveModalTable, setReserveModalTable] = useState<RestaurantTable | null>(null);
  const [guestName, setGuestName] = useState("");
  const [reserveTime, setReserveTime] = useState("");

  // Find the selected table object dynamically
  const selectedTable = useMemo(() => {
    if (!selectedTableId) return null;
    return tables.find((t) => t.id === selectedTableId) || null;
  }, [tables, selectedTableId]);

  // Filtered and searched tables
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchFilter = filter === "all" || t.status === filter;
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.reservedFor && t.reservedFor.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }, [tables, filter, searchQuery]);

  const count = (s: TableStatus) => tables.filter((t) => t.status === s).length;
  const totalCapacity = useMemo(() => tables.reduce((acc, t) => acc + (t.seats || 0), 0), [tables]);

  // Find active order linked to a table (strictly live, unpaid orders only)
  const getTableActiveOrder = (t?: RestaurantTable | null): Order | null => {
    if (!t) return null;
    return orders.find(
      (o) =>
        (o.tableId === t.id || (t.orderId && o.id === t.orderId)) &&
        o.paymentStatus === "unpaid" &&
        o.status !== "cancelled" &&
        o.status !== "completed"
    ) || null;
  };

  // Find all past order history for this table (completed/paid/cancelled)
  const getTableOrderHistory = (tableId?: string) => {
    if (!tableId) return [];
    return orders.filter((o) => o.tableId === tableId && (o.paymentStatus === "paid" || o.status === "completed" || o.status === "cancelled"));
  };

  const handleStartOrder = (t: RestaurantTable) => {
    setTableId(t.id);
    toast.success(`Selected ${t.name} for Dine-in order`);
    navigate({ to: "/pos" });
  };

  const handleSetTableStatus = (id: string, newStatus: TableStatus) => {
    let updatedTable: RestaurantTable | undefined;
    setTables((ts) =>
      ts.map((t) => {
        if (t.id === id) {
          updatedTable = {
            ...t,
            status: newStatus,
            reservedFor: newStatus === "reserved" ? (t.reservedFor || "Reserved for Guest") : undefined,
            orderId: newStatus === "available" ? undefined : t.orderId,
          };
          return updatedTable;
        }
        return t;
      })
    );
    if (updatedTable) {
      syncTableToSupabase(updatedTable);
    }
    toast.success(`Table status changed to ${newStatus}`);
  };

  const handleUpdateSeats = (id: string, seats: number) => {
    let updatedTable: RestaurantTable | undefined;
    setTables((ts) =>
      ts.map((t) => {
        if (t.id === id) {
          updatedTable = { ...t, seats };
          return updatedTable;
        }
        return t;
      })
    );
    if (updatedTable) {
      syncTableToSupabase(updatedTable);
    }
    toast.success(`Updated table capacity to ${seats} seats`);
  };

  const handleCreateNewTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) {
      toast.error("Please provide a table name/number");
      return;
    }
    const newTable: RestaurantTable = {
      id: `t_${Date.now()}`,
      name: newTableName.trim().toUpperCase(),
      seats: Number(newTableSeats) || 4,
      status: "available",
    };
    setTables((ts) => [...ts, newTable]);
    syncTableToSupabase(newTable);
    toast.success(`Table ${newTable.name} (${newTable.seats} seats) added to floor plan!`);
    setNewTableName("");
    setNewTableSeats(4);
    setAddModalOpen(false);
  };

  const handleDeleteTable = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from floor plan?`)) return;
    setTables((ts) => ts.filter((t) => t.id !== id));
    deleteTableFromSupabase(id);
    if (selectedTableId === id) setSelectedTableId(null);
    toast.success(`Table ${name} deleted`);
  };

  const handleSaveReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveModalTable) return;
    if (!guestName.trim()) {
      toast.error("Please enter guest name");
      return;
    }
    const resString = `${guestName.trim()}${reserveTime ? ` · ${reserveTime}` : ""}`;
    let updatedTable: RestaurantTable | undefined;
    setTables((ts) =>
      ts.map((t) => {
        if (t.id === reserveModalTable.id) {
          updatedTable = { ...t, status: "reserved", reservedFor: resString };
          return updatedTable;
        }
        return t;
      })
    );
    if (updatedTable) {
      syncTableToSupabase(updatedTable);
    }
    toast.success(`Table ${reserveModalTable.name} reserved for ${resString}`);
    setReserveModalTable(null);
    setGuestName("");
    setReserveTime("");
  };

  const handleFreeTable = (id: string, name: string) => {
    let updatedTable: RestaurantTable | undefined;
    setTables((ts) =>
      ts.map((t) => {
        if (t.id === id) {
          updatedTable = { ...t, status: "available", orderId: undefined, reservedFor: undefined };
          return updatedTable;
        }
        return t;
      })
    );
    if (updatedTable) {
      syncTableToSupabase(updatedTable);
    }
    toast.success(`Table ${name} is now available`);
  };

  const handleVacateAll = () => {
    if (!confirm("Are you sure you want to mark all tables as Available?")) return;
    const updated = tables.map((t) => ({ ...t, status: "available" as const, orderId: undefined, reservedFor: undefined }));
    setTables(() => updated);
    syncAllTablesToSupabase(updated);
    toast.success("All tables marked as available");
  };

  const activeOrder = getTableActiveOrder(selectedTable);
  const orderHistory = getTableOrderHistory(selectedTable?.id);


  return (
    <AppShell>
      <PageHeader 
        title="Dine-in Floor & Tables 🪑" 
        subtitle="Tap any table to view full details, active bills, order items, and reservations."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleVacateAll}
              title="Reset all tables to available"
              className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-sm"
            >
              <RefreshCw className="size-3.5" /> Vacate All
            </button>
            <button
              onClick={() => {
                const nextNum = tables.length + 1;
                setNewTableName(`T${String(nextNum).padStart(2, "0")}`);
                setAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-primary-foreground shadow hover:opacity-90 transition-opacity ring-1 ring-yellow-400/40"
            >
              <Plus className="size-4" /> Add Table
            </button>
          </div>
        }
      />

      {/* Floor Overview KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="card-surface p-4 border border-border/80">
          <div className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Total Tables</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-foreground">{tables.length}</span>
            <span className="text-xs text-muted-foreground">({totalCapacity} seats)</span>
          </div>
        </div>

        <div className="card-surface p-4 border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Available</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{count("available")}</span>
            <span className="text-xs text-muted-foreground">Ready to seat</span>
          </div>
        </div>

        <div className="card-surface p-4 border border-primary/20 bg-primary/5">
          <div className="text-xs font-extrabold text-primary uppercase tracking-wider">Occupied</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-primary">{count("occupied")}</span>
            <span className="text-xs text-muted-foreground">Dining now</span>
          </div>
        </div>

        <div className="card-surface p-4 border border-amber-500/20 bg-amber-500/5">
          <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Reserved</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">{count("reserved")}</span>
            <span className="text-xs text-muted-foreground">Booked</span>
          </div>
        </div>

        <div className="hidden lg:block card-surface p-4 border border-border/80 bg-gradient-to-br from-yellow-400/10 to-transparent">
          <div className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Turnaround</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <Sparkles className="size-5 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-foreground">Meat Theory Live Floor</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "available", "occupied", "reserved"] as const).map((s) => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-extrabold capitalize transition-all shadow-sm", 
                filter === s 
                  ? "border-primary bg-primary text-primary-foreground ring-2 ring-yellow-400/40" 
                  : "bg-card text-foreground hover:border-primary"
              )}
            >
              {s === "all" ? "All Tables" : s} · {s === "all" ? tables.length : count(s)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search table or guest..."
            className="h-10 w-full rounded-2xl border bg-card pl-10 pr-4 text-xs font-medium outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Table Cards Grid */}
      {filteredTables.length === 0 ? (
        <EmptyState 
          title={`No ${filter !== "all" ? filter : ""} tables found`}
          text={searchQuery ? `No table matched "${searchQuery}".` : "Try switching filter or add a new table."}
          action={
            <button
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              Show All Tables
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map((t) => {
            const linkedOrder = getTableActiveOrder(t);
            return (
              <div 
                key={t.id} 
                onClick={() => setSelectedTableId(t.id)}
                className={cn(
                  "card-surface border-t-4 p-5 transition-all duration-200 flex flex-col justify-between group relative hover:-translate-y-1 hover:shadow-lg cursor-pointer", 
                  ring[t.status]
                )}
              >
                {/* Header: Table Name, Seats, Details Button */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-foreground tracking-tight">{t.name}</span>
                        <span className="flex items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
                          <Users className="size-3" /> {t.seats} seats
                        </span>
                      </div>
                      <div className="mt-1">
                        <StatusBadge status={t.status} />
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTableId(t.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border bg-muted/50 px-2 py-1 text-[11px] font-black text-primary hover:bg-primary hover:text-white transition-colors"
                        title="View Complete Table Details"
                      >
                        <Info className="size-3" /> Details
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTable(t.id, t.name);
                        }}
                        title="Remove Table"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Info based on Status */}
                  <div className="mt-4 pt-3 border-t border-dashed">
                    {t.status === "available" && (
                      <div className="text-xs text-muted-foreground min-h-[44px] flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Table is sanitized and ready for guest seating.</span>
                      </div>
                    )}

                    {t.status === "occupied" && (
                      <div className="min-h-[44px] space-y-1">
                        {linkedOrder ? (
                          <>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-primary">Bill #{linkedOrder.number}</span>
                              <span className="font-black font-mono text-foreground">{inr(linkedOrder.total)}</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate">
                              {linkedOrder.items.length} items ({linkedOrder.items.map(i => i.name).slice(0, 2).join(", ")})
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            Active guests seated · Tap Details to view or bill
                          </div>
                        )}
                      </div>
                    )}

                    {t.status === "reserved" && (
                      <div className="min-h-[44px] space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                          <Calendar className="size-3.5 shrink-0" />
                          <span className="truncate">{t.reservedFor || "Reserved for Guest"}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Reserved booking · Tap Details to seat
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Quick Actions */}
                <div className="mt-4 pt-3 border-t space-y-2">
                  {t.status === "available" && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartOrder(t);
                        }}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 px-3 text-xs font-black text-primary-foreground shadow hover:opacity-90 transition-opacity"
                      >
                        <Utensils className="size-3.5" /> Start Bill
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReserveModalTable(t);
                          setGuestName("");
                          setReserveTime("");
                        }}
                        className="flex items-center justify-center gap-1 rounded-xl border bg-card py-2 px-3 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                      >
                        <Calendar className="size-3.5" /> Reserve
                      </button>
                    </div>
                  )}

                  {t.status === "occupied" && (
                    <div className="flex items-center gap-1.5">
                      {linkedOrder ? (
                        <>
                          <Link
                            to="/invoice/$orderId"
                            params={{ orderId: linkedOrder.id }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-primary/30 bg-primary/10 py-2 px-2 text-[11px] font-black text-primary hover:bg-primary hover:text-white transition-colors truncate"
                            title={`View Bill #${linkedOrder.number}`}
                          >
                            <Receipt className="size-3.5 shrink-0" /> #{linkedOrder.number}
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartOrder(t);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-primary py-2 px-2 text-[11px] font-black text-white hover:opacity-90 shadow-sm transition-all"
                            title="Add food items to this table's running bill"
                          >
                            <Plus className="size-3.5 shrink-0" /> Add Items
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartOrder(t);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-primary py-2 px-3 text-xs font-black text-white hover:opacity-90 shadow-sm"
                        >
                          <Plus className="size-3.5" /> Start Bill
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFreeTable(t.id, t.name);
                        }}
                        title={`Vacate ${t.name}`}
                        className="flex items-center justify-center rounded-xl border bg-card p-2 text-muted-foreground hover:text-emerald-600 hover:border-emerald-500 transition-colors shrink-0"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                      </button>
                    </div>
                  )}

                  {t.status === "reserved" && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTables((ts) => ts.map((x) => x.id === t.id ? { ...x, status: "occupied", reservedFor: undefined } : x));
                          handleStartOrder(t);
                        }}
                        className="flex items-center justify-center gap-1 rounded-xl bg-amber-500 py-2 px-3 text-xs font-black text-white hover:bg-amber-600 transition-colors"
                      >
                        <Utensils className="size-3.5" /> Seat Guest
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFreeTable(t.id, t.name);
                        }}
                        className="flex items-center justify-center gap-1 rounded-xl border bg-card py-2 px-3 text-xs font-extrabold text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                      >
                        <X className="size-3.5" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE DETAILS DRAWER (SHEET) */}
      <Sheet open={!!selectedTable} onOpenChange={(v) => !v && setSelectedTableId(null)}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-md">
          {selectedTable && (
            <>
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="flex items-center justify-between text-xl font-black">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl font-black text-foreground">{selectedTable.name}</span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-extrabold text-muted-foreground">
                      <Users className="inline size-3.5 mr-1" /> {selectedTable.seats} Seats
                    </span>
                  </div>
                  <StatusBadge status={selectedTable.status} />
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5 text-left">
                  Floor table status, live orders, seating capacity, and history.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 pt-5">
                {/* 1. Quick Status Switcher */}
                <div>
                  <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-2">
                    Change Live Table Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetTableStatus(selectedTable.id, "available")}
                      className={cn(
                        "py-2 px-2.5 rounded-xl border text-xs font-extrabold transition-all flex items-center justify-center gap-1.5",
                        selectedTable.status === "available"
                          ? "bg-emerald-500 text-white border-emerald-600 shadow"
                          : "bg-muted/40 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500"
                      )}
                    >
                      <span className="size-2 rounded-full bg-emerald-400"></span> Available
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetTableStatus(selectedTable.id, "occupied")}
                      className={cn(
                        "py-2 px-2.5 rounded-xl border text-xs font-extrabold transition-all flex items-center justify-center gap-1.5",
                        selectedTable.status === "occupied"
                          ? "bg-primary text-white border-primary shadow"
                          : "bg-muted/40 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary"
                      )}
                    >
                      <span className="size-2 rounded-full bg-purple-400"></span> Occupied
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReserveModalTable(selectedTable);
                        setGuestName(selectedTable.reservedFor ? selectedTable.reservedFor.split(" · ")[0] || "" : "");
                        setReserveTime(selectedTable.reservedFor ? selectedTable.reservedFor.split(" · ")[1] || "" : "");
                      }}
                      className={cn(
                        "py-2 px-2.5 rounded-xl border text-xs font-extrabold transition-all flex items-center justify-center gap-1.5",
                        selectedTable.status === "reserved"
                          ? "bg-amber-500 text-white border-amber-600 shadow"
                          : "bg-muted/40 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500"
                      )}
                    >
                      <span className="size-2 rounded-full bg-amber-400"></span> Reserved
                    </button>
                  </div>
                </div>

                {/* 2. Active Dining or Reservation Status Details */}
                {selectedTable.status === "occupied" && (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-primary/15 pb-2.5">
                      <span className="text-xs font-extrabold uppercase text-primary tracking-wider flex items-center gap-1.5">
                        <Utensils className="size-4" /> Active Dining Table Order
                      </span>
                      {activeOrder && (
                        <span className="font-extrabold font-mono text-xs text-primary">
                          Bill #{activeOrder.number}
                        </span>
                      )}
                    </div>

                    {activeOrder ? (
                      <>
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-muted-foreground flex justify-between">
                            <span>Order Created:</span>
                            <span className="text-foreground">
                              {new Date(activeOrder.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-muted-foreground flex justify-between items-center">
                            <span>Payment Status:</span>
                            <span className={cn(
                              "uppercase font-black px-2 py-0.5 rounded-full text-[10px]",
                              activeOrder.paymentStatus === "paid" 
                                ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30" 
                                : "bg-amber-500/15 text-amber-600 border border-amber-500/30 animate-pulse"
                            )}>
                              {activeOrder.paymentStatus === "paid" 
                                ? `PAID (${activeOrder.paymentMethod?.toUpperCase() || "PAID"})` 
                                : "UNPAID (Pay Later)"}
                            </span>
                          </div>

                          {/* Line Items List */}
                          <div className="border-t border-dashed pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-extrabold text-muted-foreground uppercase">
                                Ordered Items ({activeOrder.items.length})
                              </span>
                              {activeOrder.paymentStatus === "unpaid" && activeOrder.status !== "cancelled" && (
                                <span className="text-[10px] text-primary font-bold">Tap 🗑️ to remove/swap dish</span>
                              )}
                            </div>
                            <ul className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                              {consolidateOrderItems(activeOrder.items).map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center text-xs p-1.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-extrabold text-foreground">{item.qty} × {item.name}</span>
                                    {item.isAddon && (
                                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600">
                                        Add-on
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-black font-mono text-primary">{inr(item.price * item.qty)}</span>
                                    {activeOrder.paymentStatus === "unpaid" && activeOrder.status !== "cancelled" && (
                                      <button
                                        type="button"
                                        title={`Remove ${item.name} from running order`}
                                        onClick={() => {
                                          if (window.confirm(`Remove ${item.name} from Bill #${activeOrder.number}?`)) {
                                            removeItemFromRunningOrder(activeOrder.id, idx);
                                          }
                                        }}
                                        className="size-6 rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                                      >
                                        <Trash2 className="size-3" />
                                      </button>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t pt-2 flex justify-between items-baseline">
                            <span className="text-xs font-extrabold uppercase text-muted-foreground">Total Payable</span>
                            <span className="text-xl font-black text-primary font-mono">{inr(activeOrder.total)}</span>
                          </div>
                        </div>

                        {/* Action buttons for active order */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleStartOrder(selectedTable)}
                            className="flex items-center justify-center gap-1 rounded-xl bg-primary py-2.5 text-xs font-black text-white hover:opacity-90 shadow"
                          >
                            <Plus className="size-4" /> Add Food Items
                          </button>
                          {activeOrder.paymentStatus === "unpaid" && activeOrder.status !== "cancelled" ? (
                            isUserMgr ? (
                              <Link
                                to="/payments"
                                search={{ order: activeOrder.id }}
                                className="flex items-center justify-center gap-1 rounded-xl border-2 border-primary bg-primary/10 text-xs font-black text-primary hover:bg-primary hover:text-white transition-colors"
                              >
                                <CreditCard className="size-4" /> Collect Bill
                              </Link>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-2 py-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                <Lock className="size-3.5" />
                                <span>Manager Settles Bill</span>
                              </div>
                            )
                          ) : (
                            <Link
                              to="/invoice/$orderId"
                              params={{ orderId: activeOrder.id }}
                              className="flex items-center justify-center gap-1 rounded-xl border border-emerald-500 bg-emerald-500/10 text-xs font-black text-emerald-700 hover:bg-emerald-500 hover:text-white transition-colors"
                            >
                              <Receipt className="size-3.5" /> View Receipt
                            </Link>
                          )}
                          {activeOrder.paymentStatus === "unpaid" && (
                            <Link
                              to="/invoice/$orderId"
                              params={{ orderId: activeOrder.id }}
                              className="flex items-center justify-center gap-1 rounded-xl border bg-card py-2 text-xs font-bold text-foreground hover:bg-muted"
                            >
                              <Receipt className="size-3.5" /> View Bill
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => handleFreeTable(selectedTable.id, selectedTable.name)}
                            className={cn(
                              "flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-bold transition-colors",
                              activeOrder.paymentStatus === "paid" 
                                ? "col-span-1 border-primary/30 text-primary hover:bg-primary/10" 
                                : "border-destructive/30 text-destructive hover:bg-destructive/10"
                            )}
                          >
                            <CheckCircle2 className="size-3.5" /> Vacate Table
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2 text-xs text-muted-foreground text-center">
                        <div className="font-bold text-foreground mb-1">Guests are seated at {selectedTable.name}</div>
                        <div>No active food order has been placed for this table yet.</div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartOrder(selectedTable)}
                            className="py-2.5 rounded-xl bg-primary text-xs font-black text-white shadow hover:opacity-90 flex items-center justify-center gap-1"
                          >
                            <Plus className="size-4" /> Start Table Bill
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFreeTable(selectedTable.id, selectedTable.name)}
                            className="py-2.5 rounded-xl border bg-card text-xs font-bold text-muted-foreground hover:text-emerald-600 hover:border-emerald-500 transition-colors"
                          >
                            Mark Available
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedTable.status === "reserved" && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                      <span className="text-xs font-extrabold uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <Calendar className="size-4" /> Reservation Details
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground font-semibold">Guest Booking Info:</div>
                      <div className="text-sm font-extrabold text-foreground">{selectedTable.reservedFor || "Reserved for Guest"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTables((ts) => {
                            const updated = ts.map((x) => x.id === selectedTable.id ? { ...x, status: "occupied" as const, reservedFor: undefined } : x);
                            const changed = updated.find((x) => x.id === selectedTable.id);
                            if (changed) syncTableToSupabase(changed);
                            return updated;
                          });
                          handleStartOrder(selectedTable);
                        }}
                        className="py-2.5 rounded-xl bg-amber-500 text-xs font-black text-white hover:bg-amber-600 shadow flex items-center justify-center gap-1"
                      >
                        <Utensils className="size-3.5" /> Seat & Start Bill
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFreeTable(selectedTable.id, selectedTable.name)}
                        className="py-2.5 rounded-xl border text-xs font-bold text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                )}

                {selectedTable.status === "available" && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center space-y-3">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold uppercase flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="size-4" /> Table is Available
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This table is clean, sanitized, and ready for walk-in guests or reservations.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleStartOrder(selectedTable)}
                        className="py-2.5 rounded-xl bg-primary text-xs font-black text-white shadow hover:opacity-90 flex items-center justify-center gap-1"
                      >
                        <Utensils className="size-3.5" /> Start Bill
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReserveModalTable(selectedTable);
                          setGuestName("");
                          setReserveTime("");
                        }}
                        className="py-2.5 rounded-xl border bg-card text-xs font-bold text-foreground hover:bg-muted"
                      >
                        Reserve Table
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Table Configuration (Capacity & Name) */}
                <div className="border-t pt-4 space-y-3">
                  <div className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                    Seating Capacity
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 4, 6, 8].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleUpdateSeats(selectedTable.id, s)}
                        className={cn(
                          "py-2 rounded-xl border text-xs font-extrabold transition-all",
                          selectedTable.seats === s
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-muted/30 text-muted-foreground hover:border-primary"
                        )}
                      >
                        {s} Seats
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Recent Order History on this Table */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                      Orders on {selectedTable.name} ({orderHistory.length})
                    </div>
                  </div>

                  {orderHistory.length === 0 ? (
                    <div className="text-xs text-muted-foreground py-2 text-center border border-dashed rounded-xl p-3">
                      No previous orders recorded for this table yet.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {orderHistory.map((o) => (
                        <div key={o.id} className="rounded-xl border p-2.5 flex items-center justify-between bg-muted/20">
                          <div>
                            <div className="font-extrabold text-xs text-foreground">Bill #{o.number}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {o.items.length} items · {new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black font-mono text-xs text-primary">{inr(o.total)}</div>
                            <StatusBadge status={o.paymentStatus} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Delete Table Option */}
                <div className="border-t pt-4">
                  <button
                    type="button"
                    onClick={() => handleDeleteTable(selectedTable.id, selectedTable.name)}
                    className="w-full py-2.5 rounded-xl border border-destructive/30 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="size-4" /> Remove {selectedTable.name} from Floor Plan
                  </button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ADD TABLE MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Utensils className="size-5 text-primary" /> Add New Restaurant Table
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTable} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-1">
                  Table Name / Code
                </label>
                <input
                  type="text"
                  required
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="e.g. T13, VIP-01, Booth-2"
                  className="h-11 w-full rounded-xl border bg-background px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-1">
                  Seating Capacity (Persons)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewTableSeats(s)}
                      className={cn(
                        "h-10 rounded-xl border text-xs font-extrabold transition-all",
                        newTableSeats === s
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "bg-background hover:border-primary text-foreground"
                      )}
                    >
                      {s} Seats
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 h-11 rounded-xl border text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-primary text-xs font-black text-primary-foreground shadow hover:opacity-90"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESERVE TABLE MODAL */}
      {reserveModalTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Calendar className="size-5 text-amber-500" /> Reserve Table {reserveModalTable.name}
              </h3>
              <button onClick={() => setReserveModalTable(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReservation} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Irfan Bhai, Khan Family"
                  className="h-11 w-full rounded-xl border bg-background px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-1">
                  Time / Note
                </label>
                <input
                  type="text"
                  value={reserveTime}
                  onChange={(e) => setReserveTime(e.target.value)}
                  placeholder="e.g. 8:30 PM, Birthday dinner"
                  className="h-11 w-full rounded-xl border bg-background px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReserveModalTable(null)}
                  className="flex-1 h-11 rounded-xl border text-xs font-bold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-amber-500 text-xs font-black text-white shadow hover:bg-amber-600"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
