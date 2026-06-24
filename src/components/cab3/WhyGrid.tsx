import { WHY_CARDS } from "@/lib/cab3-data";

export function WhyGrid() {
  return (
    <section id="why-cab3" className="px-5 py-14 relative overflow-hidden">
      {/* Soft background design detail to anchor the grid */}
      <div className="absolute top-1/2 left-[-10%] -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-9">
          <span className="chip bg-primary/10 text-primary border border-primary/10">Why CAB3 Matters</span>
          <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl max-w-xl leading-[1.15]">
            Built for the youth who refuse to be a footnote.
          </h2>
        </div>

        {/* Reengineered Responsive Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CARDS.map((c) => (
            <article
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30 active:scale-[0.99]"
            >
              {/* National Identity Gradient Accent Top Edge */}
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-gold to-[oklch(0.43_0.19_21)] opacity-90 group-hover:h-1 transition-all duration-300" />
              
              {/* Icon Container with subtle pop transition */}
              <div className="text-3xl filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110 origin-left">
                {c.icon}
              </div>
              
              {/* Card Title */}
              <h3 className="mt-4 font-display text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                {c.title}
              </h3>
              
              {/* Card Body */}
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/90 font-normal">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

