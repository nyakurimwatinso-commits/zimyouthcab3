import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { POLL_OPTIONS, type PollOption } from "@/lib/cab3-data";
import { toast } from "sonner";

const STORAGE_KEY = "cab3_poll_voter_key";
const VOTED_KEY = "cab3_poll_voted";

function getVoterKey(): string {
  if (typeof window === "undefined") return "ssr";
  let k = localStorage.getItem(STORAGE_KEY);
  if (!k) {
    k = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, k);
  }
  return k;
}

export function Poll() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<PollOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  async function loadCounts() {
    const { data, error } = await supabase.from("poll_votes").select("option");
    if (error) return;
    const map: Record<string, number> = {};
    data.forEach((r) => { map[r.option] = (map[r.option] ?? 0) + 1; });
    setCounts(map);
    // Trigger progress bar transition animation after counts load
    setTimeout(() => setAnimateBars(true), 50);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVoted((localStorage.getItem(VOTED_KEY) as PollOption) || null);
    }
    loadCounts();
  }, []);

  async function vote(option: PollOption) {
    if (voted || loading) return;
    setLoading(true);
    setAnimateBars(false);
    const voter_key = getVoterKey();
    const { error } = await supabase.from("poll_votes").insert({ option, voter_key });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("Couldn't record your vote. Try again.");
      return;
    }
    localStorage.setItem(VOTED_KEY, option);
    setVoted(option);
    toast.success("Vote counted! 💪");
    loadCounts();
  }

  return (
    <section className="px-5 py-12 relative overflow-hidden">
      <div className="mx-auto max-w-2xl">
        <div className="relative rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-border">
          
          <div className="flex items-center justify-between">
            <span className="chip bg-amber-500/10 text-amber-600 border border-amber-500/10 dark:text-amber-500">
              ⚡ Live Poll
            </span>
            {loading && (
              <span className="text-xs text-muted-foreground animate-pulse">Recording...</span>
            )}
          </div>
          
          <h2 className="mt-4 font-display text-xl font-black leading-snug tracking-tight text-foreground sm:text-2xl max-w-xl">
            What should the stabilized 7-year cycle prioritize for youth?
          </h2>
          
          <div className="mt-6 space-y-3">
            {POLL_OPTIONS.map((opt) => {
              const c = counts[opt.value] ?? 0;
              const pct = total ? Math.round((c / total) * 100) : 0;
              const isMine = voted === opt.value;
              
              return (
                <button
                  key={opt.value}
                  onClick={() => vote(opt.value)}
                  disabled={!!voted || loading}
                  className={`tap-press group/opt relative w-full overflow-hidden rounded-xl border text-left transition-all duration-200 ${
                    voted
                      ? isMine 
                        ? "cursor-default border-primary/40 bg-primary/[0.02]" 
                        : "cursor-default border-border/60 bg-secondary/30"
                      : "border-border bg-background hover:border-primary/60 hover:bg-muted/40"
                  }`}
                >
                  {/* Smooth Sliding Vote Percentage Bar Fill */}
                  {voted && (
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${
                        isMine ? "bg-primary/15" : "bg-muted/60"
                      }`}
                      style={{ width: animateBars ? `${pct}%` : "0%" }}
                    />
                  )}
                  
                  <div className="relative flex items-center justify-between px-4 py-3.5 z-10">
                    <span className="flex items-center gap-3 text-sm font-bold text-foreground">
                      <span className="text-xl transition-transform duration-200 group-hover/opt:scale-110">
                        {opt.emoji}
                      </span>
                      <span className="leading-tight">{opt.label}</span>
                      {isMine && (
                        <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary-foreground shadow-sm animate-fade-in">
                          Your vote
                        </span>
                      )}
                    </span>
                    
                    {voted && (
                      <span className="text-sm font-black tabular-nums text-primary drop-shadow-sm pl-2">
                        {pct}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {voted && (
            <p className="mt-4 text-center text-xs font-medium text-muted-foreground animate-fade-in">
              {total.toLocaleString()} {total === 1 ? "vote" : "votes"} so far · Asante!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
