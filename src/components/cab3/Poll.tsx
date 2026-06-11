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

  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  async function loadCounts() {
    const { data, error } = await supabase.from("poll_votes").select("option");
    if (error) return;
    const map: Record<string, number> = {};
    data.forEach((r) => { map[r.option] = (map[r.option] ?? 0) + 1; });
    setCounts(map);
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
    <section className="px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
          <span className="chip">⚡ Live Poll</span>
          <h2 className="mt-3 font-display text-xl font-extrabold leading-snug text-foreground sm:text-2xl">
            What should the stabilized 7-year cycle prioritize for youth?
          </h2>
          <div className="mt-5 space-y-2.5">
            {POLL_OPTIONS.map((opt) => {
              const c = counts[opt.value] ?? 0;
              const pct = total ? Math.round((c / total) * 100) : 0;
              const isMine = voted === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => vote(opt.value)}
                  disabled={!!voted || loading}
                  className={`tap-press relative w-full overflow-hidden rounded-xl border text-left transition ${
                    voted
                      ? "cursor-default border-border bg-secondary/50"
                      : "border-border bg-background hover:border-primary hover:bg-secondary/70"
                  }`}
                >
                  {voted && (
                    <div
                      className={`absolute inset-y-0 left-0 ${isMine ? "bg-primary/20" : "bg-muted"}`}
                      style={{ width: `${pct}%` }}
                    />
                  )}
                  <div className="relative flex items-center justify-between px-4 py-3">
                    <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                      <span className="text-lg">{opt.emoji}</span>
                      {opt.label}
                      {isMine && <span className="chip !py-0.5 !text-[10px]">Your vote</span>}
                    </span>
                    {voted && <span className="text-sm font-bold tabular-nums text-primary">{pct}%</span>}
                  </div>
                </button>
              );
            })}
          </div>
          {voted && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              {total.toLocaleString()} {total === 1 ? "vote" : "votes"} so far · Asante!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
