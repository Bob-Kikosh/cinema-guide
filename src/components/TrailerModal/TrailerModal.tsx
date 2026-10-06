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
    </Modal>
  );
}

export default TrailerModal;
