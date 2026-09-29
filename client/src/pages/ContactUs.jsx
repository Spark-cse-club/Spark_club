import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiSend, FiMapPin, FiPhone } from "react-icons/fi";
import { sendContact } from "../api/api.js";
import { toast } from "react-toastify";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all required fields"); return; }
    setLoading(true);
    try {
      await sendContact(form);
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section style={{ padding: "4rem 0 2rem", background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}>
        <div className="orb orb-1" style={{ opacity: 0.2 }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp}><span className="section-label"><FiMail size={12} /> Contact Us</span></motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: "1rem" }}>Get In <span className="gradient-text">Touch</span></motion.h1>
            <motion.p variants={fadeUp} style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Have a question or want to collaborate? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>
            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 style={{ marginBottom: "1.5rem" }}>Let's <span className="gradient-text">Connect</span></h2>
              {[
                { icon: <FiMail />, label: "Email", value: "spark@college.edu" },
                { icon: <FiPhone />, label: "Phone", value: "+91 XXXXXXXXXX" },
                { icon: <FiMapPin />, label: "Location", value: "CSE Department, College Campus" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: 44, height: 44, background: "var(--accent-bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0, border: "1px solid var(--border)" }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.15rem", color: "var(--text-primary)" }}>{item.label}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="card">
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input name="subject" value={form.subject} onChange={handleChange} className="form-input" placeholder="What's this about?" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} className="form-textarea" placeholder="Tell us more..." rows={5} required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: "flex-start", minWidth: 160 }}>
                    {loading ? "Sending..." : <><FiSend size={15} /> Send Message</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          section .container > div[style*="1fr 2fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}