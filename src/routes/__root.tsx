import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
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
      { title: "CAB3 Pambili — Zimbabwe Youth Movement" },
      { name: "description", content: "Youth Nation Connect mobilizes Zimbabwean youth for the Constitution of Zimbabwe Amendment No. 3 Bill (CAB3)." },
      { name: "author", content: "CAB3 Pambili" },
      { property: "og:title", content: "CAB3 Pambili — Zimbabwe Youth Movement" },
      { property: "og:description", content: "Youth Nation Connect mobilizes Zimbabwean youth for the Constitution of Zimbabwe Amendment No. 3 Bill (CAB3)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "CAB3 Pambili — Zimbabwe Youth Movement" },
      { name: "twitter:description", content: "Youth Nation Connect mobilizes Zimbabwean youth for the Constitution of Zimbabwe Amendment No. 3 Bill (CAB3)." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/d7QTsxBhM2M2wN5EcJqoh0sbBCn2/social-images/social-1781164474590-1000612697.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/d7QTsxBhM2M2wN5EcJqoh0sbBCn2/social-images/social-1781164474590-1000612697.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const hasBackendConfig = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!hasBackendConfig) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <section className="w-full max-w-md rounded-2xl border border-border bg-card p-7 text-center shadow-card">
          <h1 className="font-display text-2xl font-black text-foreground">Setup is almost complete</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This deployment is missing its public backend connection settings. Add
            VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in the hosting environment, then
            redeploy.
          </p>
        </section>
      </main>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <SonnerToaster />
    </QueryClientProvider>
  );
}

