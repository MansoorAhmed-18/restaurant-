import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { PosProvider } from "@/lib/pos-store";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-bold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

import type { ErrorComponentProps } from "@tanstack/react-router";

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error("TanStack Root Error:", err);
  const router = useRouter();
  useEffect(() => { reportLovableError(err, { boundary: "tanstack_root_error_component" }); }, [err]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-xl rounded-2xl border bg-card p-6 text-left shadow-2xl">
        <h1 className="text-lg font-black text-destructive">Application Load Error</h1>
        <p className="mt-2 text-xs font-mono text-foreground bg-muted p-3 rounded-xl overflow-x-auto">
          {err.message || String(err)}
        </p>
        {err.stack && (
          <pre className="mt-2 text-[10px] font-mono text-muted-foreground bg-muted/50 p-2 rounded-xl overflow-x-auto max-h-40">
            {err.stack}
          </pre>
        )}
        <div className="mt-4 flex gap-2">
          <button onClick={() => { try { router.invalidate(); } catch {} reset(); }} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Try again</button>
          <a href="/" className="rounded-xl border px-4 py-2 text-xs font-bold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Meat Theory — Restaurant Order Management" },
      { name: "description", content: "Meat Theory POS — Tested, Crafted, Served. Restaurant POS and Order Management." },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "alternate icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  let queryClient = defaultQueryClient;
  try {
    const ctx = Route.useRouteContext();
    if (ctx && ctx.queryClient) {
      queryClient = ctx.queryClient;
    }
  } catch (e) {
    // Fallback to defaultQueryClient
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PosProvider>
        <Outlet />
        <Toaster position="top-center" />
      </PosProvider>
    </QueryClientProvider>
  );
}
