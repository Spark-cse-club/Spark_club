import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="spark-dashboard-layout">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="spark-dashboard-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main className="spark-dashboard-content">
        {/* Mobile Header */}
        <header className="spark-dashboard-mobile-header">
          <button
            type="button"
            className="spark-dashboard-mobile-button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>

          <span className="spark-dashboard-mobile-title">
            Dashboard
          </span>
        </header>

        {/* Dashboard Pages */}
        <motion.div
          key="dashboard-outlet"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="spark-dashboard-outlet"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}