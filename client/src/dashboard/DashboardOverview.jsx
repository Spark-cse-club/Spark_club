import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiCalendar,
  FiCode,
  FiAward,
  FiImage,
  FiUsers,
} from "react-icons/fi";

import { getStats } from "../api/api.js";

import Loader from "../components/common/Loader.jsx";
import "./DashboardOverview.css";

export default function DashboardOverview() {
  const { user } = useSelector((s) => s.auth);

  const [counts, setCounts] = useState({
    events: 0,
    projects: 0,
    achievements: 0,
    gallery: 0,
    team: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchstats = async () => {
      try {
        const response = await getStats();
        setCounts(response?.data || {});
      } catch(error) {
        console.error("Failed to fetch dashboard stats : ",error);
      } finally {
        setLoading(false);
      }
    };
    fetchstats();
  }, [])

  if (loading) return <Loader />;

  const stats = [
    {
      label: "Total Events",
      value: counts.events,
      icon: <FiCalendar />,
      color: "#6366f1",
      roles: ["president", "vice_president", "technical_head"],
    },
    {
      label: "Total Projects",
      value: counts.projects,
      icon: <FiCode />,
      color: "#8b5cf6",
      roles: ["president", "vice_president", "technical_head"],
    },
    {
      label: "Achievements",
      value: counts.achievements,
      icon: <FiAward />,
      color: "#06b6d4",
      roles: ["president", "vice_president", "secretary"],
    },
    {
      label: "Gallery Items",
      value: counts.gallery,
      icon: <FiImage />,
      color: "#22c55e",
      roles: ["president", "vice_president", "secretary"],
    },
    {
      label: "Team Members",
      value: counts.team,
      icon: <FiUsers />,
      color: "#f59e0b",
      roles: ["president"],
    },
  ].filter((stat) => stat.roles.includes(user?.role));

  return (
    <div>
      <div className="dashboard-overview-header">
        <h1 className="dashboard-overview-title">
          Dashboard Overview
        </h1>

        <p className="dashboard-overview-subtitle">
          Welcome back, {user?.name}! Here's what's happening in the club.
        </p>
      </div>

      <div className="dashboard-overview-grid">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="dashboard-overview-stat-card"
          >
            <div
              className="dashboard-overview-stat-icon"
              style={{
                background: `${stat.color}18`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>

            <div>
              <div className="dashboard-overview-stat-value">
                {stat.value}
              </div>

              <div className="dashboard-overview-stat-label">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}