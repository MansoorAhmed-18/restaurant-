import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/pos/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/login")({
  head: () => meta("Sign in", "Staff sign in for the Tadka restaurant POS."),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="text-2xl font-black">Tadka POS</div>
        <div>
          <div className="text-6xl">🍛🥘🍢</div>
          <h2 className="mt-6 text-4xl font-extrabold leading-tight">Every order,<br />hot and on time.</h2>
          <p className="mt-3 max-w-sm opacity-90">Billing, tables and kitchen tickets for busy restaurant floors.</p>
        </div>
        <div className="text-sm opacity-80">Spice Route Kitchen · Bengaluru</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form
          className="card-surface w-full max-w-sm p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            if (!f.get("email") || !f.get("password")) return setError("Enter your email and password.");
            setError(""); setLoading(true);
            setTimeout(() => nav({ to: "/" }), 700); // mock sign-in
          }}
        >
          <div className="lg:hidden"><Logo /></div>
          <h1 className="mt-4 text-2xl font-extrabold lg:mt-0">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to start your shift</p>
          <div className="mt-6 space-y-4">
            <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" defaultValue="ravi@spiceroute.in" className="mt-1.5 h-11 rounded-xl" /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" defaultValue="demo1234" className="mt-1.5 h-11 rounded-xl" /></div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <button disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground shadow-[var(--shadow-lift)] disabled:opacity-70">
              {loading && <Loader2 className="size-4 animate-spin" />}Sign in
            </button>
            <p className="text-center text-xs text-muted-foreground">Demo mode — any credentials work.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
