import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiGithub,
  FiLinkedin,
  FiExternalLink,
} from "react-icons/fi";
import { getCoreTeam, getFaculty } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import "./Team.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const roleLabels = {
  president: "President",
  vice_president: "Vice President",
  secretary: "Secretary",
  technical_head: "Technical Head",
  event_head: "Event Head",
  web_head: "Web Head",
  app_head: "App Head",
  dsa_aptitude_head: "DSA & Aptitude Head",
  media_head: "Media Head",
  sports_head: "Sports Head",
};

export default function Team() {
  const [team, setTeam] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("core");

  useEffect(() => {
    Promise.all([getCoreTeam(), getFaculty()])
      .then(([t, f]) => {
        setTeam(t?.data || []);
        setFaculty(f?.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="spark-team-page">
      {/* Hero */}
      <section className="spark-team-hero">
        <div className="spark-team-hero-orb" />

        <div className="spark-team-hero-inner">
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
              <span className="spark-team-kicker">
                <FiUsers size={12} />
                Team
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="spark-team-heading">
              Meet the{" "}
              <span className="spark-team-heading-accent">Team</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="spark-team-lede">
              The passionate people driving Spark CSE Club forward.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Content */}
      <section className="spark-team-body">
        <div className="spark-team-inner">
          {/* Tabs */}
          <div className="spark-team-tabs">
            <button
              type="button"
              className={`spark-team-tab ${
                tab === "core" ? "spark-team-tab-active" : ""
              }`}
              onClick={() => setTab("core")}
            >
              Core Team
            </button>

            <button
              type="button"
              className={`spark-team-tab ${
                tab === "faculty" ? "spark-team-tab-active" : ""
              }`}
              onClick={() => setTab("faculty")}
            >
              Faculty Advisors
            </button>
          </div>

          {/* Core Team */}
          {tab === "core" &&
            (team.length === 0 ? (
              <div className="spark-team-empty">
                <div className="spark-team-empty-icon">👥</div>
                <p>No team members yet.</p>
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
                className="spark-team-grid"
              >
                {team.map((member) => (
                  <motion.article
                    key={member._id}
                    variants={fadeUp}
                    className="spark-team-card"
                  >
                    <div className="spark-team-avatar-wrap">
                      {member.image?.url ? (
                        <img
                          src={member.image.url}
                          alt={member.name}
                          className="spark-team-avatar"
                        />
                      ) : (
                        <div className="spark-team-avatar spark-team-avatar-fallback">
                          <FiUsers size={30} />
                        </div>
                      )}
                    </div>

                    <h3 className="spark-team-name">{member.name}</h3>

                    <span className="spark-team-role">
                      {roleLabels[member.role] || member.role}
                    </span>

                    {member.department && (
                      <p className="spark-team-dept">
                        {member.department}
                        {member.year && ` • ${member.year}`}
                      </p>
                    )}

                    {member.bio && (
                      <p className="spark-team-bio">{member.bio}</p>
                    )}

                    {member.skills?.length > 0 && (
                      <div className="spark-team-skills">
                        {member.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="spark-team-skill">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="spark-team-links">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noreferrer"
                          className="spark-team-social"
                          aria-label={`${member.name} GitHub`}
                        >
                          <FiGithub size={18} />
                        </a>
                      )}

                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="spark-team-social"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <FiLinkedin size={18} />
                        </a>
                      )}

                      {member.portfolio && (
                        <a
                          href={member.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="spark-team-social"
                          aria-label={`${member.name} Portfolio`}
                        >
                          <FiExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ))}

          {/* Faculty */}
          {tab === "faculty" &&
            (faculty.length === 0 ? (
              <div className="spark-team-empty">
                <div className="spark-team-empty-icon">👨‍🏫</div>
                <p>No faculty listed yet.</p>
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
                className="spark-team-grid"
              >
                {faculty.map((member) => (
                  <motion.article
                    key={member._id}
                    variants={fadeUp}
                    className="spark-team-card spark-team-faculty-card"
                  >
                    <div className="spark-team-avatar-wrap">
                      {member.image?.url ? (
                        <img
                          src={member.image.url}
                          alt={member.name}
                          className="spark-team-avatar"
                        />
                      ) : (
                        <div className="spark-team-avatar spark-team-avatar-fallback">
                          <FiUsers size={30} />
                        </div>
                      )}
                    </div>

                    <h3 className="spark-team-name">{member.name}</h3>

                    <p className="spark-team-designation">
                      {member.designation}
                    </p>

                    <p className="spark-team-dept">
                      {member.department}
                    </p>

                    {member.bio && (
                      <p className="spark-team-bio">{member.bio}</p>
                    )}

                    {member.linkedin && (
                      <div className="spark-team-links">
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="spark-team-social"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <FiLinkedin size={18} />
                        </a>
                      </div>
                    )}
                  </motion.article>
                ))}
              </motion.div>
            ))}
        </div>
      </section>
    </div>
  );
}