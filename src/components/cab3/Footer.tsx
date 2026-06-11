import { FlagBar } from "./FlagBar";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <FlagBar />
      <div className="mx-auto max-w-5xl px-5 py-8 text-center">
        <p className="font-display text-lg font-black tracking-tight text-foreground">
          #CAB<span className="text-gold">3</span> Pambili nge CAB3
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Stability · Progress · Prosperity
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          A youth-led movement for a better Zimbabwe, together.
        </p>
      </div>
    </footer>
  );
}
