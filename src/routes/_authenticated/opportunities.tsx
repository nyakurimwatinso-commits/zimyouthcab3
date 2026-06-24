import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/cab3/NavBar";
import { Footer } from "@/components/cab3/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities Hub · CAB3" },
      { name: "description", content: "Explore skills training, grants, and youth empowerment initiatives." },
    ],
  }),
  component: OpportunitiesPage,
});

type Opportunity = {
  id: string;
  title: string;
  category: "skills" | "grants" | "academic" | "projects";
  organization: string;
  location: string;
  deadline: string;
  description: string;
  actionUrl: string;
  tag: string;
};

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Digital Freelancing & Tech Skills Boot Camp",
    category: "skills",
    organization: "CAB3 Tech Accelerator",
    location: "Online / Hybrid",
    deadline: "July 15, 2026",
    description: "Intensive 6-week program focusing on full-stack web development, UI/UX application design, and navigating global remote work platforms.",
    actionUrl: "https://chat.whatsapp.com/",
    tag: "Free Training",
  },
  {
    id: "opp-2",
    title: "Youth Agribusiness Innovation Grants",
    category: "grants",
    organization: "Empowerment Seed Fund",
    location: "Nationwide",
    deadline: "August 01, 2026",
    description: "Providing capital grants and operational mentorship to youth-led poultry, crop production, and sustainable agricultural distribution enterprises.",
    actionUrl: "#",
    tag: "Up to $2,500 Funding",
  },
  {
    id: "opp-3",
    title: "Provincial Clean-Energy & Infrastructure Seminar",
    category: "academic",
    organization: "Green Development Institute",
    location: "Chinhoyi, Mashonaland West",
    deadline: "July 10, 2026",
    description: "Fully sponsored vocational workshop learning the installation, maintenance, and diagnostics of solar-powered medical or domestic micro-grids.",
    actionUrl: "#",
    tag: "Certificate Awarded",
  },
  {
    id: "opp-4",
    title: "Community ICT Center Setup Mobilization",
    category: "projects",
    organization: "CAB3 Grassroots Teams",
    location: "All Provinces",
    deadline: "Ongoing",
    description: "Join hands to distribute, assemble, and set up open-access computing centers in disadvantaged rural and peri-urban wards.",
    actionUrl: "#",
    tag: "Volunteer Action",
  }
];

function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "skills" | "grants" | "academic" | "projects">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOpportunities = SAMPLE_OPPORTUNITIES.filter((opp) => {
    const matchesTab = activeTab === "all" || opp.category === activeTab;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <NavBar />
        <main className="px-5 py-8">
          <div className="mx-auto max-w-3xl">
            <span className="chip bg-gold/10 text-gold border-gold/10">💼 Growth Hub</span>
            <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Opportunities & Skills
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Discover localized youth-centric avenues designed to equip you with structural tools, funding grants, technical literacy, and community networks.
            </p>

            {/* Filter and Search Bar Section */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources, tags, or fields…"
                className="h-11 sm:max-w-xs rounded-xl"
              />
              
              <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: "all", label: "All" },
                  { id: "skills", label: "🛠️ Skills" },
                  { id: "grants", label: "💰 Grants" },
                  { id: "academic", label: "📚 Education" },
                  { id: "projects", label: "🌱 Projects" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`h-9 rounded-full px-4 text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opportunities List Mapping Framework */}
            <div className="mt-8 space-y-4">
              {filteredOpportunities.map((opp) => (
                <div key={opp.id} className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between sm:flex-row sm:items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                        {opp.category}
                      </span>
                      <span className="inline-block rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-gold">
                        {opp.tag}
                      </span>
                    </div>
                    
                    <h2 className="font-display text-lg font-black leading-snug text-foreground">{opp.title}</h2>
                    <p className="text-xs font-bold text-muted-foreground/90">{opp.organization} · <span className="font-medium">{opp.location}</span></p>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed max-w-2xl">{opp.description}</p>
                  </div>

                  <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 border-t sm:border-t-0 border-border/60 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Apply Before</span>
                      <span className="text-xs font-black text-destructive/80">{opp.deadline}</span>
                    </div>
                    <Button 
                      onClick={() => window.open(opp.actionUrl, "_blank")}
                      size="sm" 
                      className="rounded-full font-bold px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      Learn More →
                    </Button>
                  </div>
                </div>
              ))}

              {filteredOpportunities.length === 0 && (
                <div className="text-center py-12 rounded-3xl border border-dashed border-border p-6">
                  <p className="text-sm text-muted-foreground">No open listings match your current filters or query definitions.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
