import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="hero-bg relative overflow-hidden px-5 pt-12 pb-16 text-white border-b border-white/5">
      {/* Dynamic dark gradient mesh overlay to ensure high text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-background/95 -z-10" />
      
      {/* Decorative localized subtle glow spot */}
      <div className="absolute top-1/4 right-[-20%] -z-10 h-[350px] w-[350px] rounded-full bg-gold/10 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Animated Pill Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm shadow-inner mb-6 hover:border-gold/40 transition-colors duration-300">
          🇿🇼 Vision 2030 · Youth Edition
        </span>
        
        <h1 className="font-display text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl max-w-4xl">
          Empowering the Future:{" "}
          <span className="bg-gradient-to-r from-gold via-[oklch(0.92_0.15_90)] to-white bg-clip-text text-transparent">
            Why Zimbabwe's Youth Stand with CAB3.
          </span>
        </h1>
        
        <p className="mt-5 max-w-2xl text-base/relaxed text-white/90 sm:text-lg font-normal">
          Policy continuity. Economic growth. National stability. Giving our country a real runway to deliver Vision 2030 — built by a generation that refuses to wait.
        </p>
        
        {/* Actions Button Group */}
        <div className="mt-8 flex flex-wrap gap-3.5">
          <Link to="/auth" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="tap-press group/btn w-full sm:w-auto h-12 rounded-full bg-gold px-7 font-bold text-gold-foreground shadow-glow transition-all duration-200 hover:bg-gold/95 hover:scale-[1.02] active:scale-[0.98]"
            >
              Join the Movement 
              <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1 ml-1.5">→</span>
            </Button>
          </Link>
          <a href="#why-cab3" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="tap-press w-full sm:w-auto h-12 rounded-full border-white/20 bg-white/5 px-7 font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/15 hover:border-white/40 active:scale-[0.98]"
            >
              Explore the Benefits
            </Button>
          </a>
        </div>

        {/* Reengineered Dynamic Grid Badges */}
        <div className="mt-12 grid grid-cols-3 gap-3 text-center sm:max-w-2xl">
          {[
            { k: "7yr", v: "Stable cycle" },
            { k: "10", v: "Provinces mobilising" },
            { k: "100%", v: "Youth-driven" },
          ].map((s) => (
            <div 
              key={s.k} 
              className="group/card rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.07] hover:-translate-y-0.5"
            >
              <div className="font-display text-2xl sm:text-3xl font-black text-gold drop-shadow-[0_2px_10px_rgba(212,175,55,0.2)] transition-transform duration-300 group-hover/card:scale-105">
                {s.k}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/70 mt-1">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
