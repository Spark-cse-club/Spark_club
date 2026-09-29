import { motion } from "framer-motion";
import { FiTarget, FiUsers, FiZap, FiBook, FiAward, FiCode } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const values = [
  { icon: <FiCode size={22} />, title: "Innovation", desc: "We encourage creative problem-solving and cutting-edge development.", color: "#6366f1" },
  { icon: <FiUsers size={22} />, title: "Collaboration", desc: "Working together to build meaningful solutions and lifelong connections.", color: "#8b5cf6" },
  { icon: <FiBook size={22} />, title: "Learning", desc: "Continuous growth through workshops, mentoring, and hands-on projects.", color: "#06b6d4" },
  { icon: <FiAward size={22} />, title: "Excellence", desc: "Striving for the highest standards in everything we create.", color: "#22c55e" },
];

export default function AboutUs() {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "5rem 0 3rem", position: "relative", overflow: "hidden", background: "var(--bg-primary)" }}>
        <div className="orb orb-1" style={{ opacity: 0.3 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <motion.div variants={fadeUp}>
              <span className="section-label"><FiTarget size={12} /> About Us</span>
            </motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: "1.25rem" }}>
              The <span className="gradient-text">Spark</span> Story
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: "1.1rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Spark CSE Club was founded by passionate students who believed that learning extends beyond the classroom. We are a community of coders, builders, and dreamers united by our love for technology.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="section-label"><FiTarget size={12} /> Our Mission</span>
              <h2 style={{ margin: "1rem 0" }}>Bridging Academia <span className="gradient-text">& Industry</span></h2>
              <p style={{ lineHeight: 1.8, marginBottom: "1.25rem" }}>
                We organize events, hackathons, workshops, and project exhibitions that give students hands-on experience with real technologies. From DSA practice sessions to full-stack app builds, Spark is your launchpad.
              </p>
              <p style={{ lineHeight: 1.8 }}>
                Our alumni network spans top companies and startups — and many of them started right here, coding late nights in our club meetings.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "Founded", value: "2020" },
                  { label: "Members", value: "200+" },
                  { label: "Events", value: "50+" },
                  { label: "Projects", value: "30+" },
                ].map((s) => (
                  <div key={s.label} className="card" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800, background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} className="section-header">
              <span className="section-label"><FiZap size={12} /> Our Values</span>
              <h2 className="section-title">What Drives <span className="gradient-text">Us</span></h2>
            </motion.div>
            <div className="grid-2" style={{ gap: "1.5rem" }}>
              {values.map((v) => (
                <motion.div key={v.title} variants={fadeUp} className="card" style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  <div style={{ width: 48, height: 48, background: `${v.color}18`, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: v.color, flexShrink: 0 }}>
                    {v.icon}
                  </div>
                  <div>
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>{v.title}</h3>
                    <p style={{ fontSize: "0.9rem" }}>{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section .container > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}