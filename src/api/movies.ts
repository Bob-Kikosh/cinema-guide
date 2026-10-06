import { api } from "./client";
import type { Movie } from "../types";

interface MovieQuery {
  genre?: string;
  title?: string;
  // Zero-based page index
  page?: number;
  count?: number;
}

export const getMovies = async (query: MovieQuery, signal?: AbortSignal) => {
  const { data } = await api.get<Movie[]>("/movie", { params: query, signal });
  return data;
};

export const getTopMovies = async () => {
  const { data } = await api.get<Movie[]>("/movie/top10");
  return data;
};

export const getRandomMovie = async () => {
  const { data } = await api.get<Movie>("/movie/random");
  return data;
};

export const getMovieById = async (id: number) => {
  const { data } = await api.get<Movie>(`/movie/${id}`);
  return data;
};

export const getGenres = async () => {
  const { data } = await api.get<string[]>("/movie/genres");
  return data;
};
