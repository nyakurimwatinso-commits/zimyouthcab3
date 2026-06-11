export const PROVINCES = [
  { value: "harare", label: "Harare", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_HARARE" },
  { value: "bulawayo", label: "Bulawayo", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_BULAWAYO" },
  { value: "manicaland", label: "Manicaland - Mutare", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_MANICALAND" },
  { value: "mash_central", label: "Mashonaland Central - Bindura", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_MASH_CENTRAL" },
  { value: "mash_east", label: "Mashonaland East - Marondera", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_MASH_EAST" },
  { value: "mash_west", label: "Mashonaland West - Chinhoyi", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_MASH_WEST" },
  { value: "mat_north", label: "Matabeleland North - Lupane", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_MAT_NORTH" },
  { value: "mat_south", label: "Matabeleland South - Gwanda", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_MAT_SOUTH" },
  { value: "midlands", label: "Midlands - Gweru", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_MIDLANDS" },
  { value: "masvingo", label: "Masvingo", whatsapp: "https://chat.whatsapp.com/PLACEHOLDER_MASVINGO" },
] as const;

export type ProvinceValue = (typeof PROVINCES)[number]["value"];

export function whatsappLinkFor(value: string): string {
  return PROVINCES.find((p) => p.value === value)?.whatsapp ?? "https://chat.whatsapp.com/PLACEHOLDER_NATIONAL";
}

export const POLL_OPTIONS = [
  { value: "tech", label: "Tech & Innovation Grants", emoji: "💻" },
  { value: "land", label: "Agricultural Land Access", emoji: "🌾" },
  { value: "internships", label: "Industrial Internships", emoji: "🏭" },
  { value: "housing", label: "Subsidized Housing", emoji: "🏘️" },
] as const;

export type PollOption = (typeof POLL_OPTIONS)[number]["value"];

export const WHY_CARDS = [
  {
    title: "Policy Stability",
    body: "A 7-year cycle removes election-year freezes, unlocking long-term tech, engineering & manufacturing investment.",
    icon: "📈",
  },
  {
    title: "Youth Leadership",
    body: "More runway for mentorship pipelines, ministerial youth desks and structured leadership development.",
    icon: "🚀",
  },
  {
    title: "Vision 2030 Engine",
    body: "Continuity for the National Development Strategy keeps us on track for an upper middle-income Zimbabwe.",
    icon: "🇿🇼",
  },
  {
    title: "No Election Pauses",
    body: "Eliminates the every-5-year economic slowdown so jobs, contracts and SMEs keep moving.",
    icon: "⏱️",
  },
  {
    title: "Skills & Trade Boost",
    body: "Predictable policy attracts global firms hiring engineers, coders, welders, agri-techs and creatives.",
    icon: "🛠️",
  },
  {
    title: "A Better Zimbabwe",
    body: "Stability. Progress. Prosperity. Together we say YES to a future built by the youth, for the youth.",
    icon: "✊",
  },
];
