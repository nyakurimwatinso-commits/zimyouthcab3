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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg transition-all duration-300 shadow-sm">
      <FlagBar />
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
        
        {/* Upgraded Logo Container */}
        <Link 
          to="/" 
          className="group flex items-center gap-2.5 font-display text-lg font-black tracking-tight active:scale-[0.98] transition-transform"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base text-primary-foreground shadow-md group-hover:scale-105 transition-transform duration-200">
            ✊
          </span>
          <span className="flex items-center font-black tracking-tighter text-foreground">
            #CAB
            <span className="bg-gradient-to-br from-gold to-[oklch(0.75_0.15_85)] bg-clip-text text-transparent ml-0.5 drop-shadow-sm">
              3
            </span>
            <span className="ml-1.5 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
              Pambili
            </span>
          </span>
        </Link>

        {/* Dynamic Navigation Options */}
        <nav className="flex items-center gap-2">
          {hasSession ? (
            <Link to="/youth-hub">
              <Button 
                size="sm" 
                variant="ghost" 
                className="tap-press h-9 px-4 rounded-full font-bold text-sm text-foreground hover:bg-muted/80 active:bg-muted"
              >
                Youth Hub
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button 
                size="sm" 
                className="tap-press h-9 px-5 rounded-full bg-primary font-bold text-sm text-primary-foreground shadow-sm hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Join
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
