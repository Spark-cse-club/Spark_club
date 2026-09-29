import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiGrid, FiCalendar, FiCode, FiImage,
  FiAward, FiUsers, FiChevronRight,
} from "react-icons/fi";
import "./DashboardSidebar.css";

const allItems = [
  { to: "/dashboard", label: "Overview", icon: <FiGrid size={18} />, end: true, roles: ["president", "vice_president", "technical_head", "secretary"] },
  { to: "/dashboard/events", label: "Events", icon: <FiCalendar size={18} />, roles: ["president", "vice_president", "technical_head"] },
  { to: "/dashboard/projects", label: "Projects", icon: <FiCode size={18} />, roles: ["president", "vice_president", "technical_head"] },
  { to: "/dashboard/achievements", label: "Achievements", icon: <FiAward size={18} />, roles: ["president", "vice_president", "secretary"] },
  { to: "/dashboard/gallery", label: "Gallery", icon: <FiImage size={18} />, roles: ["president", "vice_president", "secretary"] },
  { to: "/dashboard/team", label: "Team", icon: <FiUsers size={18} />, roles: ["president"] },
];

const roleLabels = {
  president: "President",
  vice_president: "Vice President",
  technical_head: "Technical Head",
  secretary: "Secretary",
  faculty: "Faculty",
};

const roleBadgeColors = {
  president: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  vice_president: { bg: "rgba(139,92,246,0.15)", color: "#a78bfa" },
  technical_head: { bg: "rgba(6,182,212,0.15)", color: "#22d3ee" },
  secretary: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  faculty: { bg: "rgba(249,115,22,0.15)", color: "#fb923c" },
};

export default function DashboardSidebar({ isOpen, onClose }) {
  const { user } = useSelector((s) => s.auth);
  const role = user?.role || "";

  const items = allItems.filter((item) => item.roles.includes(role));
  const badgeStyle = roleBadgeColors[role] || { bg: "var(--accent-bg)", color: "var(--accent)" };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
      {/* User info */}
      <div className="dashboard-sidebar-user-info">
        <div className="dashboard-sidebar-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <p className="dashboard-sidebar-username">
          {user?.name}
        </p>
        <span
          className="dashboard-sidebar-badge"
          style={{ background: badgeStyle.bg, color: badgeStyle.color }}
        >
          {roleLabels[role] || role}
        </span>
      </div>

      {/* Nav label */}
      <p className="dashboard-sidebar-nav-label">
        Navigation
      </p>

      {/* Nav items */}
      <nav className="dashboard-sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `dashboard-sidebar-nav-item${isActive ? " active" : ""}`}
          >
            <span className="dashboard-sidebar-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            <FiChevronRight size={14} className="dashboard-sidebar-nav-arrow" />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}