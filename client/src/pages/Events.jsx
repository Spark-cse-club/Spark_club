import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin, FiExternalLink } from "react-icons/fi";
import { getEvents } from "../api/api.js";
import Loader from "../components/Loader.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const catColors = {
  dsa: "badge-purple",
  aptitude: "badge-blue",
  other: "badge-cyan",
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
  const filtered = filter === "all" ? events : events.filter((e) => e.category === filter);

  if (loading) return <Loader />;

  return (
    <div>
      {/* Header */}
      <section style={{ padding: "4rem 0 2rem", background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}>
        <div className="orb orb-1" style={{ opacity: 0.2 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} style={{ textAlign: "center" }}>
            <motion.div variants={fadeUp}>
              <span className="section-label"><FiCalendar size={12} /> Events</span>
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: "1rem" }}>
              Club <span className="gradient-text">Events</span>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto" }}>
              Workshops, hackathons, and coding competitions designed to push your limits.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          {/* Filter */}
          <div className="filter-tabs">
            {filters.map((f) => (
              <button
                key={f}
                className={`filter-tab${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All Events" : f.toUpperCase()}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>No events found.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden" animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              className="grid-3"
            >
              {filtered.map((event) => {
                const isPast = new Date(event.endDate) < new Date();
                return (
                  <motion.div key={event._id} variants={fadeUp} className="card" style={{ position: "relative", overflow: "hidden" }}>
                    {event.poster?.url ? (
                      <img src={event.poster.url} alt={event.title}
                        style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
                    ) : (
                      <div style={{ width: "100%", height: 180, borderRadius: "var(--radius-md)", background: "var(--gradient-primary)", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
                        <FiCalendar size={40} color="white" />
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span className={`badge ${catColors[event.category] || "badge"}`}>{event.category}</span>
                      {isPast && <span className="badge" style={{ background: "rgba(100,100,100,0.15)", color: "var(--text-muted)" }}>Past</span>}
                    </div>

                    <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{event.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {event.description}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <FiCalendar size={13} />
                        {new Date(event.startDate).toLocaleDateString()} — {new Date(event.endDate).toLocaleDateString()}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <FiMapPin size={13} /> {event.venue}
                      </span>
                    </div>

                    {event.registrationLink && !isPast && (
                      <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}>
                        Register <FiExternalLink size={13} />
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}