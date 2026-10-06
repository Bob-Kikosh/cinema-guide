import { useRef } from "react";
import { Link } from "react-router-dom";

import type { Movie } from "../../types";
import { ChevronIcon } from "../icons";
import MovieCard from "../MovieCard/MovieCard";
import SkeletonCard from "../SkeletonCard/SkeletonCard";
import "./MovieRow.css";

const SKELETON_COUNT = 8;

interface Props {
  title: string;
  // undefined while the movies are loading
  movies: Movie[] | undefined;
  linkTo?: string;
  ranked?: boolean;
}

function MovieRow({ title, movies, linkTo, ranked = false }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;

    // Scroll by almost a full screen of cards
    track?.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  if (movies && !movies.length) return null;

  return (
    <section className="movie-row">
      <div className="movie-row__head">
        <h2 className="movie-row__title">{title}</h2>
        {linkTo && (
          <Link className="movie-row__link" to={linkTo}>
            See all
          </Link>
        )}
      </div>

      <div className="movie-row__body">
        <button
          className="movie-row__arrow movie-row__arrow--prev"
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll(-1)}
        >
          <ChevronIcon direction="left" width={28} height={28} />
        </button>

        <div className="movie-row__track" ref={trackRef}>
          {movies
            ? movies.map((movie, index) => (
                <div className="movie-row__item" key={movie.id}>
                  <MovieCard movie={movie} rank={ranked ? index + 1 : undefined} />
                </div>
              ))
            : Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <div className="movie-row__item" key={index}>
                  <SkeletonCard />
                </div>
              ))}
        </div>

        <button
          className="movie-row__arrow movie-row__arrow--next"
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll(1)}
        >
          <ChevronIcon direction="right" width={28} height={28} />
        </button>
      </div>
    </section>
  );
}

export default MovieRow;
