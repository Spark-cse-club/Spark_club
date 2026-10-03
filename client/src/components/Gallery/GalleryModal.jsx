import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiMapPin,
  FiX,
} from "react-icons/fi";

import "./GalleryModal.css";

const GalleryModal = ({ gallery, onClose }) => {
  const images = gallery?.images || [];

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

  const getCategoryLabel = (category) => {
    if (!category) return "Other";

    return category.charAt(0).toUpperCase() + category.slice(1);
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
      className="gallery-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div className="gallery-modal">
        {/* Close Button */}
        <button
          type="button"
          className="gallery-modal-close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <FiX />
        </button>

        {/* Image Section */}
        <div className="gallery-modal-image-section">
          {currentImage?.url ? (
            <img
              src={currentImage.url}
              alt={gallery.title || "Gallery image"}
              className="gallery-modal-main-image"
            />
          ) : (
            <div className="gallery-modal-placeholder">
              <FiImage />
            </div>
          )}

          {/* Previous */}
          {images.length > 1 && (
            <button
              type="button"
              className="gallery-modal-nav gallery-modal-prev"
              onClick={showPrevious}
              aria-label="Previous image"
            >
              <FiChevronLeft />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              className="gallery-modal-nav gallery-modal-next"
              onClick={showNext}
              aria-label="Next image"
            >
              <FiChevronRight />
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="gallery-modal-counter">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="gallery-modal-thumbnails">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                className={`gallery-modal-thumbnail ${
                  currentIndex === index ? "active" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={image.url}
                  alt={`Gallery ${index + 1}`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="gallery-modal-content">
          <div className="gallery-modal-badges">
            <span className="gallery-modal-category">
              {getCategoryLabel(gallery.category)}
            </span>
          </div>

          <h2>{gallery.title}</h2>

          <div className="gallery-modal-info">
            {gallery.eventName && (
              <div className="gallery-modal-info-item">
                <FiMapPin />
                <div>
                  <span>Event</span>
                  <strong>{gallery.eventName}</strong>
                </div>
              </div>
            )}

            {gallery.eventDate && (
              <div className="gallery-modal-info-item">
                <FiCalendar />
                <div>
                  <span>Date</span>
                  <strong>{formatDate(gallery.eventDate)}</strong>
                </div>
              </div>
            )}
          </div>

          {gallery.description && (
            <div className="gallery-modal-description">
              <h3>About This Gallery</h3>
              <p>{gallery.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;



