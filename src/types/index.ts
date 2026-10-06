export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  language: string;
  releaseYear: number | null;
  genres: string[];
  plot: string;
  runtime: number | null;
  budget: string | null;
  revenue: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerYouTubeId: string | null;
  tmdbRating: number | null;
  cast: string[];
  director: string | null;
  production: string | null;
  awardsSummary: string | null;
}

export interface User {
  name: string;
  surname: string;
  email: string;
  // Movie ids, stored by the API as strings
  favorites: string[];
}
