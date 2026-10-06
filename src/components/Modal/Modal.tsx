import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { CloseIcon } from "../icons";
import "./Modal.css";

interface Props {
  label: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

function Modal({ label, onClose, children, wide = false }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    // Lock page scroll while the modal is open
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`modal__window${wide ? " modal__window--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button className="modal__close" type="button" aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
