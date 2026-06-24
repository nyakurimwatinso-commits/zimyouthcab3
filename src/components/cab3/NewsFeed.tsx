import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Post = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 1) return `Just now`;
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function NewsFeed() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  async function load() {
    const { data } = await supabase
      .from("news_posts")
      .select("id,title,content,image_url,created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setPosts(data ?? []);
  }

  useEffect(() => {
    load();
    const channel = supabase
      .channel("news_posts_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "news_posts" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="bg-secondary/20 px-5 py-14 border-y border-border/40 relative">
      <div className="mx-auto max-w-5xl">
        
        {/* Feed Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="chip bg-primary/10 text-primary border border-primary/10">📰 Live Updates</span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              From the movement.
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1 text-xs font-bold tracking-wider text-primary border border-primary/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            LIVE
          </span>
        </div>

        {/* Loading Skeletons */}
        {posts === null ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card p-4 space-y-4">
                <div className="aspect-video w-full animate-pulse rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-border/80 bg-card p-10 text-center shadow-inner max-w-lg mx-auto">
            <p className="text-4xl">📣</p>
            <p className="mt-3 font-display text-lg font-black text-foreground">First post coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Coordinators are setting up the channels right now. Check back shortly for updates.
            </p>
          </div>
        ) : (
          /* Feed Card Grid */
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((p) => (
              <article
                key={p.id}
                className="group/card tap-press overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-border"
              >
                {p.image_url && (
                  <div className="relative aspect-video w-full overflow-hidden border-b border-border/40 bg-muted">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse shadow-sm" />
                    {timeAgo(p.created_at)}
                  </div>
                  
                  <h3 className="mt-2 font-display text-xl font-black leading-snug text-foreground group-hover/card:text-primary transition-colors duration-200">
                    {p.title}
                  </h3>
                  
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground/90">
                    {p.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
