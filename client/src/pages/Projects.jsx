import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCode, FiGithub, FiCalendar } from "react-icons/fi";
import { getProjects } from "../api/api.js";
import Loader from "../components/Loader.jsx";

import "./Projects.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="spark-projects-page">

      {/* =========================
          HERO
      ========================== */}
      <section className="spark-projects-hero">
        <div className="spark-projects-hero-orb" />

        <div className="spark-projects-hero-inner">
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
              <span className="spark-projects-kicker">
                <FiCode size={13} />
                Projects
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="spark-projects-heading"
            >
              Club{" "}
              <span className="spark-projects-heading-accent">
                Projects
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="spark-projects-lede"
            >
              Innovative software and hardware projects built by
              our talented members.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* =========================
          PROJECTS
      ========================== */}
      <section className="spark-projects-body">
        <div className="spark-projects-inner">

          {/* Filters */}
          <div className="spark-projects-filters">
            {["all", "software", "hardware"].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={`spark-projects-filter ${
                  filter === category
                    ? "spark-projects-filter-active"
                    : ""
                }`}
              >
                {category === "all"
                  ? "All Projects"
                  : category.charAt(0).toUpperCase() +
                    category.slice(1)}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 ? (
            <div className="spark-projects-empty">
              <div className="spark-projects-empty-icon">
                🔍
              </div>

              <p>No projects found.</p>
            </div>
          ) : (
            <motion.div
              className="spark-projects-grid"
              initial="hidden"
              animate="show"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              {filteredProjects.map((project) => (
                <motion.article
                  key={project._id}
                  variants={fadeUp}
                  className="spark-projects-card"
                >
                  {/* Image */}
                  {project.image?.url ? (
                    <img
                      src={project.image.url}
                      alt={project.projectName}
                      className="spark-projects-cover"
                    />
                  ) : (
                    <div className="spark-projects-cover-fallback">
                      <FiCode size={40} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="spark-projects-card-body">

                    <span
                      className={`spark-projects-chip ${
                        project.category === "software"
                          ? "spark-projects-chip-software"
                          : "spark-projects-chip-hardware"
                      }`}
                    >
                      {project.category}
                    </span>

                    <h2 className="spark-projects-card-title">
                      {project.projectName}
                    </h2>

                    <p className="spark-projects-card-desc">
                      {project.description}
                    </p>

                    {/* Footer */}
                    <div className="spark-projects-footer-row">

                      <span className="spark-projects-year">
                        <FiCalendar size={13} />

                        {project.startDate
                          ? new Date(
                              project.startDate
                            ).getFullYear()
                          : "—"}
                      </span>

                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="spark-projects-github"
                        >
                          <FiGithub size={14} />
                          GitHub
                        </a>
                      )}

                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
