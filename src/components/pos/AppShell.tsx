import { useState, useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { 
  BarChart3, ClipboardList, CreditCard, Database, 
  LayoutDashboard, LogOut, Menu, ShoppingBag, UtensilsCrossed, 
  Users, Armchair, X 
} from "lucide-react";
import { getActiveStaff, getStaffInitials, type StaffUser } from "@/lib/auth";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "New Order", icon: ShoppingBag },
  { to: "/tables", label: "Tables", icon: Armchair },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/powerbi", label: "Power BI", icon: Database },
] as const;

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-10 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-[var(--shadow-lift)]">T</div>
      <div className="leading-tight">
        <div className="font-extrabold text-foreground"></div>
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
      <div className="min-w-0 flex-1">
        <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b bg-card px-4 py-3 lg:hidden">
          <Logo />
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="rounded-lg p-2 hover:bg-muted">{open ? <X /> : <Menu />}</button>
        </header>
        <main className="mx-auto max-w-[1400px] p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
