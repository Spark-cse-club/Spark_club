import Modal from "./Modal.jsx";
import { FiAlertTriangle } from "react-icons/fi";

import "./ConfirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure? This action cannot be undone.",
  loading,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="confirm-dialog-body">

        <div className="confirm-dialog-icon-wrap">
          <FiAlertTriangle size={24} />
        </div>

        <h3 className="confirm-dialog-heading">
          {title}
        </h3>

        <p className="confirm-dialog-copy">
          {message}
        </p>

        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-dialog-delete"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </Modal>
  );
}

