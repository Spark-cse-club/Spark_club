import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiGithub, FiLinkedin, FiExternalLink } from "react-icons/fi";
import { getCoreTeam, getFaculty } from "../api/api.js";
import Loader from "../components/Loader.jsx";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const roleLabels = {
  president: "President", vice_president: "Vice President", secretary: "Secretary",
  technical_head: "Technical Head", event_head: "Event Head", web_head: "Web Head",
  app_head: "App Head", dsa_aptitude_head: "DSA & Aptitude Head", media_head: "Media Head", sports_head: "Sports Head",
};

const roleColors = {
  president: "#6366f1", vice_president: "#8b5cf6", secretary: "#22c55e",
  technical_head: "#06b6d4", event_head: "#f97316", web_head: "#ec4899",
  app_head: "#14b8a6", dsa_aptitude_head: "#f59e0b", media_head: "#a855f7", sports_head: "#ef4444",
};

export default function Team() {
  const [team, setTeam] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("core");

  useEffect(() => {
    Promise.all([getCoreTeam(), getFaculty()])
      .then(([t, f]) => { setTeam(t?.data || []); setFaculty(f?.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <section style={{ padding: "4rem 0 2rem", background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}>
        <div className="orb orb-1" style={{ opacity: 0.2 }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp}><span className="section-label"><FiUsers size={12} /> Team</span></motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: "1rem" }}>Meet the <span className="gradient-text">Team</span></motion.h1>
            <motion.p variants={fadeUp} style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              The passionate people driving Spark CSE Club forward.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          {/* Tab selector */}
          <div className="filter-tabs" style={{ marginBottom: "2.5rem" }}>
            <button className={`filter-tab${tab === "core" ? " active" : ""}`} onClick={() => setTab("core")}>
              Core Team
            </button>
            <button className={`filter-tab${tab === "faculty" ? " active" : ""}`} onClick={() => setTab("faculty")}>
              Faculty Advisors
            </button>
          </div>

          {tab === "core" && (
            team.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">👥</div><p>No team members yet.</p></div>
            ) : (
              <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="grid-3">
                {team.map((member) => {
                  const roleColor = roleColors[member.role] || "#6366f1";
                  return (
                    <motion.div key={member._id} variants={fadeUp} className="card" style={{ textAlign: "center", overflow: "hidden" }}>
                      <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
                        <img src={member.image?.url} alt={member.name}
                          style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: `3px solid ${roleColor}` }} />
                      </div>
                      <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{member.name}</h3>
                      <span className="badge" style={{ background: `${roleColor}18`, color: roleColor, marginBottom: "0.75rem" }}>
                        {roleLabels[member.role] || member.role}
                      </span>
                      {member.department && (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{member.department} • {member.year}</p>
                      )}
                      {member.bio && (
                        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1rem", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {member.bio}
                        </p>
                      )}
                      {member.skills?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", justifyContent: "center", marginBottom: "1rem" }}>
                          {member.skills.slice(0, 4).map((skill) => (
                            <span key={skill} style={{ fontSize: "0.72rem", padding: "0.15rem 0.5rem", background: "var(--accent-bg)", color: "var(--accent)", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem" }}>
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)", transition: "var(--transition)" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
                            <FiGithub size={18} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)", transition: "var(--transition)" }} onMouseEnter={e => e.currentTarget.style.color = "#0a66c2"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
                            <FiLinkedin size={18} />
                          </a>
                        )}
                        {member.portfolio && (
                          <a href={member.portfolio} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)", transition: "var(--transition)" }} onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>
                            <FiExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )
          )}

          {tab === "faculty" && (
            faculty.length === 0 ? (
              <div className="empty-state"><div className="empty-state-icon">👨‍🏫</div><p>No faculty listed yet.</p></div>
            ) : (
              <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="grid-3">
                {faculty.map((f) => (
                  <motion.div key={f._id} variants={fadeUp} className="card" style={{ textAlign: "center" }}>
                    <img src={f.image?.url} alt={f.name}
                      style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--accent)", marginBottom: "1rem" }} />
                    <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{f.name}</h3>
                    <p style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>{f.designation}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>{f.department}</p>
                    {f.bio && <p style={{ fontSize: "0.82rem", marginBottom: "1rem", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{f.bio}</p>}
                    {f.linkedin && (
                      <a href={f.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--text-muted)" }}>
                        <FiLinkedin size={18} />
                      </a>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </div>
      </section>
    </div>
  );
}