import "./SkeletonCard.css";

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__poster skeleton" />
      <div className="skeleton-card__title skeleton" />
    </div>
  );
}

export default SkeletonCard;
