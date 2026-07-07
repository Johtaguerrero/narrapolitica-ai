export type ContentSpeed = "natural" | "reels" | "discurso";

const WORDS_PER_MINUTE: Record<ContentSpeed, number> = {
  natural: 130,
  reels: 150,
  discurso: 115,
};

const DURATION_SECONDS: Record<string, number> = {
  "15s": 15,
  "30s": 30,
  "45s": 45,
  "1min": 60,
  "3min": 180,
  "5min": 300,
  "10min": 600,
};

export function getContentSpeed(contentType: string): ContentSpeed {
  if (contentType === "reels") return "reels";
  if (contentType.startsWith("discurso")) return "discurso";
  return "natural";
}

export function getDurationSeconds(duration: string): number {
  if (DURATION_SECONDS[duration]) return DURATION_SECONDS[duration];
  const custom = parseInt(duration.replace("s", ""), 10);
  return isNaN(custom) ? 30 : custom;
}

export function calculateWordRange(duration: string, contentType: string): { min: number; max: number; avg: number } {
  const seconds = getDurationSeconds(duration);
  const speed = getContentSpeed(contentType);
  const wpm = WORDS_PER_MINUTE[speed];
  const minutes = seconds / 60;
  const base = Math.round(wpm * minutes);
  const min = Math.round(base * 0.85);
  const max = Math.round(base * 1.15);
  return { min, max, avg: base };
}

export function estimateReadingTime(wordCount: number, contentType: string): string {
  const speed = getContentSpeed(contentType);
  const wpm = WORDS_PER_MINUTE[speed];
  const minutes = wordCount / wpm;
  if (minutes < 1) {
    return `${Math.round(minutes * 60)}s`;
  }
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}
