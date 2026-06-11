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
    <section className="bg-secondary/40 px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="chip">📰 Live Updates</span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              From the movement.
            </h2>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            LIVE
          </span>
        </div>

        {posts === null ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-3xl">📣</p>
            <p className="mt-2 font-semibold text-foreground">First post coming soon.</p>
            <p className="text-sm text-muted-foreground">Coordinators are warming up. Check back shortly.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {posts.map((p) => (
              <article
                key={p.id}
                className="tap-press overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {timeAgo(p.created_at)}
                  </div>
                  <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-foreground">{p.title}</h3>
                  <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.content}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
