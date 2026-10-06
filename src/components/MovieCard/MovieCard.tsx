import { useState } from "react";
import { Link } from "react-router-dom";

import type { Movie } from "../../types";
import { formatGenre, getRatingLevel } from "../../utils/format";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { StarIcon } from "../icons";
import "./MovieCard.css";

interface Props {
  movie: Movie;
  // Position in a ranked row (1-based)
  rank?: number;
}

function MovieCard({ movie, rank }: Props) {
  const [hasImageError, setHasImageError] = useState(false);
  const showPoster = movie.posterUrl && !hasImageError;

  return (
    <Link className="movie-card" to={`/movie/${movie.id}`}>
      <div className="movie-card__poster">
        {showPoster ? (
          <img
            className="movie-card__image"
            src={movie.posterUrl!}
            alt={movie.title}
            loading="lazy"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="movie-card__placeholder">{movie.title}</div>
        )}

        {movie.tmdbRating ? (
          <span className={`rating rating--${getRatingLevel(movie.tmdbRating)} movie-card__rating`}>
            <StarIcon width={12} height={12} />
            {movie.tmdbRating.toFixed(1)}
          </span>
        ) : null}

        <div className="movie-card__favorite">
          <FavoriteButton movie={movie} />
        </div>

        <div className="movie-card__overlay">
          <span className="movie-card__meta">
            {[movie.releaseYear, ...movie.genres.slice(0, 2).map(formatGenre)].filter(Boolean).join(" · ")}
          </span>
        </div>

        {rank && <span className="movie-card__rank">{rank}</span>}
      </div>

      <h3 className="movie-card__title">{movie.title}</h3>
    </Link>
  );
}

export default MovieCard;
