import { Link } from "react-router-dom";
import { FiZap, FiGithub, FiLinkedin, FiMail, FiInstagram } from "react-icons/fi";
import "./Footer.css";

const footerLinks = {
  Pages: [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Events", to: "/events" },
    { label: "Projects", to: "/projects" },
  ],
  Explore: [
    { label: "Gallery", to: "/gallery" },
    { label: "Achievements", to: "/achievements" },
    { label: "Team", to: "/team" },
    { label: "Contact", to: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      {/* Top gradient bar */}
      <div className="footer-top-bar" />

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <div className="footer-logo-icon">
                <FiZap color="white" size={20} />
              </div>
              <span className="footer-logo-text">
                Spark CSE Club
              </span>
            </div>
            <p className="footer-description">
              Empowering computer science enthusiasts through collaboration, innovation, and real-world tech skills.
            </p>
            <div className="footer-social-links">
              {[
                { icon: <FiGithub size={16} />, href: "#" },
                { icon: <FiLinkedin size={16} />, href: "#" },
                { icon: <FiInstagram size={16} />, href: "#" },
                { icon: <FiMail size={16} />, href: "mailto:spark@college.edu" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" className="footer-social-icon">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="footer-links-title">
                {title}
              </h4>
              <ul className="footer-links-list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Spark CSE Club. All rights reserved.
          </p>
          <p className="footer-credits">
            Built with ⚡ by the Spark team
          </p>
        </div>
      </div>
    </footer>
  );
}