import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";

import { getCoreTeam, getFaculty } from "../api/api.js";
import Loader from "../components/common/Loader.jsx";
import TeamCard from "../components/Team/TeamCard.jsx";
import TeamModal from "../components/Team/TeamModal.jsx";

import "./Team.css";

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
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const [teamResponse, facultyResponse] = await Promise.all([
          getCoreTeam(),
          getFaculty(),
        ]);

        setTeam(teamResponse?.data || []);
        setFaculty(facultyResponse?.data || []);
      } catch (error) {
        console.error("Failed to fetch team:", error);
        setTeam([]);
        setFaculty([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const handleViewMore = (member, memberType) => {
    setSelectedMember({
      ...member,
      memberType,
    });
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="spark-team-page">
      {/*  HERO  */}

      <section className="spark-team-hero">
        <div className="spark-team-hero-orb" />

        <div className="spark-team-hero-inner">
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
              <span className="spark-team-kicker">
                <FiUsers size={12} />
                Team
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="spark-team-heading"
            >
              Meet the{" "}
              <span className="spark-team-heading-accent">
                Team
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="spark-team-lede"
            >
              The passionate people driving Spark CSE Club
              forward.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/*  TEAM CONTENT  */}

      <section className="spark-team-body">
        <div className="spark-team-inner">
          {/* TABS */}

          <div className="spark-team-tabs">
            <button
              type="button"
              className={`spark-team-tab ${
                tab === "core"
                  ? "spark-team-tab-active"
                  : ""
              }`}
              onClick={() => setTab("core")}
            >
              Core Team
            </button>

            <button
              type="button"
              className={`spark-team-tab ${
                tab === "faculty"
                  ? "spark-team-tab-active"
                  : ""
              }`}
              onClick={() => setTab("faculty")}
            >
              Faculty Advisors
            </button>
          </div>

          {/*  CORE TEAM */}

          {tab === "core" && (
            <>
              {team.length === 0 ? (
                <div className="spark-team-empty">
                  <div className="spark-team-empty-icon">
                    <FiUsers size={30} />
                  </div>

                  <p>No team members yet.</p>
                </div>
              ) : (
                <motion.div
                  className="spark-team-grid"
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
                  {team.map((member) => (
                    <motion.div
                      key={member._id}
                      variants={fadeUp}
                    >
                      <TeamCard
                        member={member}
                        memberType="core"
                        roleLabel={
                          roleLabels[member.role] ||
                          member.role
                        }
                        onViewMore={() =>
                          handleViewMore(
                            member,
                            "core"
                          )
                        }
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}

          {/*   FACULTY ADVISORS  */}

          {tab === "faculty" && (
            <>
              {faculty.length === 0 ? (
                <div className="spark-team-empty">
                  <div className="spark-team-empty-icon">
                    <FiUsers size={30} />
                  </div>

                  <p>No faculty listed yet.</p>
                </div>
              ) : (
                <motion.div
                  className="spark-team-grid"
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
                  {faculty.map((member) => (
                    <motion.div
                      key={member._id}
                      variants={fadeUp}
                    >
                      <TeamCard
                        member={member}
                        memberType="faculty"
                        roleLabel={member.designation}
                        onViewMore={() =>
                          handleViewMore(
                            member,
                            "faculty"
                          )
                        }
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/*   PROFILE MODAL  */}

      {selectedMember && (
        <TeamModal
          member={selectedMember}
          memberType={selectedMember.memberType}
          roleLabel={
            selectedMember.memberType === "core"
              ? roleLabels[selectedMember.role] ||
                selectedMember.role
              : selectedMember.designation
          }
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}