import { api } from "./client";
import type { Movie } from "../types";

export const getFavorites = async () => {
  const { data } = await api.get<Movie[]>("/favorites");
  return data;
};

export const addToFavorites = async (movieId: number) => {
  // This endpoint only accepts form-encoded data
  await api.post("/favorites", new URLSearchParams({ id: String(movieId) }));
};

export const removeFromFavorites = async (movieId: number) => {
  await api.delete(`/favorites/${movieId}`);
};
