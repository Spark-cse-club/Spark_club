import { useEffect, useState } from "react";
import {
  FiAward,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
  FiLink,
  FiUsers,
  FiUser,
  FiX,
} from "react-icons/fi";

import "./AchievementModal.css";

const AchievementModal = ({
  achievement,
  onClose,
}) => {
  const images = achievement?.images || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentImage = images[currentIndex];

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
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

  const showPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (images.length > 1 && e.key === "ArrowLeft") {
        showPrevious();
      }

      if (images.length > 1 && e.key === "ArrowRight") {
        showNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [images.length]);

  return (
    <div
      className="achievement-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="achievement-modal">
        {/* Close */}
        <button
          type="button"
          className="achievement-modal-close"
          onClick={onClose}
          aria-label="Close achievement details"
        >
          <FiX />
        </button>

        {/* Images */}
        <div className="achievement-modal-image-section">
          {currentImage?.url ? (
            <img
              src={currentImage.url}
              alt={achievement.title || "Achievement"}
              className="achievement-modal-main-image"
            />
          ) : (
            <div className="achievement-modal-placeholder">
              <FiAward />
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="achievement-modal-nav achievement-modal-prev"
                onClick={showPrevious}
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                className="achievement-modal-nav achievement-modal-next"
                onClick={showNext}
                aria-label="Next image"
              >
                <FiChevronRight />
              </button>

              <div className="achievement-modal-counter">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="achievement-modal-thumbnails">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                className={`achievement-modal-thumbnail ${
                  currentIndex === index ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={image.url}
                  alt={`Achievement ${index + 1}`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="achievement-modal-content">
          {/* Category + Rank */}
          <div className="achievement-modal-badges">
            <span className="achievement-modal-category">
              {formatCategory(achievement.category)}
            </span>

            {achievement.rank && (
              <span className="achievement-modal-rank">
                🏅 {achievement.rank}
              </span>
            )}
          </div>

          {/* Title */}
          <h2>{achievement.title}</h2>

          {/* Information */}
          <div className="achievement-modal-info">
            {achievement.personName && (
              <div className="achievement-modal-info-item">
                <FiUser />

                <div>
                  <span>Achieved By</span>
                  <strong>{achievement.personName}</strong>
                </div>
              </div>
            )}

            {achievement.teamName && (
              <div className="achievement-modal-info-item">
                <FiUsers />

                <div>
                  <span>Team</span>
                  <strong>{achievement.teamName}</strong>
                </div>
              </div>
            )}

            {achievement.organization && (
              <div className="achievement-modal-info-item">
                <FiAward />

                <div>
                  <span>Organization</span>
                  <strong>{achievement.organization}</strong>
                </div>
              </div>
            )}

            {achievement.achievementDate && (
              <div className="achievement-modal-info-item">
                <FiCalendar />

                <div>
                  <span>Achievement Date</span>
                  <strong>
                    {formatDate(
                      achievement.achievementDate
                    )}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {achievement.description && (
            <div className="achievement-modal-description">
              <h3>About This Achievement</h3>

              <p>{achievement.description}</p>
            </div>
          )}

          {/* External Link */}
          {achievement.link && (
            <div className="achievement-modal-actions">
              <a
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="achievement-modal-link"
              >
                <FiLink />
                <span>View Achievement</span>
                <FiExternalLink />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementModal;