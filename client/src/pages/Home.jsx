import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiCalendar,
  FiCode,
  FiAward,
  FiUsers,
  FiZap,
  FiStar,
} from "react-icons/fi";

import sparkLogo from "../assets/spark-logo.png";

import {
  getStats,
  getEvents,
  getProjects,
} from "../api/api.js";

import EventCard from "../components/Events/EventCard.jsx";
import ProjectCard from "../components/Project/ProjectCard.jsx";

import "./Home.css";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const getEventStatus = (event) => {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "completed";
};

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 50);

    if (target === 0) {
      setCount(0);
      return;
    }

    const timer = setInterval(() => {
      start += step;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}

export default function Home() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    events: [],
    projects: [],
  });

  const [statsData, setStatsData] = useState({
    events: 0,
    projects: 0,
    achievements: 0,
    team: 0,
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      getStats(),
      getEvents(),
      getProjects(),
    ])
      .then(([stats, events, projects]) => {
        setStatsData(stats?.data || {});

        setData({
          events: events?.data || [],
          projects: projects?.data || [],
        });

        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  const stats = [
    {
      label: "Events Hosted",
      value: statsData.events,
      icon: <FiCalendar />,
    },
    {
      label: "Projects Built",
      value: statsData.projects,
      icon: <FiCode />,
    },
    {
      label: "Achievements",
      value: statsData.achievements,
      icon: <FiAward />,
    },
    {
      label: "Team Members",
      value: statsData.team,
      icon: <FiUsers />,
    },
  ];

  return (
    <div className="spark-home-page">

      <section className="spark-home-hero">
        <div className="spark-home-hero-orb spark-home-hero-orb-one" />
        <div className="spark-home-hero-orb spark-home-hero-orb-two" />
        <div className="spark-home-hero-orb spark-home-hero-orb-three" />

        <div className="spark-home-hero-inner">
          <div className="spark-home-hero-content">
             {/* LEFT — CONTENT */}

            <motion.div
              className="spark-home-hero-copy"
              initial="hidden"
              animate="show"
              variants={stagger}
            >

              <motion.div variants={fadeUp}>
                <span className="spark-home-label spark-home-hero-label">
                  <FiZap size={13} />
                  Welcome to <strong>SPARK</strong> CSE Club
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="spark-home-hero-title"
              >
                Where Code Meets{" "}
                <span className="spark-home-gradient">
                  Innovation
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="spark-home-hero-description"
              >
                Building real-world skills, fostering collaboration,
                and creating opportunities for CSE students to learn,
                build, and grow.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="spark-home-hero-actions"
              >
                <Link
                  to="/events"
                  className="spark-home-button spark-home-button-primary"
                >
                  Explore Events
                  <FiArrowRight />
                </Link>

                <Link
                  to="/about"
                  className="spark-home-button spark-home-button-secondary"
                >
                  About Spark
                </Link>
              </motion.div>

            </motion.div>

            {/* RIGHT — SPARK LOGO */}

            <motion.div
              className="spark-home-hero-logo"
              initial={{
                opacity: 0,
                x: 40,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.25,
                ease: "easeOut",
              }}
            >

              {/* Glow */}

              <motion.div
                className="spark-home-hero-logo-glow"
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.35, 0.55, 0.35],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Logo Card */}

              <motion.div
                className="spark-home-hero-logo-card"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={sparkLogo}
                  alt="Spark CSE Club"
                  className="spark-home-hero-logo-image"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* =========================
          STATS
      ========================== */}

      <section className="spark-home-stats">
        <div className="spark-home-container">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="spark-home-stats-grid"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="spark-home-stat-card"
              >
                <div className="spark-home-stat-icon">
                  {stat.icon}
                </div>

                <div>
                  <div className="spark-home-stat-value">
                    {loaded ? (
                      <AnimatedCounter
                        target={stat.value}
                      />
                    ) : (
                      stat.value
                    )}
                    +
                  </div>

                  <div className="spark-home-stat-label">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================
          EVENTS
      ========================== */}

      {data.events.slice(0, 3).length > 0 && (
        <section className="spark-home-events">
          <div className="spark-home-container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                className="spark-home-section-header"
              >
                <span className="spark-home-label">
                  <FiCalendar size={12} />
                  Events
                </span>

                <h2 className="spark-home-section-title">
                  Upcoming{" "}
                  <span className="spark-home-gradient">
                    Events
                  </span>
                </h2>

                <p className="spark-home-section-description">
                  Join our workshops, hackathons, and coding
                  competitions.
                </p>
              </motion.div>

              <motion.div
                variants={stagger}
                className="spark-home-content-grid"
              >
                {data.events.slice(0, 3).map((event) => (
                  <motion.div
                    key={event._id}
                    variants={fadeUp}
                  >
                    <EventCard
                      event={event}
                      status={getEventStatus(event)}
                      onViewDetails={() =>
                        navigate("/events")
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="spark-home-view-all"
              >
                <Link
                  to="/events"
                  className="spark-home-button spark-home-button-secondary"
                >
                  View All Events
                  <FiArrowRight />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* =========================
          PROJECTS
      ========================== */}

      {data.projects.slice(0, 3).length > 0 && (
        <section className="spark-home-projects">
          <div className="spark-home-container">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div
                variants={fadeUp}
                className="spark-home-section-header"
              >
                <span className="spark-home-label">
                  <FiCode size={12} />
                  Projects
                </span>

                <h2 className="spark-home-section-title">
                  Our{" "}
                  <span className="spark-home-gradient">
                    Projects
                  </span>
                </h2>

                <p className="spark-home-section-description">
                  Real-world software and hardware solutions
                  built by our members.
                </p>
              </motion.div>

              <motion.div
                variants={stagger}
                className="spark-home-content-grid"
              >
                {data.projects.slice(0, 3).map((project) => (
                  <motion.div
                    key={project._id}
                    variants={fadeUp}
                  >
                    <ProjectCard
                      project={project}
                      onViewDetails={() =>
                        navigate("/projects")
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="spark-home-view-all"
              >
                <Link
                  to="/projects"
                  className="spark-home-button spark-home-button-secondary"
                >
                  View All Projects
                  <FiArrowRight />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* =========================
          CTA
      ========================== */}

      <section className="spark-home-cta">
        <div className="spark-home-container">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true }}
            className="spark-home-cta-card"
          >
            <div className="spark-home-cta-shape-one" />
            <div className="spark-home-cta-shape-two" />

            <div className="spark-home-cta-content">
              <FiStar
                size={32}
                className="spark-home-cta-icon"
              />

              <h2 className="spark-home-cta-title">
                Ready to Join Spark?
              </h2>

              <p className="spark-home-cta-description">
                Connect with like-minded developers,
                participate in events, and grow your tech
                career.
              </p>

              <Link
                to="/contact"
                className="spark-home-cta-button"
              >
                Get in Touch
                <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
