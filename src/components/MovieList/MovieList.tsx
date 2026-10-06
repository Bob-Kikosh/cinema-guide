import { useEffect, useRef } from "react";

import { useMovieList } from "../../hooks/useMovieList";
import MovieGrid from "../MovieGrid/MovieGrid";
import "./MovieList.css";

const SKELETON_COUNT = 12;

interface Props {
  genre?: string;
  title?: string;
  emptyText: string;
}

// Movie grid with infinite scrolling.
// Render it with a `key` built from the params so a new query starts from scratch.
function MovieList({ genre, title, emptyText }: Props) {
  const { movies, status, loadMore } = useMovieList({ genre, title });
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load the next page when the sentinel below the grid scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore]);

  if (status === "done" && !movies.length) {
    return <p className="movie-list__message">{emptyText}</p>;
  }

  return (
    <>
      <MovieGrid movies={movies} skeletons={status === "loading" ? SKELETON_COUNT : 0} />

      {status === "error" && (
        <p className="movie-list__message" role="alert">
          Failed to load movies. Please refresh the page.
        </p>
      )}

      {status === "done" && movies.length > SKELETON_COUNT && (
        <p className="movie-list__message">That's all for now</p>
      )}

      <div ref={sentinelRef} />
    </>
  );
}

export default MovieList;
