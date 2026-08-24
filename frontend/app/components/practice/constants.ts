export const TRACKS = ["SDE Technical", "GenAI", "HR Behavioral"] as const;

export type Track = (typeof TRACKS)[number];

export const TRACK_KEYS: Record<Track, string> = {
  "SDE Technical": "sde_technical",
  GenAI: "genai",
  "HR Behavioral": "hr_behavioral",
};

export const TRACK_LABELS: Record<string, Track> = {
  sde_technical: "SDE Technical",
  genai: "GenAI",
  hr_behavioral: "HR Behavioral",
};

export function trackFromKey(key: string): Track {
  return TRACK_LABELS[key] ?? "SDE Technical";
}

export const PANEL_PERSONAS = [
  {
    initial: "R",
    name: "Technical Reviewer",
    focus: "Evaluating technical depth",
    color: "bg-[#72D13D]/15 text-[#4FB832]",
  },
  {
    initial: "P",
    name: "Behavioral Reviewer",
    focus: "Evaluating communication",
    color: "bg-[#172018]/8 text-[#172018]",
  },
  {
    initial: "A",
    name: "System Design",
    focus: "Evaluating structure & tradeoffs",
    color: "bg-[#687268]/12 text-[#687268]",
  },
] as const;

export const DIFFICULTY_BADGE: Record<string, { label: string; className: string }> = {
  beginner: { label: "Beginner", className: "studio-chip-beginner" },
  intermediate: { label: "Intermediate", className: "studio-chip-intermediate" },
  advanced: { label: "Advanced", className: "studio-chip-advanced" },
};
