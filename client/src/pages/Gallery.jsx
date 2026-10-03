import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiImage } from "react-icons/fi";

import { getGallery } from "../api/api.js";
import Loader from "../components/common/Loader.jsx";

import GalleryCard from "../components/Gallery/GalleryCard.jsx";
import GalleryModal from "../components/Gallery/GalleryModal.jsx";

import "./Gallery.css";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const categories = [
  "all",
  "event",
  "workshop",
  "hackathon",
  "competition",
  "celebration",
  "other",
];

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedGallery, setSelectedGallery] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await getGallery();
        setGalleries(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        setGalleries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredGalleries =
    filter === "all"
      ? galleries
      : galleries.filter(
          (gallery) => gallery.category === filter
        );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="spark-gallery-page">

      {/* ================================
          HERO
      ================================= */}

      <section className="spark-gallery-hero">
        <div className="spark-gallery-hero-orb" />

        <div className="spark-gallery-hero-inner">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
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
              Memories captured from our events, workshops,
              and celebrations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ================================
          GALLERY CONTENT
      ================================= */}

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

          {filteredGalleries.length === 0 ? (
            <div className="spark-gallery-empty">
              <div className="spark-gallery-empty-icon">
                🖼️
              </div>

              <p>No gallery items found.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="spark-gallery-grid"
            >
              {filteredGalleries.map((gallery) => (
                <motion.div
                  key={gallery._id}
                  variants={fadeUp}
                >
                  <GalleryCard
                    gallery={gallery}
                    onViewDetails={() =>
                      setSelectedGallery(gallery)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ================================
          GALLERY MODAL
      ================================= */}

      {selectedGallery && (
        <GalleryModal
          gallery={selectedGallery}
          onClose={() => setSelectedGallery(null)}
        />
      )}
    </div>
  );
}
