import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar, FiCode, FiAward, FiUsers, FiZap, FiStar } from "react-icons/fi";
import { getEvents, getProjects, getAchievements, getCoreTeam } from "../api/api.js";
import "./Home.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

export default function Home() {
  const [data, setData] = useState({ events: [], projects: [], achievements: [], team: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getEvents(), getProjects(), getAchievements(), getCoreTeam()])
      .then(([e, p, a, t]) => {
        setData({
          events: e?.data || [],
          projects: p?.data || [],
          achievements: a?.data || [],
          team: t?.data || [],
        });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const stats = [
    { label: "Events Hosted", value: data.events.length || 20, icon: <FiCalendar />, color: "#6366f1" },
    { label: "Projects Built", value: data.projects.length || 15, icon: <FiCode />, color: "#8b5cf6" },
    { label: "Achievements", value: data.achievements.length || 30, icon: <FiAward />, color: "#06b6d4" },
    { label: "Team Members", value: data.team.length || 12, icon: <FiUsers />, color: "#22c55e" },
  ];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="home-hero-section">
        <div className="home-orb home-orb-1" />
        <div className="home-orb home-orb-2" />
        <div className="home-orb home-orb-3" />

        <div className="home-hero-container">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span className="home-section-label">
                <FiZap size={12} /> Welcome to Spark CSE Club
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="home-hero-title">
              Where Code Meets{" "}
              <span className="home-gradient-text">Innovation</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="home-hero-description">
              Spark is the premier CSE departmental club — building real-world skills, fostering collaboration, and celebrating technical excellence.
            </motion.p>

            <motion.div variants={fadeUp} className="home-hero-buttons">
              <Link to="/events" className="home-btn home-btn-primary">
                Explore Events <FiArrowRight />
              </Link>
              <Link to="/about" className="home-btn home-btn-secondary">
                About Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="home-stats-section">
        <div className="home-container">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="home-stats-grid"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="home-stat-card">
                <div className="home-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div className="home-stat-value">
                    {loaded ? <AnimatedCounter target={s.value} /> : s.value}+
                  </div>
                  <div className="home-stat-label">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Recent Events ────────────────────────────────── */}
      {data.events.slice(0, 3).length > 0 && (
        <section className="home-events-section">
          <div className="home-container">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="home-section-header">
                <span className="home-section-label"><FiCalendar size={12} /> Events</span>
                <h2 className="home-section-title">Upcoming <span className="home-gradient-text">Events</span></h2>
                <p className="home-section-description">Join our workshops, hackathons, and coding competitions.</p>
              </motion.div>

              <motion.div variants={stagger} className="home-grid-3">
                {data.events.slice(0, 3).map((event) => (
                  <motion.div key={event._id} variants={fadeUp} className="home-card">
                    {event.poster?.url && (
                      <img src={event.poster.url} alt={event.title} className="home-card-image" />
                    )}
                    <span className="home-badge">{event.category}</span>
                    <h3 className="home-card-title">{event.title}</h3>
                    <p className="home-card-date">
                      📅 {new Date(event.startDate).toLocaleDateString()}
                    </p>
                    <p className="home-card-location">📍 {event.venue}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="home-view-all-container">
                <Link to="/events" className="home-btn home-btn-secondary">View All Events <FiArrowRight /></Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Projects Preview ──────────────────────────────── */}
      {data.projects.slice(0, 3).length > 0 && (
        <section className="home-projects-section">
          <div className="home-container">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="home-section-header">
                <span className="home-section-label"><FiCode size={12} /> Projects</span>
                <h2 className="home-section-title">Our <span className="home-gradient-text">Projects</span></h2>
                <p className="home-section-description">Real-world software and hardware solutions built by our members.</p>
              </motion.div>
              <motion.div variants={stagger} className="home-grid-3">
                {data.projects.slice(0, 3).map((project) => (
                  <motion.div key={project._id} variants={fadeUp} className="home-card">
                    {project.image?.url && (
                      <img src={project.image.url} alt={project.projectName} className="home-project-image" />
                    )}
                    <span className="home-badge home-badge-blue">{project.category}</span>
                    <h3 className="home-card-title">{project.projectName}</h3>
                    <p className="home-project-desc">
                      {project.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="home-view-all-container">
                <Link to="/projects" className="home-btn home-btn-secondary">View All Projects <FiArrowRight /></Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="home-cta-section">
        <div className="home-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="home-cta-card"
          >
            <div className="home-cta-bg-shape-1" />
            <div className="home-cta-bg-shape-2" />
            <div className="home-cta-content">
              <FiStar size={32} color="rgba(255,255,255,0.8)" style={{ marginBottom: "1rem" }} />
              <h2 className="home-cta-title">Ready to Join Spark?</h2>
              <p className="home-cta-desc">
                Connect with like-minded developers, participate in events, and grow your tech career.
              </p>
              <Link to="/contact" className="home-cta-btn">
                Get in Touch <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}