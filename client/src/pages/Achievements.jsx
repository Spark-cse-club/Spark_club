import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiAward,
  FiCalendar,
  FiExternalLink,
  FiUser,
} from "react-icons/fi";
import { getAchievements } from "../api/api.js";
import Loader from "../components/Loader.jsx";
import "./Achievements.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAchievements()
      .then((res) => setAchievements(res?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "all",
    "placement",
    "competition",
    "hackathon",
    "exam",
    "internship",
    "certification",
    "award",
    "other",
  ];

  const filtered =
    filter === "all"
      ? achievements
      : achievements.filter((achievement) => achievement.category === filter);

  const formatCategory = (category) =>
    category === "all"
      ? "All"
      : category
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="spark-achievements-page">
      {/* Hero */}
      <section className="spark-achievements-hero">
        <div className="spark-achievements-hero-orb" />

        <div className="spark-achievements-hero-inner">
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
              <span className="spark-achievements-kicker">
                <FiAward size={13} />
                Achievements
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="spark-achievements-heading"
            >
              Our{" "}
              <span className="spark-achievements-heading-accent">
                Achievements
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="spark-achievements-lede"
            >
              Celebrating the milestones and victories of our talented
              members.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="spark-achievements-body">
        <div className="spark-achievements-inner">
          {/* Filters */}
          <div className="spark-achievements-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`spark-achievements-filter ${
                  filter === category
                    ? "spark-achievements-filter-active"
                    : ""
                }`}
                onClick={() => setFilter(category)}
              >
                {formatCategory(category)}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 ? (
            <div className="spark-achievements-empty">
              <div className="spark-achievements-empty-icon">
                <FiAward size={30} />
              </div>

              <p>No achievements found.</p>
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
              className="spark-achievements-grid"
            >
              {filtered.map((achievement) => {
                const imageCount = achievement.images?.length || 0;

                return (
                  <motion.article
                    key={achievement._id}
                    variants={fadeUp}
                    className="spark-achievements-card"
                  >
                    {/* Images */}
                    {imageCount > 0 && (
                      <div
                        className={`spark-achievements-photos ${
                          imageCount === 1
                            ? "spark-achievements-photos-one"
                            : "spark-achievements-photos-two"
                        }`}
                      >
                        {achievement.images
                          .slice(0, imageCount === 3 ? 3 : 4)
                          .map((image, index) => (
                            <img
                              key={index}
                              src={image.url}
                              alt=""
                              className={`spark-achievements-photo ${
                                imageCount === 1
                                  ? "spark-achievements-photo-tall"
                                  : ""
                              } ${
                                imageCount === 3 && index === 0
                                  ? "spark-achievements-photo-span"
                                  : ""
                              }`}
                            />
                          ))}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="spark-achievements-meta">
                      <span className="spark-achievements-chip">
                        {formatCategory(achievement.category)}
                      </span>

                      {achievement.rank && (
                        <span className="spark-achievements-chip spark-achievements-chip-rank">
                          🏅 {achievement.rank}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="spark-achievements-card-title">
                      {achievement.title}
                    </h3>

                    <p className="spark-achievements-card-desc">
                      {achievement.description}
                    </p>

                    {/* Facts */}
                    <div className="spark-achievements-facts">
                      {achievement.personName && (
                        <span className="spark-achievements-fact">
                          <FiUser size={13} />
                          {achievement.personName}
                        </span>
                      )}

                      {achievement.teamName && (
                        <span className="spark-achievements-fact">
                          <span aria-hidden="true">👥</span>
                          {achievement.teamName}
                        </span>
                      )}

                      {achievement.organization && (
                        <span className="spark-achievements-fact">
                          <span aria-hidden="true">🏢</span>
                          {achievement.organization}
                        </span>
                      )}

                      <span className="spark-achievements-fact">
                        <FiCalendar size={13} />
                        {new Date(
                          achievement.achievementDate
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    {/* External Link */}
                    {achievement.link && (
                      <a
                        href={achievement.link}
                        target="_blank"
                        rel="noreferrer"
                        className="spark-achievements-link"
                      >
                        View more
                        <FiExternalLink size={13} />
                      </a>
                    )}
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