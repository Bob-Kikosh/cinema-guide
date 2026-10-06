import { useEffect, useState } from "react";
import type { FocusEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getMovies } from "../../api/movies";
import { useDebounce } from "../../hooks/useDebounce";
import type { Movie } from "../../types";
import { SearchIcon, StarIcon } from "../icons";
import "./SearchBox.css";

const MIN_QUERY_LENGTH = 2;
const SUGGESTION_COUNT = 5;

interface Suggestions {
  query: string;
  movies: Movie[];
}

function SearchBox() {
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);

  const query = useDebounce(value.trim(), 300);
  const isQueryValid = query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!isQueryValid) return;

    const controller = new AbortController();

    getMovies({ title: query, count: SUGGESTION_COUNT }, controller.signal)
      .then((movies) => setSuggestions({ query, movies }))
      .catch(() => {
        if (!controller.signal.aborted) setSuggestions({ query, movies: [] });
      });

    return () => controller.abort();
  }, [query, isQueryValid]);

  // Results are shown only when they belong to the text currently in the field
  const current = isQueryValid && suggestions?.query === query ? suggestions : null;
  const isLoading = isQueryValid && !current;

  const close = () => {
    setIsOpen(false);
    setValue("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const text = value.trim();

    if (!text) return;

    navigate(`/search?q=${encodeURIComponent(text)}`);
    close();
  };

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    // Keep the dropdown open while focus moves between the field and the results
    if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
  };

  return (
    <form className="search" role="search" onSubmit={handleSubmit} onBlur={handleBlur}>
      <SearchIcon className="search__icon" width={18} height={18} />

      <input
        className="search__input"
        type="search"
        placeholder="Search movies"
        name="q"
        aria-label="Search movies"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
      />

      {isOpen && isQueryValid && (
        <div className="search__dropdown">
          {isLoading && <p className="search__message">Searching…</p>}

          {current && !current.movies.length && <p className="search__message">Nothing found</p>}

          {current?.movies.map((movie) => (
            <Link className="search__item" key={movie.id} to={`/movie/${movie.id}`} onClick={close}>
              {movie.posterUrl ? (
                <img className="search__poster" src={movie.posterUrl} alt="" loading="lazy" />
              ) : (
                <span className="search__poster" />
              )}
              <span className="search__info">
                <span className="search__title">{movie.title}</span>
                <span className="search__meta">
                  {movie.releaseYear}
                  {movie.tmdbRating ? (
                    <>
                      <StarIcon width={11} height={11} />
                      {movie.tmdbRating.toFixed(1)}
                    </>
                  ) : null}
                </span>
              </span>
            </Link>
          ))}

          {current && current.movies.length > 0 && (
            <button className="search__all" type="submit">
              Show all results
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default SearchBox;
