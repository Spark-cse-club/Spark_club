import {
  FiCalendar,
  FiImage,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";

import "./GalleryCard.css";

const GalleryCard = ({ gallery, onViewDetails }) => {
  const images = gallery?.images || [];

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryLabel = (category) => {
    if (!category) return "Other";

    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <article className="gallery-card">

      {/* =================================
          COVER IMAGE
      ================================= */}

      <div className="gallery-card-cover">
        {images.length > 0 ? (
          <img
            src={images[0]?.url}
            alt={gallery.title || "Gallery"}
            loading="lazy"
          />
        ) : (
          <div className="gallery-card-placeholder">
            <FiImage />
          </div>
        )}

        {/* Image Count */}
        {images.length > 1 && (
          <span className="gallery-image-count">
            <FiImage />
            {images.length}
          </span>
        )}
      </div>


      {/* =================================
          CONTENT
      ================================= */}

      <div className="gallery-card-content">

        <div className="gallery-card-header">
          <h3>{gallery.title}</h3>

          <span className="gallery-category">
            {getCategoryLabel(gallery.category)}
          </span>
        </div>


        {/* Event Name */}

        {gallery.eventName && (
          <div className="gallery-card-meta">
            <FiMapPin />
            <span>{gallery.eventName}</span>
          </div>
        )}


        {/* Event Date */}

        {gallery.eventDate && (
          <div className="gallery-card-meta">
            <FiCalendar />
            <span>{formatDate(gallery.eventDate)}</span>
          </div>
        )}


        {/* =================================
            THUMBNAILS — MAX 4
        ================================= */}

        {images.length > 1 && (
          <div className="gallery-card-thumbnails">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className="gallery-card-thumbnail"
              >
                <img
                  src={image.url}
                  alt=""
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}


        {/* =================================
            VIEW DETAILS
        ================================= */}

        <button
          type="button"
          className="gallery-view-button"
          onClick={onViewDetails}
        >
          <span>View Details</span>
          <FiArrowRight />
        </button>

      </div>
    </article>
  );
};

export default GalleryCard;
