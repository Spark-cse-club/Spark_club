import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCode } from "react-icons/fi";

import { getProjects } from "../api/api.js";
import Loader from "../components/common/Loader.jsx";
import ProjectCard from "../components/Project/ProjectCard.jsx";
import ProjectModal from "../components/Project/ProjectModal.jsx";

import "./Projects.css";

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

const categories = ["all", "software", "hardware"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();

        setProjects(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter(
          (project) => project.category === filter
        );

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="spark-projects-page">
      {/* HERO */}
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

      {/* PROJECTS */}
      <section className="spark-projects-body">
        <div className="spark-projects-inner">
          {/* FILTERS */}
          <div className="spark-projects-filters">
            {categories.map((category) => (
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

          {/* EMPTY STATE */}
          {filteredProjects.length === 0 ? (
            <div className="spark-projects-empty">
              <div className="spark-projects-empty-icon">
                <FiCode size={30} />
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
                <motion.div
                  key={project._id}
                  variants={fadeUp}
                >
                  <ProjectCard
                    project={project}
                    onViewDetails={() =>
                      setSelectedProject(project)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
}