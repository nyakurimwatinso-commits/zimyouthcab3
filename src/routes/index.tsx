import { createFileRoute, Link } from "@tanstack/react-router";
import { NavBar } from "@/components/cab3/NavBar";
import { Hero } from "@/components/cab3/Hero";
import { NewsFeed } from "@/components/cab3/NewsFeed";
import { WhyGrid } from "@/components/cab3/WhyGrid";
import { Poll } from "@/components/cab3/Poll";
import { Footer } from "@/components/cab3/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CAB3 Pambili — Empowering Zimbabwe's Youth" },
      { name: "description", content: "Join the youth-led movement backing the Constitution of Zimbabwe Amendment No. 3 Bill. Stability. Progress. Prosperity." },
      { property: "og:title", content: "CAB3 Pambili — Empowering Zimbabwe's Youth" },
      { property: "og:description", content: "Policy continuity. Economic growth. National stability. A better Zimbabwe, together." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Decorative Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 opacity-30 blur-[140px] bg-[radial-gradient(ellipse_at_top,oklch(var(--primary)),transparent_60%)]" />
      <div className="absolute top-[40%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full opacity-10 blur-[100px] bg-primary" />
      
      <NavBar />
      
      <main className="space-y-4 md:space-y-8">
        <Hero />
        
        {/* News & Updates Section with soft divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/65">最新 News Feed</span>
          </div>
        </div>
        <NewsFeed />
        
        <WhyGrid />
        
        <Poll />

        {/* Movement Quick Stats Section */}
        <section className="px-5 py-6">
          <div className="mx-auto max-w-4xl grid grid-cols-3 gap-4 rounded-2xl bg-muted/40 p-5 text-center border border-border/50 backdrop-blur-sm">
            <div>
              <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">10k+</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Youth Joined</p>
            </div>
            <div className="border-x border-border/60">
              <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">10/10</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Provinces</p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight text-primary sm:text-3xl">100%</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Progressive</p>
            </div>
          </div>
        </section>

        {/* Premium Reengineered CTA Signup Block */}
        <section className="px-5 pb-16 pt-4">
          <div className="group relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-[oklch(0.25_0.1_152)] to-[oklch(0.18_0.08_152)] p-8 sm:p-12 text-center text-primary-foreground shadow-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-primary/40">
            {/* Subtle card grid effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
                🔥 Step Up
              </span>
              
              <h2 className="mt-5 font-display text-3xl font-black tracking-tight sm:text-5xl max-w-xl leading-[1.1]">
                Join thousands of youths driving the vision.
              </h2>
              
              <p className="mt-4 max-w-md text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                Get matched directly to your dedicated provincial WhatsApp organizing community the moment you sign up.
              </p>
              
              <div className="mt-8 w-full sm:w-auto">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="tap-press group/btn relative w-full sm:w-auto h-13 rounded-full bg-gold px-10 font-bold text-gold-foreground shadow-glow transition-all duration-200 hover:bg-gold/95 hover:scale-[1.02] active:scale-[0.98] text-base"
                  >
                    Sign Up Now 
                    <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1 ml-1.5">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

