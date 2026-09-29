import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiAward, FiCalendar, FiExternalLink, FiUser } from "react-icons/fi";
import { getAchievements } from "../api/api.js";
import Loader from "../components/Loader.jsx";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const catColors = {
  placement: "badge-green", competition: "badge-blue", hackathon: "badge-orange",
  exam: "badge-purple", open_source: "badge-cyan", research: "badge-blue",
  certification: "badge-green", internship: "badge-orange", award: "badge-red", other: "badge",
};

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAchievements().then((res) => setAchievements(res?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ["all", "placement", "competition", "hackathon", "exam", "internship", "certification", "award", "other"];
  const filtered = filter === "all" ? achievements : achievements.filter((a) => a.category === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <section style={{ padding: "4rem 0 2rem", background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}>
        <div className="orb orb-2" style={{ opacity: 0.2 }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp}><span className="section-label"><FiAward size={12} /> Achievements</span></motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: "1rem" }}>Our <span className="gradient-text">Achievements</span></motion.h1>
            <motion.p variants={fadeUp} style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Celebrating the milestones and victories of our talented members.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <div className="filter-tabs" style={{ flexWrap: "wrap" }}>
            {categories.map((f) => (
              <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1).replace("_", " ")}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🏆</div><p>No achievements found.</p></div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="grid-3">
              {filtered.map((ach) => (
                <motion.div key={ach._id} variants={fadeUp} className="card">
                  {/* Images */}
                  {ach.images?.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: ach.images.length === 1 ? "1fr" : "1fr 1fr", gap: "0.4rem", marginBottom: "1rem" }}>
                      {ach.images.slice(0, ach.images.length === 3 ? 3 : 4).map((img, i) => (
                        <img key={i} src={img.url} alt=""
                          style={{
                            width: "100%",
                            height: ach.images.length === 1 ? 180 : 100,
                            objectFit: "cover",
                            borderRadius: "var(--radius-sm)",
                            gridColumn: ach.images.length === 3 && i === 0 ? "1 / -1" : "",
                          }} />
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    <span className={`badge ${catColors[ach.category] || "badge"}`}>{ach.category.replace("_", " ")}</span>
                    {ach.rank && <span className="badge badge-orange">🏅 {ach.rank}</span>}
                  </div>

                  <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{ach.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {ach.description}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {ach.personName && <span><FiUser size={12} style={{ marginRight: 4 }} />{ach.personName}</span>}
                    {ach.teamName && <span>👥 {ach.teamName}</span>}
                    {ach.organization && <span>🏢 {ach.organization}</span>}
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <FiCalendar size={12} /> {new Date(ach.achievementDate).toLocaleDateString()}
                    </span>
                  </div>

                  {ach.link && (
                    <a href={ach.link} target="_blank" rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "0.75rem", color: "var(--accent)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
                      View more <FiExternalLink size={13} />
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}