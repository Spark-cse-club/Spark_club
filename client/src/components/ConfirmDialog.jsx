import Modal from "./Modal.jsx";
import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = "Confirm Delete", message = "Are you sure? This action cannot be undone.", loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div style={{ textAlign: "center", padding: "1rem 0" }}>
        <div style={{
          width: 56, height: 56,
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.25rem",
        }}>
          <FiAlertTriangle size={24} color="#ef4444" />
        </div>
        <h3 style={{ marginBottom: "0.75rem" }}>{title}</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.75rem" }}>{message}</p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
            style={{ minWidth: 100 }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
