import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Loader2, Lock, User, ShieldCheck, KeyRound, 
  Sparkles, CheckCircle2, Eye, EyeOff, UserPlus 
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/pos/AppShell";
import { meta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { 
  authenticate, registerManager, getRegisteredAccounts, 
  hasManagerAccount, isAuthenticated 
} from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => meta("Secure Staff Sign In", "Manager & Cashier authentication portal for restaurant POS."),
  component: Login,
});

export function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Login Form States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Register Master Manager Form States
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const accounts = getRegisteredAccounts();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated()) {
      nav({ to: "/" });
    }
  }, [nav]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both Username/ID and Password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = authenticate(username, password);
      setLoading(false);

      if (!res.success || !res.staff) {
        toast.error(res.message || "Invalid Username/ID or Password.");
        return;
      }

      toast.success(`Welcome back, ${res.staff.name} (${res.staff.role})!`);
      nav({ to: "/" });
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      toast.error("Please fill in all registration fields.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }
    if (regPassword.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerManager(regName, regUsername, regPassword);
      setLoading(false);

      if (!res.success) {
        toast.error(res.message || "Failed to register manager.");
        return;
      }

      toast.success("Master Manager Account created! Logging you in...");
      authenticate(regUsername, regPassword);
      nav({ to: "/" });
    }, 400);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      {/* Left Branding Panel */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-primary via-primary/95 to-orange-600 p-12 text-primary-foreground lg:flex relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 size-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-white text-primary text-xl font-black shadow-lg">T</div>
            <div className="leading-tight">
              <div className="text-xl font-black">Tan&apos;s Kitchen</div>
              <div className="text-xs opacity-80">Spice Route Kitchen Systems</div>
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-md">Secure POS v3.0</span>
        </div>

        <div className="z-10 my-auto py-12">
          <div className="text-7xl mb-6">🔒 🍛 🧾</div>
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Role-Based Authentication & Complete POS Security.
          </h2>
          <p className="mt-4 max-w-md text-base opacity-90 leading-relaxed font-medium">
            Strict access control for Managers & Cashiers. Protects your live revenue, kitchen tickets, and billing terminal against unauthorized URL visits.
          </p>

          <div className="mt-8 space-y-3 border-t border-white/20 pt-6">
            <div className="flex items-center gap-2.5 text-sm font-bold">
              <CheckCircle2 className="size-5 text-amber-300 shrink-0" />
              <span>Manager Master Account & Cashier Credentials</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-bold">
              <CheckCircle2 className="size-5 text-amber-300 shrink-0" />
              <span>Full Route Guard (Zero unauthorized URL bypass)</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-bold">
              <CheckCircle2 className="size-5 text-amber-300 shrink-0" />
              <span>Live Multi-Device Supabase Cloud Sync</span>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs opacity-80 border-t border-white/10 pt-4">
          <span>Tan&apos;s Kitchen • Bengaluru, KA</span>
          <span>Protected POS Terminal</span>
        </div>
      </div>

      {/* Right Sign-in & Register Panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden mb-4"><Logo /></div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-muted p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={cn(
                "flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5", 
                mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <KeyRound className="size-3.5" /> Sign In (Manager / Cashier)
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={cn(
                "flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5", 
                mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <UserPlus className="size-3.5" /> Manager Sign Up
            </button>
          </div>

          {/* MODE 1: LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  Staff Sign In <Lock className="size-5 text-primary" />
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your assigned ID/Username and Password to access the terminal
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-1">
                    Login ID / Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. manager or cashier1"
                      className="h-11 w-full rounded-xl border bg-card pl-10 pr-4 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-11 w-full rounded-xl border bg-card pl-10 pr-10 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                <span>{loading ? "Verifying Credentials..." : "Sign In to POS"}</span>
              </button>
            </form>
          )}

          {/* MODE 2: MANAGER REGISTRATION FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-foreground">
                  Manager Sign Up <ShieldCheck className="size-6 text-primary" />
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Create a Master Manager account. The manager can generate Cashier accounts from the dashboard.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-1">
                    Manager Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Mansoor Ahmed"
                    className="h-11 w-full rounded-xl border bg-card px-3 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-1">
                    Manager Username / Login ID
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. admin or mansoor"
                    className="h-11 w-full rounded-xl border bg-card px-3 text-sm font-mono font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-1">
                      Set Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Enter password"
                      className="h-11 w-full rounded-xl border bg-card px-3 text-sm font-mono font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider block mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="h-11 w-full rounded-xl border bg-card px-3 text-sm font-mono font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                <span>{loading ? "Creating Master Account..." : "Create Manager Account & Log In"}</span>
              </button>
            </form>
          )}

          {/* Quick Default Accounts Tip */}
          <div className="rounded-xl border bg-muted/40 p-3.5 space-y-1.5 text-xs text-muted-foreground">
            <div className="font-extrabold text-foreground flex items-center gap-1.5">
              <KeyRound className="size-3.5 text-primary" /> Default Ready-to-Use Logins:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
              <div className="bg-background rounded-lg p-2 border">
                <div className="font-bold text-primary">👔 Manager</div>
                <div>ID: <span className="font-bold text-foreground">manager</span></div>
                <div>Pass: <span className="font-bold text-foreground">admin</span></div>
              </div>
              <div className="bg-background rounded-lg p-2 border">
                <div className="font-bold text-emerald-600">🧑‍💼 Cashier</div>
                <div>ID: <span className="font-bold text-foreground">cashier</span></div>
                <div>Pass: <span className="font-bold text-foreground">123</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
