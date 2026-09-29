import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiImage, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getGallery } from "../api/api.js";
import Loader from "../components/Loader.jsx";

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const catColors = {
  event: "badge-blue", workshop: "badge-purple", hackathon: "badge-orange",
  competition: "badge-red", celebration: "badge-green", other: "badge-cyan",
};

export default function Gallery() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null); // { images, index }

  useEffect(() => {
    getGallery().then((res) => setGalleries(res?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ["all", "event", "workshop", "hackathon", "competition", "celebration", "other"];
  const filtered = filter === "all" ? galleries : galleries.filter((g) => g.category === filter);

  const openLightbox = (images, index) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => setLightbox((l) => ({ ...l, index: (l.index - 1 + l.images.length) % l.images.length }));
  const nextImage = () => setLightbox((l) => ({ ...l, index: (l.index + 1) % l.images.length }));

  if (loading) return <Loader />;

  return (
    <div>
      <section style={{ padding: "4rem 0 2rem", background: "var(--bg-secondary)", position: "relative", overflow: "hidden" }}>
        <div className="orb orb-1" style={{ opacity: 0.2 }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp}><span className="section-label"><FiImage size={12} /> Gallery</span></motion.div>
            <motion.h1 variants={fadeUp} style={{ marginBottom: "1rem" }}>Photo <span className="gradient-text">Gallery</span></motion.h1>
            <motion.p variants={fadeUp} style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Memories captured from our events, workshops, and celebrations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          <div className="filter-tabs" style={{ flexWrap: "wrap" }}>
            {categories.map((f) => (
              <button key={f} className={`filter-tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🖼️</div><p>No gallery items found.</p></div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="grid-3">
              {filtered.map((gallery) => (
                <motion.div key={gallery._id} variants={fadeUp} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {/* Main image */}
                  <div style={{ position: "relative", cursor: "pointer" }} onClick={() => openLightbox(gallery.images, 0)}>
                    <img src={gallery.images[0]?.url} alt={gallery.title}
                      style={{ width: "100%", height: 220, objectFit: "cover", display: "block", transition: "transform 0.3s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                    {gallery.images.length > 1 && (
                      <div style={{
                        position: "absolute", bottom: 8, right: 8,
                        background: "rgba(0,0,0,0.65)", color: "white",
                        fontSize: "0.75rem", fontWeight: 600,
                        padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)",
                        backdropFilter: "blur(4px)",
                      }}>
                        +{gallery.images.length - 1} more
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                      <h3 style={{ fontSize: "0.95rem" }}>{gallery.title}</h3>
                      <span className={`badge ${catColors[gallery.category] || "badge"}`}>{gallery.category}</span>
                    </div>
                    {gallery.eventName && (
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>📌 {gallery.eventName}</p>
                    )}
                    {gallery.eventDate && (
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>📅 {new Date(gallery.eventDate).toLocaleDateString()}</p>
                    )}
                    {/* Thumbnail strip */}
                    {gallery.images.length > 1 && (
                      <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.75rem" }}>
                        {gallery.images.slice(0, 4).map((img, i) => (
                          <img key={i} src={img.url} alt=""
                            onClick={() => openLightbox(gallery.images, i)}
                            style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "var(--radius-sm)", cursor: "pointer", border: "2px solid var(--border)", transition: "border-color 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={closeLightbox}
          >
            <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiX size={20} />
            </button>
            {lightbox.images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  style={{ position: "absolute", left: 20, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FiChevronLeft size={22} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  style={{ position: "absolute", right: 20, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 44, height: 44, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FiChevronRight size={22} />
                </button>
              </>
            )}
            <motion.img
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={lightbox.images[lightbox.index]?.url}
              alt=""
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: "var(--radius-lg)", boxShadow: "0 25px 60px rgba(0,0,0,0.8)" }}
            />
            {lightbox.images.length > 1 && (
              <div style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                {lightbox.index + 1} / {lightbox.images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}