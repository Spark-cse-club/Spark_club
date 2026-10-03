import { Link } from "react-router-dom";
import emblem from "../assets/spark-logo.png";
import "./SparkLogo.css";

export default function SparkLogo({ compact = false, to = "/" }) {
  return (
    <Link to={to} className={`spark-brand${compact ? " spark-brand--compact" : ""}`}>
      <img src={emblem} alt="Spark CSE Club" className="spark-brand-mark" />
      <span className="spark-brand-copy">
        <span className="spark-brand-name">Spark CSE</span>
        <span className="spark-brand-tagline">Explore · Learn · Code</span>
      </span>
    </Link>
  );
}
