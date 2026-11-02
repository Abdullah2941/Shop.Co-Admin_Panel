import { useEffect } from "react";
import { X } from "lucide-react";
import "./Modal.css";

export default function Modal({ title, onClose, children, width = 480 }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel" style={{ maxWidth: width }} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
