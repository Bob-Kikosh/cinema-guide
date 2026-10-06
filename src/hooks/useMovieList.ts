import { useCallback, useEffect, useState } from "react";

import { getMovies } from "../api/movies";
import type { Movie } from "../types";

const PAGE_SIZE = 20;

export type ListStatus = "loading" | "idle" | "done" | "error";

interface Params {
  genre?: string;
  title?: string;
}

// Paginated movie list for infinite scrolling.
// The component using it should be remounted (via `key`) when params change.
export function useMovieList({ genre, title }: Params) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<ListStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    getMovies({ genre, title, page, count: PAGE_SIZE }, controller.signal)
      .then((data) => {
        setMovies((current) => {
          const known = new Set(current.map((movie) => movie.id));

          return [...current, ...data.filter((movie) => !known.has(movie.id))];
        });

        // A short page means there is nothing left to load
        setStatus(data.length < PAGE_SIZE ? "done" : "idle");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });

    return () => controller.abort();
  }, [genre, title, page]);

  const loadMore = useCallback(() => {
    if (status !== "idle") return;

    setStatus("loading");
    setPage((current) => current + 1);
  }, [status]);

  return { movies, status, loadMore };
}
