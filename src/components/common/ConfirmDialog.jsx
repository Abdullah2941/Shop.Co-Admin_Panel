import Modal from "./Modal";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel} width={380}>
      <p className="confirm-dialog__message">{message}</p>
      <div className="confirm-dialog__actions">
        <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
