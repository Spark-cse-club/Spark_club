import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice.js";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const { theme } = useSelector((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => dispatch(toggleTheme())}
      whileTap={{ scale: 0.9 }}
      title="Toggle theme"
      style={{
        width: 38, height: 38,
        border: "1px solid var(--border)",
        background: "var(--accent-bg)",
        borderRadius: "var(--radius-sm)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        color: isDark ? "#facc15" : "#6366f1",
        transition: "var(--transition)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
      </motion.div>
    </motion.button>
  );
}
