import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FlagBar } from "./FlagBar";

export function NavBar() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <FlagBar />
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
            ✊
          </span>
          <span>
            #CAB<span className="text-gold">3</span>
            <span className="ml-1 text-xs font-semibold text-muted-foreground">Pambili</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1.5 text-sm">
          {hasSession ? (
            <Link to="/youth-hub">
              <Button size="sm" variant="ghost" className="tap-press font-semibold">
                Youth Hub
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="tap-press bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                Join
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
