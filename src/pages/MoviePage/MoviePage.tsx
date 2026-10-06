import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getMovieById, getMovies } from "../../api/movies";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";
import { PlayIcon, StarIcon } from "../../components/icons";
import Loader from "../../components/Loader/Loader";
import MovieRow from "../../components/MovieRow/MovieRow";
import TrailerModal from "../../components/TrailerModal/TrailerModal";
import type { Movie } from "../../types";
import { formatGenre, formatLanguage, formatMoney, formatRuntime, getRatingLevel } from "../../utils/format";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import "./MoviePage.css";

const SIMILAR_COUNT = 16;

function MovieDetails({ id }: { id: number }) {
  // undefined — loading, null — not found
  const [movie, setMovie] = useState<Movie | null>();
  const [similar, setSimilar] = useState<Movie[]>();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getMovieById(id)
      .then((data) => {
        // The API answers 200 with an empty body for unknown ids
        if (!cancelled) setMovie(data?.id ? data : null);
      })
      .catch(() => {
        if (!cancelled) setMovie(null);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const mainGenre = movie?.genres[0];

  useEffect(() => {
    if (!mainGenre) return;

    const controller = new AbortController();

    getMovies({ genre: mainGenre, count: SIMILAR_COUNT + 1 }, controller.signal)
      .then((movies) => setSimilar(movies.filter((item) => item.id !== id).slice(0, SIMILAR_COUNT)))
      .catch(() => {
        if (!controller.signal.aborted) setSimilar([]);
      });

    return () => controller.abort();
  }, [mainGenre, id]);

  if (movie === undefined) return <Loader />;
  if (movie === null) return <NotFoundPage />;

  const facts = [
    ["Director", movie.director],
    ["Cast", movie.cast.slice(0, 5).join(", ")],
    ["Original title", movie.originalTitle !== movie.title ? movie.originalTitle : null],
    ["Language", movie.language ? formatLanguage(movie.language) : null],
    ["Budget", movie.budget ? formatMoney(movie.budget) : null],
    ["Box office", movie.revenue ? formatMoney(movie.revenue) : null],
    ["Production", movie.production],
    ["Awards", movie.awardsSummary],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));

  return (
    <article className="movie">
      {movie.backdropUrl && <img className="movie__backdrop" src={movie.backdropUrl} alt="" />}

      <div className="page movie__page">
        <div className="movie__main">
          <div className="movie__poster">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={`${movie.title} poster`} />
            ) : (
              <div className="movie__poster-placeholder">{movie.title}</div>
            )}
          </div>

          <div className="movie__info">
            <div className="movie__meta">
              {movie.tmdbRating ? (
                <span className={`rating rating--${getRatingLevel(movie.tmdbRating)}`}>
                  <StarIcon width={12} height={12} />
                  {movie.tmdbRating.toFixed(1)}
                </span>
              ) : null}
              {movie.releaseYear && <span>{movie.releaseYear}</span>}
              {movie.runtime ? <span>{formatRuntime(movie.runtime)}</span> : null}
            </div>

            <h1 className="movie__title">{movie.title}</h1>

            <ul className="movie__genres">
              {movie.genres.map((genre) => (
                <li key={genre}>
                  <Link className="movie__genre" to={`/genre/${genre}`}>
                    {formatGenre(genre)}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="movie__plot">{movie.plot}</p>

            <div className="movie__actions">
              {movie.trailerYouTubeId && (
                <button className="button button--primary" type="button" onClick={() => setIsTrailerOpen(true)}>
                  <PlayIcon width={18} height={18} />
                  Watch trailer
                </button>
              )}
              <FavoriteButton movie={movie} variant="full" />
            </div>

            {facts.length > 0 && (
              <dl className="movie__facts">
                {facts.map(([label, value]) => (
                  <div className="movie__fact" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        {mainGenre && (
          <MovieRow title="More like this" movies={similar} linkTo={`/genre/${mainGenre}`} />
        )}
      </div>

      {isTrailerOpen && movie.trailerYouTubeId && (
        <TrailerModal
          title={movie.title}
          youTubeId={movie.trailerYouTubeId}
          onClose={() => setIsTrailerOpen(false)}
        />
      )}
    </article>
  );
}

function MoviePage() {
  const id = Number(useParams().id);

  if (!Number.isInteger(id) || id <= 0) return <NotFoundPage />;

  // The key resets the state when navigating from one movie to another
  return <MovieDetails key={id} id={id} />;
}

export default MoviePage;
