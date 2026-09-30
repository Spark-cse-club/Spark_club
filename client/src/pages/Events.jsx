import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiExternalLink,
} from "react-icons/fi";
import { getEvents } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import "./Events.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getEvents()
      .then((res) => setEvents(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filters = ["all", "dsa", "aptitude", "other"];

  const filtered =
    filter === "all"
      ? events
      : events.filter((event) => event.category === filter);

  if (loading) return <Loader />;

  return (
    <div className="spark-events-page">
      {/* Hero */}
      <section className="spark-events-hero">
        <div className="spark-events-hero-orb" />

        <div className="spark-events-hero-inner">
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
              <span className="spark-events-kicker">
                <FiCalendar size={12} />
                Events
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="spark-events-heading"
            >
              Club{" "}
              <span className="spark-events-heading-accent">
                Events
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="spark-events-lede"
            >
              Workshops, hackathons, and coding competitions designed
              to push your limits.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Events Content */}
      <section className="spark-events-body">
        <div className="spark-events-inner">
          {/* Filters */}
          <div className="spark-events-filters">
            {filters.map((category) => (
              <button
                key={category}
                type="button"
                className={`spark-events-filter ${
                  filter === category
                    ? "spark-events-filter-active"
                    : ""
                }`}
                onClick={() => setFilter(category)}
              >
                {category === "all"
                  ? "All Events"
                  : category.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 ? (
            <div className="spark-events-empty">
              <div className="spark-events-empty-icon">📭</div>
              <p>No events found.</p>
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
              className="spark-events-grid"
            >
              {filtered.map((event) => {
                const isPast =
                  new Date(event.endDate) < new Date();

                return (
                  <motion.article
                    key={event._id}
                    variants={fadeUp}
                    className="spark-events-card"
                  >
                    {/* Poster */}
                    {event.poster?.url ? (
                      <img
                        src={event.poster.url}
                        alt={event.title}
                        className="spark-events-poster"
                      />
                    ) : (
                      <div className="spark-events-poster-fallback">
                        <FiCalendar size={40} />
                      </div>
                    )}

                    <div className="spark-events-card-body">
                      {/* Category + Status */}
                      <div className="spark-events-meta">
                        <span className="spark-events-chip">
                          {event.category}
                        </span>

                        {isPast && (
                          <span className="spark-events-chip spark-events-chip-past">
                            Past
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="spark-events-card-title">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="spark-events-card-desc">
                        {event.description}
                      </p>

                      {/* Details */}
                      <div className="spark-events-details">
                        <span className="spark-events-detail-row">
                          <FiCalendar size={13} />
                          <span>
                            {new Date(
                              event.startDate
                            ).toLocaleDateString()}{" "}
                            —{" "}
                            {new Date(
                              event.endDate
                            ).toLocaleDateString()}
                          </span>
                        </span>

                        <span className="spark-events-detail-row">
                          <FiMapPin size={13} />
                          <span>{event.venue}</span>
                        </span>
                      </div>

                      {/* Registration */}
                      {event.registrationLink && !isPast && (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noreferrer"
                          className="spark-events-register"
                        >
                          Register
                          <FiExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}



