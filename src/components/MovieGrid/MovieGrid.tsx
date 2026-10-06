import type { ReactNode } from "react";

import type { Movie } from "../../types";
import MovieCard from "../MovieCard/MovieCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import "./MovieGrid.css";

interface Props {
  movies: Movie[];
  // Number of placeholder cards appended while more movies are loading
  skeletons?: number;
  children?: ReactNode;
}

function MovieGrid({ movies, skeletons = 0, children }: Props) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      {Array.from({ length: skeletons }, (_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ))}
      {children}
    </div>
  );
}

export default MovieGrid;
