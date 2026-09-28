import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock, User, KeyRound, ShieldCheck, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/pos/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { meta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { setActiveStaff } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => meta("Staff Sign In", "Restaurant staff & manager portal sign-in."),
  component: Login,
});

export function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<"passcode" | "email">("passcode");
  const [role, setRole] = useState<"Cashier" | "Manager" | "Kitchen Admin">("Manager");
  const [staffName, setStaffName] = useState("Mansoor Ahmed");
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("mansoor@spiceroute.in");
  const [password, setPassword] = useState("demo1234");
  const [shift, setShift] = useState("Morning Shift");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) {
      toast.error("Please enter your staff name.");
      return;
    }
    if (loginMode === "passcode" && passcode.length < 4) {
      toast.error("Please enter a 4-digit staff passcode.");
      return;
    }
    if (loginMode === "email" && (!email || !password)) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    toast.info(`Authenticating ${staffName} (${role})...`);

    // Save dynamic staff session
    setActiveStaff({
      name: staffName.trim(),
      role,
      email,
      shift,
    });

    setTimeout(() => {
      setLoading(false);
      toast.success(`Welcome, ${staffName.trim()} (${role} - ${shift})!`);
      nav({ to: "/" });
    }, 500);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      {/* Left Branding Showcase Panel */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-primary via-primary/95 to-orange-600 p-12 text-primary-foreground lg:flex relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 size-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-white text-primary text-xl font-black shadow-lg">T</div>
            <div className="leading-tight">
              <div className="text-xl font-black"> Tan's Kitchen</div>
              <div className="text-xs opacity-80">Spice Route Kitchen Systems</div>
            </div>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-md">v2.4 Pro</span>
        </div>

        <div className="z-10 my-auto py-12">
          <div className="text-7xl mb-6">🍛 🥘 🍢 🍹</div>
          <h2 className="text-4xl font-black leading-tight tracking-tight">
            Fast Billing. Real-Time Collections.<br />Zero Lag.
          </h2>
          <p className="mt-4 max-w-md text-base opacity-90 leading-relaxed font-medium">
            Complete billing software built for high-volume restaurant floors, table order tracking, and live Supabase + Power BI analytics.
          </p>

          <div className="mt-8 flex items-center gap-6 border-t border-white/20 pt-6">
            <div>
              <div className="text-2xl font-black">₹3,024</div>
              <div className="text-xs opacity-80">Today&apos;s Net Collection</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div>
              <div className="text-2xl font-black">100% Sync</div>
              <div className="text-xs opacity-80">Supabase & Power BI Live</div>
            </div>
          </div>
        </div>

        <div className="z-10 flex items-center justify-between text-xs opacity-80 border-t border-white/10 pt-4">
          <span>Spice Route Kitchen • Bengaluru, KA</span>
          <span>Active Shift: {shift}</span>
        </div>
      </div>

      {/* Right Sign-in Form Panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden mb-6"><Logo /></div>

          <div>
            <h1 className="text-2xl font-black tracking-tight">Staff Sign In 🔒</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select your role, enter staff name & credentials to start shift
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Cashier", label: "Cashier", icon: User },
              { id: "Manager", label: "Manager", icon: ShieldCheck },
              { id: "Kitchen Admin", label: "Kitchen", icon: UtensilsCrossed },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-bold transition-all",
                    role === r.id
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                      : "bg-card text-muted-foreground hover:border-primary"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Login Mode Switch */}
          <div className="flex rounded-xl bg-muted p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLoginMode("passcode")}
              className={cn("flex-1 py-2 rounded-lg transition-colors", loginMode === "passcode" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Quick PIN Code
            </button>
            <button
              type="button"
              onClick={() => setLoginMode("email")}
              className={cn("flex-1 py-2 rounded-lg transition-colors", loginMode === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Email & Password
            </button>
          </div>

          <form onSubmit={handleSubmit} className="card-surface p-6 space-y-4">
            {/* Staff Name Input */}
            <div>
              <Label htmlFor="staffName" className="text-xs font-extrabold text-muted-foreground uppercase">
                Staff / User Name
              </Label>
              <Input
                id="staffName"
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="Enter your name (e.g., Mansoor Ahmed)"
                className="mt-1 h-11 rounded-xl text-sm font-bold"
              />
            </div>

            {loginMode === "passcode" ? (
              <div className="space-y-2">
                <Label htmlFor="passcode" className="text-xs font-extrabold text-muted-foreground uppercase">
                  Staff 4-Digit Quick PIN (Default: 1234)
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="passcode"
                    type="password"
                    maxLength={4}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="• • • •"
                    className="h-12 pl-10 text-center font-mono text-xl tracking-[0.5em] font-black rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-xs font-extrabold text-muted-foreground uppercase">Staff Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-xs font-extrabold text-muted-foreground uppercase">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 h-11 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Shift Selector */}
            <div className="space-y-1 pt-1 border-t">
              <Label className="text-xs font-extrabold text-muted-foreground uppercase">Work Shift</Label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="h-10 w-full rounded-xl border bg-card px-3 text-xs font-bold shadow-sm"
              >
                <option value="Morning Shift">Morning Shift (09:00 AM - 04:00 PM)</option>
                <option value="Evening Shift">Evening Shift (04:00 PM - 11:30 PM)</option>
                <option value="Night Shift">Night Shift (11:30 PM - 04:00 AM)</option>
              </select>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[var(--shadow-lift)] hover:opacity-90 disabled:opacity-70 transition-all mt-4"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-4" />}
              <span>Sign In as {staffName || "Staff"} ({role})</span>
            </button>

            <p className="text-center text-xs text-muted-foreground pt-1">
              Demo Mode Active — Any PIN (e.g. 1234) or credentials will sign in.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
