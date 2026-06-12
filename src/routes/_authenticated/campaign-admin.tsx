import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NavBar } from "@/components/cab3/NavBar";
import { Footer } from "@/components/cab3/Footer";
import { toast } from "sonner";
import { PROVINCES } from "@/lib/cab3-data";

export const Route = createFileRoute("/_authenticated/campaign-admin")({
  head: () => ({ meta: [{ title: "Admin · CAB3" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Post = { id: string; title: string; content: string; image_url: string | null; created_at: string };

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [metrics, setMetrics] = useState({ users: 0, votes: 0, aspirations: 0, talents: 0 });
  const [links, setLinks] = useState<Record<string, string>>({});
  const [savingLink, setSavingLink] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: ud } = await supabase.auth.getUser();
      const uid = ud.user?.id;
      if (!uid) { navigate({ to: "/auth" }); return; }
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
      if (!role) { setChecking(false); setIsAdmin(false); return; }
      setIsAdmin(true);
      setChecking(false);
      loadPosts();
      loadMetrics();
      loadLinks();
    })();
  }, [navigate]);

  async function loadLinks() {
    const { data } = await supabase.from("province_links").select("province,whatsapp_url");
    const map: Record<string, string> = {};
    for (const p of PROVINCES) map[p.value] = "";
    for (const row of data ?? []) map[row.province] = row.whatsapp_url ?? "";
    setLinks(map);
  }

  async function saveLink(province: string) {
    const url = (links[province] ?? "").trim();
    if (url && !/^https?:\/\//i.test(url)) { toast.error("Link must start with http(s)://"); return; }
    setSavingLink(province);
    const { error } = await supabase.from("province_links").upsert({ province, whatsapp_url: url, updated_at: new Date().toISOString() }, { onConflict: "province" });
    setSavingLink(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Link saved");
  }

  async function loadPosts() {
    const { data } = await supabase.from("news_posts").select("id,title,content,image_url,created_at").order("created_at", { ascending: false }).limit(50);
    setPosts(data ?? []);
  }

  async function loadMetrics() {
    const [u, v, a, t] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("poll_votes").select("id", { count: "exact", head: true }),
      supabase.from("aspirations").select("id", { count: "exact", head: true }),
      supabase.from("talents").select("id", { count: "exact", head: true }),
    ]);
    setMetrics({ users: u.count ?? 0, votes: v.count ?? 0, aspirations: a.count ?? 0, talents: t.count ?? 0 });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { toast.error("Title and body required."); return; }
    setSubmitting(true);
    let image_url: string | null = null;
    if (file) {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("news-images").upload(path, file, { contentType: file.type });
      if (upErr) { setSubmitting(false); toast.error("Image upload failed: " + upErr.message); return; }
      // Bucket is private; create a long-lived signed URL (10 years).
      const { data: signed, error: sErr } = await supabase.storage.from("news-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (sErr || !signed) { setSubmitting(false); toast.error("Couldn't link image."); return; }
      image_url = signed.signedUrl;
    }
    const { data: ud } = await supabase.auth.getUser();
    const { error } = await supabase.from("news_posts").insert({ title: title.trim(), content: content.trim(), image_url, author_id: ud.user!.id });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Posted! 🎉 Live on the homepage.");
    setTitle(""); setContent(""); setFile(null);
    loadPosts();
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    loadPosts();
  }

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="px-5 py-12">
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-7 text-center shadow-card">
            <p className="text-5xl">🔐</p>
            <h1 className="mt-3 font-display text-2xl font-black">Admins only</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have campaign-admin access yet.</p>
            <a href="/youth-hub" className="mt-5 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">← Back to hub</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="px-5 py-7">
        <div className="mx-auto max-w-3xl">
          <span className="chip">⚙️ Admin · Coordinator</span>
          <h1 className="mt-3 font-display text-3xl font-black tracking-tight">Campaign Admin</h1>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { k: metrics.users, v: "Members" },
              { k: metrics.votes, v: "Poll votes" },
              { k: metrics.aspirations, v: "Aspirations" },
              { k: metrics.talents, v: "Talents" },
            ].map((m) => (
              <div key={m.v} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="font-display text-2xl font-black text-primary">{m.k.toLocaleString()}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{m.v}</div>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-lg font-bold">New post</h2>
            <p className="text-xs text-muted-foreground">Publishes instantly to the homepage news feed.</p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="Major announcement…" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Body</Label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} maxLength={3000} placeholder="Write the update for the movement…" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Image (optional)</Label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full rounded-md border border-input bg-background p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground"
                />
              </div>
              <Button type="submit" disabled={submitting} size="lg" className="tap-press !mt-4 h-12 w-full rounded-full bg-gold font-bold text-gold-foreground shadow-glow hover:bg-gold/90">
                {submitting ? "Publishing…" : "Publish post →"}
              </Button>
            </div>
          </form>

          <div className="mt-7">
            <h2 className="font-display text-xl font-bold">Recent posts</h2>
            <div className="mt-3 space-y-2.5">
              {posts.map((p) => (
                <div key={p.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
                  {p.image_url && <img src={p.image_url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{p.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{p.content}</p>
                  </div>
                  <button onClick={() => deletePost(p.id)} className="tap-press rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">Delete</button>
                </div>
              ))}
              {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet — publish your first one above.</p>}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-card">
            <span className="chip">⚙️ Settings</span>
            <h2 className="mt-2 font-display text-lg font-bold">Provincial WhatsApp links</h2>
            <p className="text-xs text-muted-foreground">
              Pick a province, paste its invite URL, hit Save. New sign-ups from that area are redirected there automatically. Leave blank to send them to the Youth Hub instead.
            </p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Province</Label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PROVINCES.map((p) => {
                    const has = (links[p.value] ?? "").trim().startsWith("http");
                    return (
                      <option key={p.value} value={p.value}>
                        {has ? "✅ " : "⚪️ "}{p.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">WhatsApp invite URL</Label>
                <Input
                  value={links[selectedProvince] ?? ""}
                  onChange={(e) => setLinks((prev) => ({ ...prev, [selectedProvince]: e.target.value }))}
                  placeholder="https://chat.whatsapp.com/…"
                  className="h-11"
                />
              </div>
              <Button
                type="button"
                onClick={() => saveLink(selectedProvince)}
                disabled={savingLink === selectedProvince}
                size="lg"
                className="tap-press !mt-4 h-12 w-full rounded-full bg-gold font-bold text-gold-foreground shadow-glow hover:bg-gold/90"
              >
                {savingLink === selectedProvince ? "Saving…" : "Save link"}
              </Button>
              {(links[selectedProvince] ?? "").trim() && (
                <a
                  href={links[selectedProvince]}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs font-semibold text-primary hover:underline"
                >
                  Test link ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
