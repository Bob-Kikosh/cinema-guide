import type { MouseEvent } from "react";

import { useAuth } from "../../context/authContext";
import type { Movie } from "../../types";
import { HeartIcon } from "../icons";
import "./FavoriteButton.css";

interface Props {
  movie: Movie;
  // "icon" is the round button on cards, "full" has a text label
  variant?: "icon" | "full";
}

function FavoriteButton({ movie, variant = "icon" }: Props) {
  const { isFavorite, toggleFavorite } = useAuth();
  const active = isFavorite(movie.id);
  const label = active ? "Remove from favorites" : "Add to favorites";

  const handleClick = (event: MouseEvent) => {
    // Cards are links, so the click must not open the movie page
    event.preventDefault();
    event.stopPropagation();

    void toggleFavorite(movie);
  };

  if (variant === "full") {
    return (
      <button
        className={`button button--ghost favorite favorite--full${active ? " favorite--active" : ""}`}
        type="button"
        aria-pressed={active}
        onClick={handleClick}
      >
        <HeartIcon filled={active} />
        {active ? "In favorites" : "Add to favorites"}
      </button>
    );
  }

  return (
    <button
      className={`favorite favorite--icon${active ? " favorite--active" : ""}`}
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={handleClick}
    >
      <HeartIcon filled={active} width={18} height={18} />
    </button>
  );
}

export default FavoriteButton;
