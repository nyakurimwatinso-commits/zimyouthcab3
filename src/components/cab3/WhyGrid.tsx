import { WHY_CARDS } from "@/lib/cab3-data";

export function WhyGrid() {
  return (
    <section id="why-cab3" className="px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7">
          <span className="chip">Why CAB3 Matters</span>
          <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Built for the youth who refuse to be a footnote.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CARDS.map((c) => (
            <article
              key={c.title}
              className="tap-press group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-gold to-flag-red opacity-80" />
              <div className="text-3xl">{c.icon}</div>
              <h3 className="mt-3 font-display text-lg font-bold text-foreground">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
