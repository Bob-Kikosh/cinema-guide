import { useSearchParams } from "react-router-dom";

import MovieList from "../../components/MovieList/MovieList";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  return (
    <div className="page">
      <h1 className="page__title">{query ? `Results for “${query}”` : "Search"}</h1>

      {query ? (
        <MovieList key={query} title={query} emptyText="Nothing found. Try a different title" />
      ) : (
        <p className="page__message">Type a movie title in the search field above</p>
      )}
    </div>
  );
}

export default SearchPage;
