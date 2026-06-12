import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PROVINCES } from "@/lib/cab3-data";

async function whatsappLinkFor(province: string): Promise<string> {
  const { data } = await supabase.from("province_links").select("whatsapp_url").eq("province", province).maybeSingle();
  const url = data?.whatsapp_url?.trim();
  return url && url.startsWith("http") ? url : "/youth-hub";
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { NavBar } from "@/components/cab3/NavBar";
import { Footer } from "@/components/cab3/Footer";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Join the Movement — CAB3 Pambili" },
      { name: "description", content: "Sign up and get plugged into your provincial youth WhatsApp group." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and _ only"),
  password: z.string().min(6).max(100),
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  age: z.coerce.number().int().min(13).max(120),
  province: z.string().min(1),
});

const signinSchema = z.object({
  username: z.string().trim().min(3).max(30),
  password: z.string().min(6).max(100),
});

function toEmail(username: string) {
  return `${username.toLowerCase().trim()}@cab3.app`;
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/youth-hub" });
    });
  }, [navigate]);

  async function handleSignup(form: FormData) {
    const parsed = signupSchema.safeParse({
      username: form.get("username"),
      password: form.get("password"),
      full_name: form.get("full_name"),
      phone: form.get("phone"),
      age: form.get("age"),
      province: form.get("province"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details.");
      return;
    }
    setLoading(true);
    const { username, password, full_name, phone, age, province } = parsed.data;
    const { data, error } = await supabase.auth.signUp({
      email: toEmail(username),
      password,
      options: { emailRedirectTo: `${window.location.origin}/youth-hub` },
    });
    if (error || !data.user) {
      setLoading(false);
      toast.error(error?.message?.includes("already") ? "Username already taken." : (error?.message ?? "Sign up failed."));
      return;
    }
    const { error: pErr } = await supabase.from("profiles").insert({
      id: data.user.id, username, full_name, phone, age, province,
    });
    if (pErr) {
      setLoading(false);
      toast.error(pErr.message.includes("duplicate") ? "Username already taken." : "Couldn't save profile.");
      return;
    }
    toast.success("Welcome to the movement! 🇿🇼");
    const link = await whatsappLinkFor(province);
    setTimeout(() => { window.location.href = link; }, 900);
  }

  async function handleSignin(form: FormData) {
    const parsed = signinSchema.safeParse({
      username: form.get("username"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      toast.error("Enter your username and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: toEmail(parsed.data.username),
      password: parsed.data.password,
    });
    setLoading(false);
    if (error) {
      toast.error("Invalid username or password.");
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/youth-hub" });
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="px-5 py-8">
        <div className="mx-auto max-w-md">
          <span className="chip">{mode === "signup" ? "✨ Step in" : "👋 Welcome back"}</span>
          <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground">
            {mode === "signup" ? "Join thousands of youths driving the vision." : "Sign in to your Youth Hub."}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup"
              ? "Pick a username + password. We'll match you to your provincial WhatsApp group instantly."
              : "Pick up where you left off."}
          </p>

          <div className="mt-6 flex rounded-full border border-border bg-secondary p-1 text-sm font-semibold">
            <button
              onClick={() => setMode("signup")}
              className={`tap-press flex-1 rounded-full px-3 py-2 ${mode === "signup" ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground"}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setMode("signin")}
              className={`tap-press flex-1 rounded-full px-3 py-2 ${mode === "signin" ? "bg-primary text-primary-foreground shadow-card" : "text-muted-foreground"}`}
            >
              Sign In
            </button>
          </div>

          {mode === "signup" ? (
            <form
              key="signup"
              className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card"
              onSubmit={(e) => { e.preventDefault(); handleSignup(new FormData(e.currentTarget)); }}
            >
              <Field label="Username" name="username" placeholder="yourname" required />
              <Field label="Password" name="password" type="password" placeholder="At least 6 characters" required />
              <Field label="Full name" name="full_name" placeholder="Tendai Moyo" required />
              <Field label="WhatsApp number" name="phone" type="tel" placeholder="+263 …" required />
              <Field label="Age" name="age" type="number" min={13} max={120} placeholder="22" required />
              <div className="space-y-1.5">
                <Label htmlFor="province" className="text-xs font-semibold">Province / Town</Label>
                <select
                  id="province"
                  name="province"
                  required
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue=""
                >
                  <option value="" disabled>Select your area…</option>
                  {PROVINCES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="tap-press !mt-5 h-12 w-full rounded-full bg-gold font-bold text-gold-foreground shadow-glow hover:bg-gold/90"
              >
                {loading ? "Joining…" : "Join & open WhatsApp group →"}
              </Button>
              <p className="pt-1 text-center text-[11px] text-muted-foreground">
                By joining you support #CAB3 and agree to receive updates from your provincial group.
              </p>
            </form>
          ) : (
            <form
              key="signin"
              className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card"
              onSubmit={(e) => { e.preventDefault(); handleSignin(new FormData(e.currentTarget)); }}
            >
              <Field label="Username" name="username" required />
              <Field label="Password" name="password" type="password" required />
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="tap-press !mt-5 h-12 w-full rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Signing in…" : "Sign in →"}
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-muted-foreground">
            <Link to="/" className="font-semibold text-primary hover:underline">← Back to home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={rest.name} className="text-xs font-semibold">{label}</Label>
      <Input id={rest.name} className="h-11" {...rest} />
    </div>
  );
}
