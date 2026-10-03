
import {
  FiCalendar,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";

import "./EventCard.css";

const EventCard = ({ event, status, onViewDetails }) => {
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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

  return (
    <article className="event-card">
      {/* Poster */}
      <div className="event-card-image">
        {event.poster?.url ? (
          <img
            src={event.poster.url}
            alt={event.title}
            loading="lazy"
          />
        ) : (
          <div className="event-card-image-placeholder">
            <FiCalendar />
          </div>
        )}

        <div className="event-card-badges">
          <span className="event-category">
            {getCategoryLabel(event.category)}
          </span>

          <span className={`event-status ${status}`}>
            {getStatusLabel(status)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>

        <div className="event-card-meta">
          <div className="event-meta-item">
            <FiCalendar />
            <span>{formatDate(event.startDate)}</span>
          </div>

          {event.venue && (
            <div className="event-meta-item">
              <FiMapPin />
              <span>{event.venue}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="event-details-button"
          onClick={onViewDetails}
        >
          <span>View Details</span>
          <FiArrowRight />
        </button>
      </div>
    </article>
  );
};

export default EventCard;

