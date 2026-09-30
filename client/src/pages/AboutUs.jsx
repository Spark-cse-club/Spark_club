import { motion } from "framer-motion";
import {
  FiTarget,
  FiUsers,
  FiZap,
  FiBook,
  FiAward,
  FiCode,
} from "react-icons/fi";
import "./AboutUs.css";

const aboutPageFadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const aboutPageValues = [
  {
    icon: <FiCode size={22} />,
    title: "Innovation",
    desc: "We encourage creative problem-solving and cutting-edge development.",
    variant: "innovation",
  },
  {
    icon: <FiUsers size={22} />,
    title: "Collaboration",
    desc: "Working together to build meaningful solutions and lifelong connections.",
    variant: "collaboration",
  },
  {
    icon: <FiBook size={22} />,
    title: "Learning",
    desc: "Continuous growth through workshops, mentoring, and hands-on projects.",
    variant: "learning",
  },
  {
    icon: <FiAward size={22} />,
    title: "Excellence",
    desc: "Striving for the highest standards in everything we create.",
    variant: "excellence",
  },
];

const aboutPageFacts = [
  { label: "Founded", value: "2020" },
  { label: "Members", value: "200+" },
  { label: "Events", value: "50+" },
  { label: "Projects", value: "30+" },
];

export default function AboutUs() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-page-hero">
        <div className="about-page-hero-orb" />

        <div className="about-page-hero-inner">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
          >
            <motion.div variants={aboutPageFadeUp}>
              <span className="about-page-kicker">
                <FiTarget size={13} />
                About Us
              </span>
            </motion.div>

            <motion.h1
              variants={aboutPageFadeUp}
              className="about-page-heading"
            >
              The{" "}
              <span className="about-page-heading-accent">
                Spark
              </span>{" "}
              Story
            </motion.h1>

            <motion.p
              variants={aboutPageFadeUp}
              className="about-page-intro"
            >
              Spark CSE Club was founded by passionate students who believed
              that learning extends beyond the classroom. We are a community
              of coders, builders, and dreamers united by our love for
              technology.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-page-mission">
        <div className="about-page-mission-inner">
          <motion.div
            className="about-page-mission-copy"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="about-page-kicker">
              <FiTarget size={13} />
              Our Mission
            </span>

            <h2 className="about-page-mission-heading">
              Bridging Academia{" "}
              <span className="about-page-heading-accent">
                &amp; Industry
              </span>
            </h2>

            <p>
              We organize events, hackathons, workshops, and project
              exhibitions that give students hands-on experience with real
              technologies. From DSA practice sessions to full-stack app
              builds, Spark is your launchpad.
            </p>

            <p>
              Our alumni network spans top companies and startups — and many
              of them started right here, coding late nights in our club
              meetings.
            </p>
          </motion.div>

          <motion.div
            className="about-page-facts"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {aboutPageFacts.map((fact) => (
              <div
                key={fact.label}
                className="about-page-fact"
              >
                <div className="about-page-fact-value">
                  {fact.value}
                </div>

                <div className="about-page-fact-label">
                  {fact.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="about-page-values">
        <div className="about-page-values-inner">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div
              variants={aboutPageFadeUp}
              className="about-page-values-intro"
            >
              <span className="about-page-kicker">
                <FiZap size={13} />
                Our Values
              </span>

              <h2 className="about-page-values-heading">
                What Drives{" "}
                <span className="about-page-heading-accent">
                  Us
                </span>
              </h2>
            </motion.div>

            <div className="about-page-values-grid">
              {aboutPageValues.map((value) => (
                <motion.div
                  key={value.title}
                  variants={aboutPageFadeUp}
                  className="about-page-value-card"
                >
                  <div
                    className={`about-page-value-icon about-page-value-icon-${value.variant}`}
                  >
                    {value.icon}
                  </div>

                  <div className="about-page-value-content">
                    <h3 className="about-page-value-title">
                      {value.title}
                    </h3>

                    <p className="about-page-value-desc">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}