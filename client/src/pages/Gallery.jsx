import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiImage,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { getGallery } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import "./Gallery.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getGallery()
      .then((res) => setGalleries(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "all",
    "event",
    "workshop",
    "hackathon",
    "competition",
    "celebration",
    "other",
  ];

  const filtered =
    filter === "all"
      ? galleries
      : galleries.filter((gallery) => gallery.category === filter);

  const openLightbox = (images, index) => {
    setLightbox({ images, index });
  };

  const closeLightbox = () => {
    setLightbox(null);
  };

  const prevImage = () => {
    setLightbox((current) => ({
      ...current,
      index:
        (current.index - 1 + current.images.length) %
        current.images.length,
    }));
  };

  const nextImage = () => {
    setLightbox((current) => ({
      ...current,
      index: (current.index + 1) % current.images.length,
    }));
  };

  if (loading) return <Loader />;

  return (
    <div className="spark-gallery-page">
      {/* Hero */}
      <section className="spark-gallery-hero">
        <div className="spark-gallery-hero-orb" />

        <div className="spark-gallery-hero-inner">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            <motion.div variants={fadeUp}>
              <span className="spark-gallery-kicker">
                <FiImage size={12} />
                Gallery
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="spark-gallery-heading"
            >
              Photo{" "}
              <span className="spark-gallery-heading-accent">
                Gallery
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="spark-gallery-lede"
            >
              Memories captured from our events, workshops, and
              celebrations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="spark-gallery-body">
        <div className="spark-gallery-inner">
          {/* Filters */}
          <div className="spark-gallery-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`spark-gallery-filter ${
                  filter === category
                    ? "spark-gallery-filter-active"
                    : ""
                }`}
                onClick={() => setFilter(category)}
              >
                {category === "all"
                  ? "All"
                  : category.charAt(0).toUpperCase() +
                    category.slice(1)}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 ? (
            <div className="spark-gallery-empty">
              <div className="spark-gallery-empty-icon">🖼️</div>
              <p>No gallery items found.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="spark-gallery-grid"
            >
              {filtered.map((gallery) => (
                <motion.article
                  key={gallery._id}
                  variants={fadeUp}
                  className="spark-gallery-card"
                >
                  {/* Cover Image */}
                  <div
                    className="spark-gallery-cover-wrap"
                    onClick={() =>
                      openLightbox(gallery.images, 0)
                    }
                  >
                    <img
                      src={gallery.images[0]?.url}
                      alt={gallery.title}
                      className="spark-gallery-cover"
                    />

                    {gallery.images.length > 1 && (
                      <div className="spark-gallery-more-count">
                        +{gallery.images.length - 1} more
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="spark-gallery-card-info">
                    <div className="spark-gallery-card-top">
                      <h3 className="spark-gallery-card-title">
                        {gallery.title}
                      </h3>

                      <span className="spark-gallery-chip">
                        {gallery.category}
                      </span>
                    </div>

                    {gallery.eventName && (
                      <p className="spark-gallery-event-name">
                        📌 {gallery.eventName}
                      </p>
                    )}

                    {gallery.eventDate && (
                      <p className="spark-gallery-event-date">
                        📅{" "}
                        {new Date(
                          gallery.eventDate
                        ).toLocaleDateString()}
                      </p>
                    )}

                    {/* Thumbnail Strip */}
                    {gallery.images.length > 1 && (
                      <div className="spark-gallery-thumbs">
                        {gallery.images.slice(0, 4).map((image, index) => (
                          <button
                            key={`${image.url}-${index}`}
                            type="button"
                            className="spark-gallery-thumb-button"
                            onClick={() =>
                              openLightbox(
                                gallery.images,
                                index
                              )
                            }
                            aria-label={`Open image ${index + 1}`}
                          >
                            <img
                              src={image.url}
                              alt=""
                              className="spark-gallery-thumb"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="spark-gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              type="button"
              className="spark-gallery-lightbox-close"
              onClick={(event) => {
                event.stopPropagation();
                closeLightbox();
              }}
              aria-label="Close gallery"
            >
              <FiX size={20} />
            </button>

            {/* Previous / Next */}
            {lightbox.images.length > 1 && (
              <>
                <button
                  type="button"
                  className="spark-gallery-lightbox-prev"
                  onClick={(event) => {
                    event.stopPropagation();
                    prevImage();
                  }}
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  className="spark-gallery-lightbox-next"
                  onClick={(event) => {
                    event.stopPropagation();
                    nextImage();
                  }}
                  aria-label="Next image"
                >
                  <FiChevronRight size={22} />
                </button>
              </>
            )}

            {/* Main Lightbox Image */}
            <motion.img
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={lightbox.images[lightbox.index]?.url}
              alt=""
              className="spark-gallery-lightbox-img"
              onClick={(event) => event.stopPropagation()}
            />

            {/* Counter */}
            {lightbox.images.length > 1 && (
              <div className="spark-gallery-lightbox-index">
                {lightbox.index + 1} / {lightbox.images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
