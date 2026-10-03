import {
  FiArrowRight,
  FiAward,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

import "./AchievementCard.css";

const AchievementCard = ({
  achievement,
  onViewDetails,
}) => {
  const images = achievement?.images || [];

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCategory = (category) => {
    if (!category) return "Other";

    return category
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  return (
    <article className="achievement-card">
      {/* Images */}
      {images.length > 0 ? (
        <div
          className={`achievement-card-photos achievement-card-photos-${Math.min(
            images.length,
            4
          )}`}
        >
          {images.slice(0, 4).map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="achievement-card-photo"
            >
              <img
                src={image.url}
                alt={achievement.title || "Achievement"}
                loading="lazy"
              />
            </div>
          ))}

          {images.length > 1 && (
            <span className="achievement-image-count">
              <FiAward />
              {images.length}
            </span>
          )}
        </div>
      ) : (
        <div className="achievement-card-placeholder">
          <FiAward />
        </div>
      )}

      {/* Content */}
      <div className="achievement-card-content">
        <div className="achievement-card-meta">
          <span className="achievement-category">
            {formatCategory(achievement.category)}
          </span>

          {achievement.rank && (
            <span className="achievement-rank">
              🏅 {achievement.rank}
            </span>
          )}
        </div>

        <h3>{achievement.title}</h3>

        {achievement.description && (
          <p className="achievement-card-description">
            {achievement.description}
          </p>
        )}

        <div className="achievement-card-facts">
          {achievement.personName && (
            <div className="achievement-card-fact">
              <FiUser />
              <span>{achievement.personName}</span>
            </div>
          )}

          <div className="achievement-card-fact">
            <FiCalendar />
            <span>
              {formatDate(achievement.achievementDate)}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="achievement-view-button"
          onClick={onViewDetails}
        >
          <span>View Details</span>
          <FiArrowRight />
        </button>
      </div>
    </article>
  );
};

export default AchievementCard;
