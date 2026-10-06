import Modal from "../Modal/Modal";
import "./TrailerModal.css";

interface Props {
  title: string;
  youTubeId: string;
  onClose: () => void;
}

function TrailerModal({ title, youTubeId, onClose }: Props) {
  return (
    <Modal label={`${title} — trailer`} onClose={onClose} wide>
      <div className="trailer">
        <iframe
          className="trailer__frame"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youTubeId)}?autoplay=1&rel=0`}
          title={`${title} — trailer`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        />
      </div>
      {/* The player stays empty when YouTube is unreachable, so a direct link is always offered */}
      <p className="trailer__fallback">
        Player not loading?{" "}
        <a
          className="trailer__link"
          href={`https://www.youtube.com/watch?v=${encodeURIComponent(youTubeId)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch on YouTube
        </a>
      </p>
    </Modal>
  );
}

export default TrailerModal;
