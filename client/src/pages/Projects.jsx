import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCode, FiGithub, FiCalendar } from "react-icons/fi";
import { getProjects } from "../api/api.js";
import Loader from "../components/Loader.jsx";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const catColors = { software: "badge-purple", hardware: "badge-orange" };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getProjects().then((res) => setProjects(res?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <section style={{ padding: "4rem 0 2rem", background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}>
        <div className="orb orb-2" style={{ opacity: 0.2 }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp}><span className="section-label"><FiCode size={12} /> Projects</span></motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: "1rem" }}>Club <span className="gradient-text">Projects</span></motion.h1>
            <motion.p variants={fadeUp} style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Innovative software and hardware projects built by our talented members.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <div className="filter-tabs">
            {["all", "software", "hardware"].map((f) => (
              <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All Projects" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🔍</div><p>No projects found.</p></div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="grid-3">
              {filtered.map((project) => (
                <motion.div key={project._id} variants={fadeUp} className="card">
                  {project.image?.url ? (
                    <img src={project.image.url} alt={project.projectName}
                      style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "1rem" }} />
                  ) : (
                    <div style={{ width: "100%", height: 180, borderRadius: "var(--radius-md)", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7 }}>
                      <FiCode size={40} color="white" />
                    </div>
                  )}
                  <span className={`badge ${catColors[project.category] || "badge"}`} style={{ marginBottom: "0.75rem" }}>{project.category}</span>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{project.projectName}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {project.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <FiCalendar size={12} /> {new Date(project.startDate).getFullYear()}
                    </span>
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: "0.82rem" }}>
                        <FiGithub size={14} /> GitHub
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}