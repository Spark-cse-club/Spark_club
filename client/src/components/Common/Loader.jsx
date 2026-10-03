import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";
import "./Loader.css";

export default function Loader({ fullscreen = false }) {
  return (
    <div
      className={`spark-loader ${
        fullscreen ? "spark-loader-fullscreen" : ""
      }`}
    >
      <motion.div
        className="spark-loader-mark"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FiZap size={28} />
      </motion.div>

      <div className="spark-loader-spinner-wrap">
        <div className="spark-loader-spinner" />
      </div>
    </div>
  );
}
