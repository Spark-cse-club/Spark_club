import { Link } from "react-router-dom";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

import "./Error.css";

export default function Error() {
  return (
    <main className="spark-error-page">
      <div className="spark-error-card">

        <span className="spark-error-code">404</span>

        <h1>Page Not Found</h1>

        <p>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        
        <Link to="/" className="spark-error-button">
          <FiHome />
          Back to Home
        </Link>

      </div>
    </main>
  );
}