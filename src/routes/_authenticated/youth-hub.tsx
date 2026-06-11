import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavBar } from "@/components/cab3/NavBar";
import { Footer } from "@/components/cab3/Footer";
import { toast } from "sonner";
import { whatsappLinkFor, PROVINCES } from "@/lib/cab3-data";

export const Route = createFileRoute("/_authenticated/youth-hub")({
  head: () => ({ meta: [{ title: "Youth Hub — CAB3 Pambili" }, { name: "robots", content: "noindex" }] }),
  component: YouthHub,
});

type Profile = { username: string; full_name: string; province: string };

function YouthHub() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [aspirations, setAspirations] = useState("");
  const [talents, setTalents] = useState("");
  const [aspirationsId, setAspirationsId] = useState<string | null>(null);
  const [talentsId, setTalentsId] = useState<string | null>(null);
  const [savingA, setSavingA] = useState(false);
  const [savingT, setSavingT] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: ud } = await supabase.auth.getUser();
      const uid = ud.user?.id;
      if (!uid) return;
      const [{ data: p }, { data: a }, { data: t }, { data: r }] = await Promise.all([
        supabase.from("profiles").select("username,full_name,province").eq("id", uid).maybeSingle(),
        supabase.from("aspirations").select("id,content").eq("user_id", uid).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("talents").select("id,content").eq("user_id", uid).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle(),
      ]);
      setProfile(p);
      if (a) { setAspirations(a.content); setAspirationsId(a.id); }
      if (t) { setTalents(t.content); setTalentsId(t.id); }
      setIsAdmin(!!r);
    })();
  }, []);

  async function saveAspirations() {
    setSavingA(true);
    const { data: ud } = await supabase.auth.getUser();
    const uid = ud.user!.id;
    if (aspirationsId) {
      const { error } = await supabase.from("aspirations").update({ content: aspirations, updated_at: new Date().toISOString() }).eq("id", aspirationsId);
      setSavingA(false);
      if (error) return toast.error("Couldn't save.");
    } else {
      const { data, error } = await supabase.from("aspirations").insert({ user_id: uid, content: aspirations }).select("id").single();
      setSavingA(false);
      if (error) return toast.error("Couldn't save.");
      setAspirationsId(data.id);
    }
    toast.success("Saved privately ✓");
  }

  async function saveTalents() {
    setSavingT(true);
    const { data: ud } = await supabase.auth.getUser();
    const uid = ud.user!.id;
    if (talentsId) {
      const { error } = await supabase.from("talents").update({ content: talents, updated_at: new Date().toISOString() }).eq("id", talentsId);
      setSavingT(false);
      if (error) return toast.error("Couldn't save.");
    } else {
      const { data, error } = await supabase.from("talents").insert({ user_id: uid, content: talents }).select("id").single();
      setSavingT(false);
      if (error) return toast.error("Couldn't save.");
      setTalentsId(data.id);
    }
    toast.success("Saved privately ✓");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const provinceLabel = PROVINCES.find((p) => p.value === profile?.province)?.label ?? profile?.province ?? "";

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="px-5 py-7">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-[oklch(0.32_0.12_152)] p-5 text-primary-foreground shadow-card">
            <span className="chip">🔒 Private workspace</span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              Hi {profile?.full_name?.split(" ")[0] ?? "Comrade"} 👋
            </h1>
            <p className="text-sm text-white/85">
              Your Youth Hub · {provinceLabel}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile?.province && (
                <a
                  href={whatsappLinkFor(profile.province)}
                  target="_blank"
                  rel="noreferrer"
                  className="tap-press inline-flex h-10 items-center rounded-full bg-gold px-4 text-sm font-bold text-gold-foreground shadow-glow"
                >
                  💬 Open WhatsApp group
                </a>
              )}
              {isAdmin && (
                <a
                  href="/campaign-admin"
                  className="tap-press inline-flex h-10 items-center rounded-full bg-white/15 px-4 text-sm font-bold text-white backdrop-blur"
                >
                  ⚙️ Admin
                </a>
              )}
              <button onClick={signOut} className="tap-press ml-auto inline-flex h-10 items-center rounded-full bg-white/10 px-4 text-sm font-semibold text-white">
                Sign out
              </button>
            </div>
          </div>

          <Tabs defaultValue="aspirations" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-secondary p-1">
              <TabsTrigger value="aspirations" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                My Aspirations
              </TabsTrigger>
              <TabsTrigger value="talents" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                My Talents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="aspirations" className="mt-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h2 className="font-display text-lg font-bold">What resources, funding, or career opportunities are you looking for?</h2>
                <p className="mt-1 text-xs text-muted-foreground">Only you (and aggregated, anonymized totals) — nobody else sees this.</p>
                <Textarea
                  value={aspirations}
                  onChange={(e) => setAspirations(e.target.value)}
                  rows={8}
                  maxLength={2000}
                  placeholder="E.g. I'm looking for seed funding for an agri-tech startup, mentorship in software engineering, scholarship for a degree in renewable energy…"
                  className="mt-3"
                />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{aspirations.length}/2000</span>
                  <Button onClick={saveAspirations} disabled={savingA} className="tap-press rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                    {savingA ? "Saving…" : "Save privately"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="talents" className="mt-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h2 className="font-display text-lg font-bold">Your skills, qualifications & availability</h2>
                <p className="mt-1 text-xs text-muted-foreground">Tell us what you bring — trades, engineering, design, coding, volunteer hours, equipment access.</p>
                <Textarea
                  value={talents}
                  onChange={(e) => setTalents(e.target.value)}
                  rows={8}
                  maxLength={2000}
                  placeholder="E.g. Certified electrician, 3 years welding experience, intermediate Python, available weekends, own a pickup truck…"
                  className="mt-3"
                />
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{talents.length}/2000</span>
                  <Button onClick={saveTalents} disabled={savingT} className="tap-press rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
                    {savingT ? "Saving…" : "Save privately"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
