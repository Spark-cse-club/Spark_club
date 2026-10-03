import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/themeSlice.js";
import { FiSun, FiMoon } from "react-icons/fi";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const { theme } = useSelector((s) => s.theme);

  const isDark = theme === "dark";

  return (
    <motion.button
      className="spark-theme-toggle"
      onClick={() => dispatch(toggleTheme())}
      whileTap={{ scale: 0.9 }}
      title="Toggle theme"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        key={theme}
        className="spark-theme-toggle-icon"
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
      </motion.div>
    </motion.button>
  );
}
