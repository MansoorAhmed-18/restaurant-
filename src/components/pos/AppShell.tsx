import { useState, useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { 
  ClipboardList, CreditCard, LayoutDashboard, LogOut, Menu, 
  ShoppingBag, UtensilsCrossed, Armchair, X 
} from "lucide-react";
import { getActiveStaff, getStaffInitials, type StaffUser } from "@/lib/auth";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "New Order", icon: ShoppingBag },
  { to: "/tables", label: "Tables", icon: Armchair },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/payments", label: "Payments", icon: CreditCard },
] as const;

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-[var(--shadow-lift)]">T</div>
      <div className="leading-tight">
        <div className="font-extrabold text-foreground">Tan&apos;s Kitchen</div>
        <div className="text-xs text-muted-foreground">Spice Route Kitchen</div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState<StaffUser>(getActiveStaff());

  useEffect(() => {
    setStaff(getActiveStaff());
  }, []);

  const side = (
    <aside className="flex h-full w-64 flex-col border-r bg-sidebar p-4">
      <div className="px-2 py-2"><Logo /></div>
      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link 
            key={to} 
            to={to} 
            onClick={() => setOpen(false)} 
            activeOptions={{ exact: to === "/" }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{ className: "!bg-sidebar-accent !text-sidebar-accent-foreground" }}
          >
            <Icon className="size-5" />{label}
          </Link>
        ))}
      </nav>

      {/* Dynamic Logged-in Staff Profile */}
      <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
        <div className="grid size-9 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground uppercase shadow-sm">
          {getStaffInitials(staff.name)}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <div className="font-bold truncate text-foreground">{staff.name}</div>
          <div className="text-xs text-muted-foreground font-medium">{staff.role}</div>
        </div>
        <Link to="/login" aria-label="Log out" title="Log out / Switch Staff" className="text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="size-4" />
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen">
      <div className="no-print sticky top-0 hidden h-screen lg:block">{side}</div>
      {open && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="relative h-full w-64">{side}</div>
        </div>
      )}
      <div className="min-w-0 flex-1 flex flex-col min-h-screen pb-16 lg:pb-0">
        <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden shadow-sm">
          <Logo />
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="rounded-xl border p-2 hover:bg-muted text-foreground">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>
        <main className="mx-auto w-full max-w-[1400px] p-3 sm:p-5 md:p-8 flex-1">{children}</main>
      </div>

      {/* Mobile Bottom Quick Navigation Dock (lg:hidden) */}
      <nav className="no-print fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t bg-card/95 backdrop-blur-md px-1 py-2 lg:hidden shadow-lg">
        {[
          { to: "/pos", label: "POS Bill", icon: ShoppingBag },
          { to: "/orders", label: "Orders", icon: ClipboardList },
          { to: "/tables", label: "Tables", icon: Armchair },
          { to: "/menu", label: "Menu", icon: UtensilsCrossed },
          { to: "/", label: "Home", icon: LayoutDashboard },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-extrabold text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "!text-primary" }}
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
