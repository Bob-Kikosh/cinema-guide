import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getMovies, getRandomMovie, getTopMovies } from "../../api/movies";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import MovieRow from "../../components/MovieRow/MovieRow";
import type { Movie } from "../../types";
import { formatGenre } from "../../utils/format";

const FEATURED_GENRES = ["action", "comedy", "scifi", "animation"];
const ROW_SIZE = 16;
const HERO_ATTEMPTS = 4;

// The banner needs a wide image, and not every movie has one
async function getHeroMovie() {
  let movie = await getRandomMovie();

  for (let attempt = 1; attempt < HERO_ATTEMPTS && !movie.backdropUrl; attempt++) {
    movie = await getRandomMovie();
  }

  return movie;
}

function GenreRow({ genre }: { genre: string }) {
  const [movies, setMovies] = useState<Movie[]>();

  useEffect(() => {
    const controller = new AbortController();

    getMovies({ genre, count: ROW_SIZE }, controller.signal)
      .then(setMovies)
      .catch(() => {
        if (!controller.signal.aborted) setMovies([]);
      });

    return () => controller.abort();
  }, [genre]);

  return <MovieRow title={formatGenre(genre)} movies={movies} linkTo={`/genre/${genre}`} />;
}

function HomePage() {
  const [heroMovie, setHeroMovie] = useState<Movie>();
  const [isShuffling, setIsShuffling] = useState(false);
  const [topMovies, setTopMovies] = useState<Movie[]>();

  useEffect(() => {
    let cancelled = false;

    getHeroMovie()
      .then((movie) => {
        if (!cancelled) setHeroMovie(movie);
      })
      .catch(() => toast.error("Failed to load the featured movie"));

    getTopMovies()
      .then((movies) => {
        if (!cancelled) setTopMovies(movies);
      })
      .catch(() => {
        if (!cancelled) setTopMovies([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const shuffle = useCallback(async () => {
    setIsShuffling(true);

    try {
      setHeroMovie(await getHeroMovie());
    } catch {
      toast.error("Failed to load another movie");
    } finally {
      setIsShuffling(false);
    }
  }, []);

  return (
    <div className="page">
      <HeroBanner movie={heroMovie} onShuffle={shuffle} isShuffling={isShuffling} />

      <MovieRow title="Top 10" movies={topMovies} ranked />

      {FEATURED_GENRES.map((genre) => (
        <GenreRow key={genre} genre={genre} />
      ))}
    </div>
  );
}

export default HomePage;
