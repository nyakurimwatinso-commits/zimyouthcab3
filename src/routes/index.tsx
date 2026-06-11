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
    <div className="min-h-screen bg-background">
      <NavBar />
      <main>
        <Hero />
        <NewsFeed />
        <WhyGrid />
        <Poll />
        <section className="px-5 pb-14">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-to-br from-primary to-[oklch(0.32_0.12_152)] p-7 text-center text-primary-foreground shadow-card">
            <span className="chip">🔥 Step Up</span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">
              Join thousands of youths driving the vision.
            </h2>
            <p className="mt-2 text-sm text-white/85">
              Get matched to your provincial WhatsApp group the moment you sign up.
            </p>
            <Link to="/auth">
              <Button size="lg" className="tap-press mt-5 h-12 rounded-full bg-gold px-7 font-bold text-gold-foreground shadow-glow hover:bg-gold/90">
                Sign Up Now →
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
