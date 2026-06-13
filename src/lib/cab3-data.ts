export const PROVINCES = [
  { value: "harare", label: "Harare" },
  { value: "bulawayo", label: "Bulawayo" },
  { value: "manicaland", label: "Manicaland - Mutare" },
  { value: "mash_central", label: "Mashonaland Central - Bindura" },
  { value: "mash_east", label: "Mashonaland East - Marondera" },
  { value: "mash_west", label: "Mashonaland West - Chinhoyi" },
  { value: "mat_north", label: "Matabeleland North - Lupane" },
  { value: "mat_south", label: "Matabeleland South - Gwanda" },
  { value: "midlands", label: "Midlands - Gweru" },
  { value: "masvingo", label: "Masvingo" },
] as const;

export type ProvinceValue = (typeof PROVINCES)[number]["value"];

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
