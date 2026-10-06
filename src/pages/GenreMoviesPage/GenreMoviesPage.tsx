import { Link, useParams } from "react-router-dom";

import MovieList from "../../components/MovieList/MovieList";
import { formatGenre } from "../../utils/format";

function GenreMoviesPage() {
  const { genre = "" } = useParams();

  return (
    <div className="page">
      <Link className="page__back" to="/genres">
        ← All genres
      </Link>
      <h1 className="page__title">{formatGenre(genre)}</h1>

      <MovieList key={genre} genre={genre} emptyText="There are no movies in this genre yet" />
    </div>
  );
}

export default GenreMoviesPage;
