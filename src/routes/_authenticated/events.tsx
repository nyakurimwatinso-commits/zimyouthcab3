import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/cab3/NavBar";
import { Footer } from "@/components/cab3/Footer";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/events")({
  head: () => ({
    meta: [
      { title: "Mobilization Events · CAB3" },
      { name: "description", content: "Join local community clean-ups, leadership seminars, and provincial meetings." },
    ],
  }),
  component: EventsPage,
});

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  province: string;
  description: string;
  attendees: number;
};

const UPCOMING_EVENTS: Event[] = [
  {
    id: "e1",
    title: "Mashonaland West Youth Leadership Seminar",
    date: "2026-07-12",
    time: "10:00 AM",
    location: "Chinhoyi Community Hall",
    province: "Mashonaland West",
    description: "A day-long intensive workshop focused on local governance, youth entrepreneurship, and community project management.",
    attendees: 124,
  },
  {
    id: "e2",
    title: "National Clean-Up & Beautification Drive",
    date: "2026-07-18",
    time: "08:00 AM",
    location: "Harare City Center (Main Square)",
    province: "Harare",
    description: "Join hundreds of volunteers to clean, organize, and restore key municipal areas. Bring your energy and positive spirit!",
    attendees: 450,
  },
];

function EventsPage() {
  const [rsvpStatus, setRsvpStatus] = useState<Record<string, boolean>>({});

  const toggleRSVP = (id: string) => {
    setRsvpStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <NavBar />
        <main className="px-5 py-8">
          <div className="mx-auto max-w-2xl">
            <span className="chip bg-indigo/10 text-indigo border-indigo/10">📅 Mobilization</span>
            <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Movement Calendar
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Real-world impact happens on the ground. Browse upcoming provincial events and commit to joining your local chapter.
            </p>

            <div className="mt-8 space-y-6">
              {UPCOMING_EVENTS.map((event) => (
                <div key={event.id} className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-wider">
                        <span className="bg-primary/10 px-2 py-0.5 rounded-full">{event.province}</span>
                      </div>
                      <h2 className="mt-2 font-display text-xl font-black">{event.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <CalendarDays size={16} className="text-primary" /> {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <MapPin size={16} className="text-primary" /> {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                      <Users size={16} className="text-primary" /> {event.attendees} Attending
                    </div>
                  </div>

                  <Button 
                    onClick={() => toggleRSVP(event.id)}
                    className={`mt-6 w-full rounded-xl font-bold ${rsvpStatus[event.id] ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary"}`}
                  >
                    {rsvpStatus[event.id] ? "✓ Confirmed Attendance" : "RSVP for this Event"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

