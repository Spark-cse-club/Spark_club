import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiZap, FiMenu, FiX, FiLogIn, FiLogOut, FiLayout,
} from "react-icons/fi";
import { logoutUser } from "../../api/api.js";
import { logout } from "../../store/authSlice.js";
import { toggleTheme } from "../../store/themeSlice.js";
import { toast } from "react-toastify";
import ThemeToggle from "../Common/ThemeToggle.jsx";
import "./Navbar.css";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/projects", label: "Projects" },
  { to: "/gallery", label: "Gallery" },
  { to: "/achievements", label: "Achievements" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.theme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`navbar-wrapper ${scrolled ? "navbar-scrolled" : "navbar-transparent"}`}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo-link">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="navbar-logo-icon"
            >
              <FiZap color="white" size={20} />
            </motion.div>
            <span className="navbar-logo-text">
              Spark Club
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-desktop-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) => `navbar-nav-link ${isActive ? "active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="navbar-right-section">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="navbar-auth-group">
                <Link to="/dashboard" className="navbar-btn navbar-btn-secondary">
                  <FiLayout size={14} />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="navbar-btn navbar-btn-ghost">
                  <FiLogOut size={14} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="navbar-btn navbar-btn-primary">
                <FiLogIn size={14} />
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="navbar-mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="navbar-mobile-menu"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `navbar-mobile-link ${isActive ? "active" : ""}`}
              >
                {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}