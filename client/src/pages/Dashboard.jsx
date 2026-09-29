import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="dashboard-mobile-overlay"
        />
      )}

      {/* Content */}
      <div className="dashboard-content">
        {/* Mobile header */}
        <div className="dashboard-mobile-header">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="dashboard-mobile-header-btn"
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
          <span className="dashboard-mobile-header-title">Dashboard</span>
        </div>

        <motion.div
          key="outlet"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}