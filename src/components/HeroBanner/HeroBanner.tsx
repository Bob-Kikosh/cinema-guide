import { useState } from "react";
import { Link } from "react-router-dom";

import type { Movie } from "../../types";
import { formatGenre, formatRuntime, getRatingLevel } from "../../utils/format";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { PlayIcon, ShuffleIcon, StarIcon } from "../icons";
import TrailerModal from "../TrailerModal/TrailerModal";
import "./HeroBanner.css";

interface Props {
  // undefined while the movie is loading
  movie: Movie | undefined;
  onShuffle: () => void;
  isShuffling: boolean;
}

function HeroBanner({ movie, onShuffle, isShuffling }: Props) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  if (!movie) {
    return <div className="hero hero--loading skeleton" aria-hidden="true" />;
  }

  const image = movie.backdropUrl ?? movie.posterUrl;
  const meta = [
    movie.releaseYear,
    movie.runtime ? formatRuntime(movie.runtime) : null,
    ...movie.genres.slice(0, 3).map(formatGenre),
  ].filter(Boolean);

  return (
    <section className="hero">
      {/* The key restarts the fade-in animation for every new movie */}
      {image && <img className="hero__image" key={movie.id} src={image} alt="" />}

      <div className="hero__content" key={`content-${movie.id}`}>
        <div className="hero__meta">
          {movie.tmdbRating ? (
            <span className={`rating rating--${getRatingLevel(movie.tmdbRating)}`}>
              <StarIcon width={12} height={12} />
              {movie.tmdbRating.toFixed(1)}
            </span>
          ) : null}
          <span>{meta.join(" · ")}</span>
        </div>

        <h1 className="hero__title">{movie.title}</h1>

        <p className="hero__plot">{movie.plot}</p>

        <div className="hero__actions">
          {movie.trailerYouTubeId && (
            <button className="button button--primary" type="button" onClick={() => setIsTrailerOpen(true)}>
              <PlayIcon width={18} height={18} />
              Trailer
            </button>
          )}

          <Link className="button button--ghost" to={`/movie/${movie.id}`}>
            Details
          </Link>

          <FavoriteButton movie={movie} />

          <button
            className="hero__shuffle"
            type="button"
            aria-label="Show another movie"
            title="Show another movie"
            disabled={isShuffling}
            onClick={onShuffle}
          >
            <ShuffleIcon width={18} height={18} />
          </button>
        </div>
      </div>

      {isTrailerOpen && movie.trailerYouTubeId && (
        <TrailerModal
          title={movie.title}
          youTubeId={movie.trailerYouTubeId}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </section>
  );
}

export default HeroBanner;
