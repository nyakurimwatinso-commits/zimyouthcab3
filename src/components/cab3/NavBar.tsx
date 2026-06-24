import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin privileges to conditionally show the Admin Dashboard entry link
  useEffect(() => {
    (async () => {
      const { data: ud } = await supabase.auth.getUser();
      if (ud.user?.id) {
        const { data: role } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", ud.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (role) setIsAdmin(true);
      }
    })();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed out successfully");
    navigate({ to: "/auth" });
  };

  const navLinks = [
    { to: "/youth-hub", label: "🏠 Hub" },
    { to: "/polls", label: "🗳️ Polls" },
    { to: "/opportunities", label: "💼 Opportunities" },
    { to: "/events", label: "📅 Events" },
    { to: "/analytics", label: "📈 Leaderboard" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand Title Frame */}
          <div className="flex items-center">
            <Link to="/youth-hub" className="font-display text-xl font-black tracking-wider text-primary">
              CAB3 <span className="text-foreground font-sans text-sm font-bold">PAMBILI</span>
            </Link>
          </div>

          {/* Desktop Navigation Links Frame */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-4 py-2 text-xs font-bold text-muted-foreground/90 transition-all hover:bg-muted hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
              >
                {link.label}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/campaign-admin"
                className="rounded-full px-4 py-2 text-xs font-bold text-gold bg-gold/10 hover:bg-gold/20 transition-all flex items-center gap-1 [&.active]:ring-2 [&.active]:ring-gold"
              >
                <ShieldCheck size={14} /> Admin
              </Link>
            )}
          </div>

          {/* Desktop Action Logout Anchor Component */}
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-full font-bold text-xs flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
              <LogOut size={14} /> Sign Out
            </Button>
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Sliding Navigation Drawer Panel Frame */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1.5 px-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-muted hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/campaign-admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-gold bg-gold/5 hover:bg-gold/10"
              >
                <ShieldCheck size={16} /> Campaign Dashboard
              </Link>
            )}

            <div className="border-t border-border/60 mt-4 pt-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/5"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

