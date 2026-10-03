
import {
  FiCalendar,
  FiMapPin,
  FiExternalLink,
  FiX,
} from "react-icons/fi";

import "./EventModal.css";

const EventModal = ({ event, status, onClose }) => {
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case "dsa":
        return "DSA";
      case "aptitude":
        return "Aptitude";
      case "other":
        return "Other";
      default:
        return category || "Event";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "ongoing":
        return "Ongoing";
      case "completed":
        return "Completed";
      default:
        return "";
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="event-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="event-modal">
        {/* Close Button */}
        <button
          type="button"
          className="event-modal-close"
          onClick={onClose}
          aria-label="Close event details"
        >
          <FiX />
        </button>

        {/* Poster */}
        <div className="event-modal-image">
          {event.poster?.url ? (
            <img
              src={event.poster.url}
              alt={event.title}
            />
          ) : (
            <div className="event-modal-image-placeholder">
              <FiCalendar />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="event-modal-content">
          {/* Badges */}
          <div className="event-modal-badges">
            <span className="event-modal-category">
              {getCategoryLabel(event.category)}
            </span>

            <span className={`event-modal-status ${status}`}>
              {getStatusLabel(status)}
            </span>
          </div>

          {/* Title */}
          <h2>{event.title}</h2>

          {/* Event Information */}
          <div className="event-modal-info">
            <div className="event-modal-info-item">
              <FiCalendar />

              <div>
                <span>Event Date</span>
                <strong>{formatDate(event.startDate)}</strong>
              </div>
            </div>

            {event.endDate && event.endDate !== event.startDate && (
              <div className="event-modal-info-item">
                <FiCalendar />

                <div>
                  <span>End Date</span>
                  <strong>{formatDate(event.endDate)}</strong>
                </div>
              </div>
            )}

            {event.venue && (
              <div className="event-modal-info-item">
                <FiMapPin />

                <div>
                  <span>Venue</span>
                  <strong>{event.venue}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="event-modal-description">
              <h3>About This Event</h3>
              <p>{event.description}</p>
            </div>
          )}

          {/* Registration */}
          {event.registrationLink && status !== "completed" && (
            <div className="event-modal-actions">
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="event-register-button"
              >
                Register Now
                <FiExternalLink />
              </a>
            </div>
          )}

          {/* Completed Event Message */}
          {status === "completed" && (
            <div className="event-completed-message">
              This event has been completed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;

