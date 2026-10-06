import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getGenres, getMovies } from "../../api/movies";
import Loader from "../../components/Loader/Loader";
import { formatGenre } from "../../utils/format";
import "./GenresPage.css";

function GenreCard({ genre, index }: { genre: string; index: number }) {
  const [image, setImage] = useState<string | null>(null);

  // The card background is a still from one of the genre's movies.
  // Popular movies belong to several genres, so each card takes a different
  // position in its list to avoid showing the same picture twice.
  useEffect(() => {
    const controller = new AbortController();

    getMovies({ genre, count: 1, page: index }, controller.signal)
      .then(([movie]) => setImage(movie?.backdropUrl ?? movie?.posterUrl ?? null))
      .catch(() => {});

    return () => controller.abort();
  }, [genre, index]);

  return (
    <Link className="genre-card" to={`/genre/${genre}`}>
      {image && <img className="genre-card__image" src={image} alt="" loading="lazy" />}
      <span className="genre-card__name">{formatGenre(genre)}</span>
    </Link>
  );
}

function GenresPage() {
  // undefined — loading, null — failed
  const [genres, setGenres] = useState<string[] | null>();

  useEffect(() => {
    let cancelled = false;

    getGenres()
      .then((data) => {
        if (!cancelled) setGenres([...data].sort());
      })
      .catch(() => {
        if (!cancelled) setGenres(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <h1 className="page__title">Genres</h1>

      {genres === undefined && <Loader />}

      {genres === null && (
        <p className="page__message" role="alert">
          Failed to load genres. Please refresh the page.
        </p>
      )}

      {genres && (
        <div className="genres">
          {genres.map((genre, index) => (
            <GenreCard key={genre} genre={genre} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default GenresPage;
