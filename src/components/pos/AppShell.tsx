import { useState, useEffect, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  ClipboardList, CreditCard, LayoutDashboard, LogOut, Menu, 
  ShoppingBag, UtensilsCrossed, X, KeyRound, UserPlus, Trash2, 
  ShieldCheck, User, Lock, Eye, EyeOff, Loader2, ChefHat, Edit3, Check 
} from "lucide-react";
import { toast } from "sonner";
import { 
  getActiveStaff, getStaffInitials, isAuthenticated, logout, 
  getRegisteredAccounts, addStaffAccount, removeStaffAccount, 
  updateManagerCredentials, getManagerAccount, 
  type StaffUser, type StaffAccount 
} from "@/lib/auth";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "New Order", icon: ShoppingBag },
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
  const navRouter = useNavigate();
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Staff Management Modal State (for Manager only)
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<StaffAccount[]>([]);
  
  // Add Staff Form State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffUser, setNewStaffUser] = useState("");
  const [newStaffPass, setNewStaffPass] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"Cashier" | "Chef / Kitchen">("Cashier");

  // Edit Manager Credentials State
  const [isEditingMgr, setIsEditingMgr] = useState(false);
  const [mgrName, setMgrName] = useState("");
  const [mgrUser, setMgrUser] = useState("");
  const [mgrPass, setMgrPass] = useState("");

  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      navRouter({ to: "/login" });
      return;
    }
    const currentStaff = getActiveStaff();
    if (!currentStaff) {
      navRouter({ to: "/login" });
      return;
    }
    setStaff(currentStaff);
    setCheckingAuth(false);
    
    const accs = getRegisteredAccounts();
    setAccounts(accs);
    const mgr = getManagerAccount();
    setMgrName(mgr.name);
    setMgrUser(mgr.username);
    setMgrPass(mgr.password);
  }, [navRouter]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navRouter({ to: "/login" });
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;
    toast.info("Saving staff account to cloud...");
    const res = await addStaffAccount(newStaffName, newStaffUser, newStaffPass, newStaffRole, staff.name);
    if (!res.success) {
      toast.error(res.message || "Failed to add staff member");
      return;
    }
    toast.success(`${newStaffRole} account "${newStaffUser}" saved & synced to cloud!`);
    setNewStaffName("");
    setNewStaffUser("");
    setNewStaffPass("");
    setAccounts(getRegisteredAccounts());
  };

  const handleUpdateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Updating master manager credentials...");
    const res = await updateManagerCredentials(mgrName, mgrUser, mgrPass);
    if (!res.success) {
      toast.error(res.message || "Failed to update Manager credentials.");
      return;
    }
    toast.success("Master Manager credentials updated & synced!");
    setIsEditingMgr(false);
    setAccounts(getRegisteredAccounts());
    const current = getActiveStaff();
    if (current) setStaff(current);
  };

  const handleDeleteAccount = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete account "${name}"?`)) return;
    const res = await removeStaffAccount(id);
    if (!res.success) {
      toast.error(res.message || "Failed to remove account");
      return;
    }
    toast.success(`Account "${name}" removed.`);
    setAccounts(getRegisteredAccounts());
  };

  if (checkingAuth || !staff) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  const isManager = staff.role === "Manager";

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

        {/* Manager-only Staff Accounts button */}
        {isManager && (
          <button
            onClick={() => {
              setOpen(false);
              const accs = getRegisteredAccounts();
              setAccounts(accs);
              const mgr = getManagerAccount();
              setMgrName(mgr.name);
              setMgrUser(mgr.username);
              setMgrPass(mgr.password);
              setStaffModalOpen(true);
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary/90 transition-colors hover:bg-primary/10 hover:text-primary mt-2 border border-primary/20 bg-primary/5"
          >
            <KeyRound className="size-5 text-primary" />
            <span>Staff Logins</span>
          </button>
        )}
      </nav>

      {/* Dynamic Logged-in Staff Profile */}
      <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
        <div className="grid size-9 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground uppercase shadow-sm">
          {getStaffInitials(staff.name)}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <div className="font-bold truncate text-foreground flex items-center gap-1">
            <span>{staff.name}</span>
            {isManager && <ShieldCheck className="size-3.5 text-primary shrink-0" />}
          </div>
          <div className="text-xs text-muted-foreground font-medium">{staff.role} ({staff.username})</div>
        </div>
        <button 
          onClick={handleLogout} 
          aria-label="Log out" 
          title="Secure Log Out" 
          className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-background transition-colors"
        >
          <LogOut className="size-4" />
        </button>
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
          <div className="flex items-center gap-2">
            {isManager && (
              <button 
                onClick={() => {
                  setAccounts(getRegisteredAccounts());
                  setStaffModalOpen(true);
                }}
                title="Manage Staff"
                className="rounded-xl border p-2 text-primary hover:bg-muted"
              >
                <KeyRound className="size-4" />
              </button>
            )}
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="rounded-xl border p-2 hover:bg-muted text-foreground">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] p-3 sm:p-5 md:p-8 flex-1">{children}</main>
      </div>

      {/* Mobile Bottom Quick Navigation Dock (lg:hidden) */}
      <nav className="no-print fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t bg-card/95 backdrop-blur-md px-1 py-2 lg:hidden shadow-lg">
        {[
          { to: "/pos", label: "POS Bill", icon: ShoppingBag },
          { to: "/orders", label: "Orders", icon: ClipboardList },
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

      {/* MANAGER ONLY: Staff Accounts & Kitchen Logins Modal */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border bg-card p-4 sm:p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">Manager Portal: Staff & Kitchen Logins</h2>
                  <p className="text-xs text-muted-foreground">Manage your Master Manager credentials and create Cashier/Chef accounts</p>
                </div>
              </div>
              <button 
                onClick={() => setStaffModalOpen(false)} 
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* SECTION 1: MASTER MANAGER ACCOUNT CARD */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
                  <ShieldCheck className="size-4" /> Master Manager Account (Only 1 Account)
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingMgr(!isEditingMgr)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <Edit3 className="size-3.5" /> {isEditingMgr ? "Cancel Edit" : "Change Manager Password/ID"}
                </button>
              </div>

              {!isEditingMgr ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-background rounded-lg p-2.5 border">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold block">Manager Name</span>
                    <span className="font-extrabold text-foreground">{mgrName}</span>
                  </div>
                  <div className="bg-background rounded-lg p-2.5 border">
                    <span className="text-muted-foreground text-[10px] uppercase font-bold block">Manager Login ID</span>
                    <span className="font-extrabold font-mono text-primary">{mgrUser}</span>
                  </div>
                  <div className="bg-background rounded-lg p-2.5 border flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground text-[10px] uppercase font-bold block">Manager Password</span>
                      <span className="font-extrabold font-mono text-foreground">
                        {showPasswords["mgr"] ? mgrPass : "••••••••"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, mgr: !prev["mgr"] }))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords["mgr"] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateManager} className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">Manager Name</label>
                      <input
                        type="text"
                        required
                        value={mgrName}
                        onChange={(e) => setMgrName(e.target.value)}
                        className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">Manager Login ID</label>
                      <input
                        type="text"
                        required
                        value={mgrUser}
                        onChange={(e) => setMgrUser(e.target.value)}
                        className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">New Manager Password</label>
                      <input
                        type="text"
                        required
                        value={mgrPass}
                        onChange={(e) => setMgrPass(e.target.value)}
                        className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-black text-primary-foreground shadow"
                    >
                      <Check className="size-3.5" /> Save Manager Credentials
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* SECTION 2: CREATE NEW CASHIER OR KITCHEN/CHEF ACCOUNT */}
            <form onSubmit={handleCreateStaff} className="rounded-xl border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-foreground uppercase tracking-wider">
                <UserPlus className="size-4 text-primary" /> Create Staff Login (Cashier / Kitchen)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Staff Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="h-9 w-full rounded-lg border bg-background px-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Cashier">🧑‍💼 Cashier</option>
                    <option value="Chef / Kitchen">👨‍🍳 Chef / Kitchen</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Staff Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Login ID / Username</label>
                  <input
                    type="text"
                    required
                    value={newStaffUser}
                    onChange={(e) => setNewStaffUser(e.target.value)}
                    placeholder="e.g. cashier1 or chef1"
                    className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Password</label>
                  <input
                    type="text"
                    required
                    value={newStaffPass}
                    onChange={(e) => setNewStaffPass(e.target.value)}
                    placeholder="e.g. 1234"
                    className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-black text-primary-foreground shadow hover:opacity-90 transition-opacity"
                >
                  + Add Staff Account
                </button>
              </div>
            </form>

            {/* SECTION 3: LIST OF REGISTERED CASHIERS & CHEFS */}
            <div className="space-y-2.5">
              <div className="text-xs font-black text-foreground uppercase tracking-wider">
                Active Staff Logins ({accounts.length})
              </div>
              <div className="rounded-xl border divide-y bg-background overflow-hidden">
                {accounts.map((acc) => {
                  const isAccMgr = acc.role === "Manager";
                  const isChef = acc.role === "Chef / Kitchen";
                  const isVisible = showPasswords[acc.id];
                  return (
                    <div key={acc.id} className="flex items-center justify-between p-3 text-xs gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`grid size-8 place-items-center rounded-lg font-bold shrink-0 ${
                          isAccMgr ? "bg-primary text-primary-foreground" : isChef ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"
                        }`}>
                          {isAccMgr ? <ShieldCheck className="size-4" /> : isChef ? <ChefHat className="size-4" /> : <User className="size-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-foreground truncate flex items-center gap-1.5">
                            <span>{acc.name}</span>
                            <span className={`text-[10px] rounded px-1.5 py-0.5 font-bold uppercase ${
                              isAccMgr ? "bg-primary/10 text-primary" : isChef ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"
                            }`}>
                              {acc.role}
                            </span>
                          </div>
                          <div className="text-muted-foreground font-mono text-[11px] mt-0.5">
                            Login ID: <span className="font-bold text-foreground">{acc.username}</span>
                          </div>
                        </div>
                      </div>

                      {/* Password & Delete Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg font-mono text-[11px]">
                          <Lock className="size-3 text-muted-foreground" />
                          <span className="font-bold text-foreground">
                            {isVisible ? acc.password : "••••••••"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowPasswords((prev) => ({ ...prev, [acc.id]: !prev[acc.id] }))}
                            className="text-muted-foreground hover:text-foreground ml-1"
                            title={isVisible ? "Hide Password" : "Show Password"}
                          >
                            {isVisible ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                          </button>
                        </div>

                        {!isAccMgr && (
                          <button
                            onClick={() => handleDeleteAccount(acc.id, acc.name)}
                            title="Delete Staff Account"
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground flex items-center gap-2">
              <KeyRound className="size-4 text-primary shrink-0" />
              <span>Only staff with these registered IDs and Passwords can log into the POS terminal. Send these credentials to your cashier or kitchen team.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
