const GENRE_LABELS: Record<string, string> = {
  scifi: "Sci-Fi",
  "tv-movie": "TV Movie",
  "stand-up": "Stand-up",
};

export function formatGenre(genre: string) {
  return GENRE_LABELS[genre] ?? genre.charAt(0).toUpperCase() + genre.slice(1);
}

export function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!hours) return `${rest}m`;

  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatMoney(value: string) {
  const amount = Number(value);

  return Number.isFinite(amount) && amount > 0 ? moneyFormatter.format(amount) : null;
}

const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

export function formatLanguage(code: string) {
  try {
    return languageNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export type RatingLevel = "high" | "medium" | "low";

export function getRatingLevel(rating: number): RatingLevel {
  if (rating >= 7) return "high";
  if (rating >= 5) return "medium";

  return "low";
}
