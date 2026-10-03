import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";

import { getAchievements } from "../api/api.js";
import Loader from "../components/common/Loader.jsx";
import AchievementCard from "../components/Achievement/AchievementCard.jsx";
import AchievementModal from "../components/Achievement/AchievementModal.jsx";

import "./Achievements.css";

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

const formatCategory = (category) =>
  category === "all"
    ? "All"
    : category
        .split("_")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedAchievement, setSelectedAchievement] =
    useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await getAchievements();

        setAchievements(response?.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch achievements:",
          error
        );

        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const filteredAchievements =
    filter === "all"
      ? achievements
      : achievements.filter(
          (achievement) =>
            achievement.category === filter
        );

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
                transition: {
                  staggerChildren: 0.1,
                },
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
              Celebrating the milestones and victories of our
              talented members.
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
          {filteredAchievements.length === 0 ? (
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
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
              className="spark-achievements-grid"
            >
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement._id}
                  variants={fadeUp}
                >
                  <AchievementCard
                    achievement={achievement}
                    onViewDetails={() =>
                      setSelectedAchievement(achievement)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Details Modal */}
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
}