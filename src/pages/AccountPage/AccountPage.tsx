import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getFavorites } from "../../api/favorites";
import Loader from "../../components/Loader/Loader";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import { useAuth } from "../../context/authContext";
import type { Movie } from "../../types";
import "./AccountPage.css";

function Favorites() {
  const { isFavorite } = useAuth();
  // undefined — loading, null — failed
  const [movies, setMovies] = useState<Movie[] | null>();

  useEffect(() => {
    let cancelled = false;

    getFavorites()
      .then((data) => {
        if (!cancelled) setMovies(data);
      })
      .catch(() => {
        if (!cancelled) setMovies(null);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (movies === undefined) return <Loader />;

  if (movies === null) {
    return (
      <p className="page__message" role="alert">
        Failed to load favorites. Please refresh the page.
      </p>
    );
  }

  // A movie disappears from the list as soon as its heart is switched off
  const visible = movies.filter((movie) => isFavorite(movie.id));

  if (!visible.length) {
    return (
      <div className="account__empty">
        <p>You have no favorite movies yet</p>
        <Link className="button button--primary" to="/">
          Find something to watch
        </Link>
      </div>
    );
  }

  return <MovieGrid movies={visible} />;
}

function AccountPage() {
  const { user, isLoading, openLogin } = useAuth();

  if (isLoading) return <Loader />;

  if (!user) {
    return (
      <div className="page">
        <div className="account__empty">
          <h1 className="page__title">Sign in to see your favorites</h1>
          <button className="button button--primary" type="button" onClick={openLogin}>
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="account__profile">
        <span className="account__avatar">{user.name.charAt(0).toUpperCase()}</span>
        <div>
          <p className="account__name">
            {user.name} {user.surname}
          </p>
          <p className="account__email">{user.email}</p>
        </div>
      </div>

      <h1 className="page__title">My favorites</h1>

      <Favorites />
    </div>
  );
}

export default AccountPage;
