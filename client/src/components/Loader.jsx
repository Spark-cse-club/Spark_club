import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";

export default function Loader({ fullscreen = false }) {
  const style = fullscreen
    ? {
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "1.25rem",
        background: "var(--bg-primary)",
      }
    : {
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: "1.25rem",
        padding: "4rem",
        minHeight: "30vh",
      };

  return (
    <div style={style}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 56, height: 56,
          background: "var(--gradient-primary)",
          borderRadius: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-glow)",
        }}
      >
        <FiZap color="white" size={28} />
      </motion.div>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <div className="spinner" style={{ position: "absolute", inset: 0 }} />
      </div>
    </div>
  );
}
