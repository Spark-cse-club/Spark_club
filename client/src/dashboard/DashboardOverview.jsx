import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiCalendar, FiCode, FiAward, FiImage, FiUsers } from "react-icons/fi";
import { 
  getEvents, 
  getProjects, 
  getAchievements, 
  getGallery, 
  getCoreTeam 
} from "../api/api.js";
import Loader from "../components/Loader.jsx";
import "./DashboardOverview.css";

export default function DashboardOverview() {
  const { user } = useSelector((s) => s.auth);
  const [counts, setCounts] = useState({ events: 0, projects: 0, achievements: 0, gallery: 0, team: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEvents(), getProjects(), getAchievements(), getGallery(), getCoreTeam()
    ]).then(([e, p, a, g, t]) => {
      setCounts({
        events: e?.data?.length || 0,
        projects: p?.data?.length || 0,
        achievements: a?.data?.length || 0,
        gallery: g?.data?.length || 0,
        team: t?.data?.length || 0,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const stats = [
    { label: "Total Events", value: counts.events, icon: <FiCalendar />, color: "#6366f1", roles: ["president", "vice_president", "technical_head"] },
    { label: "Total Projects", value: counts.projects, icon: <FiCode />, color: "#8b5cf6", roles: ["president", "vice_president", "technical_head"] },
    { label: "Achievements", value: counts.achievements, icon: <FiAward />, color: "#06b6d4", roles: ["president", "vice_president", "secretary"] },
    { label: "Gallery Items", value: counts.gallery, icon: <FiImage />, color: "#22c55e", roles: ["president", "vice_president", "secretary"] },
    { label: "Team Members", value: counts.team, icon: <FiUsers />, color: "#f59e0b", roles: ["president"] },
  ].filter(s => s.roles.includes(user?.role));

  return (
    <div>
      <div className="dashboard-overview-header">
        <h1 className="dashboard-overview-title">Dashboard Overview</h1>
        <p className="dashboard-overview-subtitle">Welcome back, {user?.name}! Here's what's happening in the club.</p>
      </div>

      <div className="dashboard-overview-grid">
        {stats.map((s, i) => (
          <div key={i} className="dashboard-overview-stat-card">
            <div className="dashboard-overview-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <div className="dashboard-overview-stat-value">{s.value}</div>
              <div className="dashboard-overview-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}