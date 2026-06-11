import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="hero-bg px-5 pt-10 pb-14 text-white">
      <div className="relative mx-auto max-w-5xl">
        <span className="chip mb-5">🇿🇼 Vision 2030 · Youth Edition</span>
        <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Empowering the Future:{" "}
          <span className="bg-gradient-to-r from-[oklch(0.85_0.17_85)] to-[oklch(0.95_0.12_95)] bg-clip-text text-transparent">
            Why Zimbabwe's Youth Stand with CAB3.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-base/relaxed text-white/85 sm:text-lg">
          Policy continuity. Economic growth. National stability. Real runway to deliver Vision 2030 —
          built by a generation that refuses to wait.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/auth">
            <Button
              size="lg"
              className="tap-press h-12 rounded-full bg-gold px-6 font-bold text-gold-foreground shadow-glow hover:bg-gold/90"
            >
              Join the Movement →
            </Button>
          </Link>
          <a href="#why-cab3">
            <Button
              size="lg"
              variant="outline"
              className="tap-press h-12 rounded-full border-white/40 bg-white/10 px-6 font-bold text-white backdrop-blur hover:bg-white/20"
            >
              Explore the Benefits
            </Button>
          </a>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2 text-center">
          {[
            { k: "7yr", v: "Stable cycle" },
            { k: "10", v: "Provinces mobilising" },
            { k: "100%", v: "Youth-driven" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-white/15 bg-white/10 px-2 py-3 backdrop-blur">
              <div className="font-display text-2xl font-black text-gold">{s.k}</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-white/75">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
