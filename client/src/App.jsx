import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getCurrentUser, refreshAccessToken } from "./api/api.js";
import { login, setLoading } from "./store/authSlice.js";
import { setTheme } from "./store/themeSlice.js";

import Navbar from "./components/Common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Loader from "./components/common/Loader.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/AboutUs.jsx";
import Events from "./pages/Events";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Achievements from "./pages/Achievements";
import Team from "./pages/Team";
import Contact from "./pages/ContactUs.jsx";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import DashboardOverview from "./dashboard/DashboardOverview.jsx";
import EventsManager from "./dashboard/EventsManager.jsx";
import ProjectsManager from "./dashboard/ProjectsManager.jsx";
import AchievementsManager from "./dashboard/AchievementsManager.jsx";
import GalleryManager from "./dashboard/GalleryManager.jsx";
import TeamManager from "./dashboard/TeamManager.jsx";

const NO_FOOTER_PATHS = ["/dashboard"];

function AppContent() {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.theme);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        await refreshAccessToken();
        const response = await getCurrentUser();
        dispatch(login(response.data.user));
      } catch {
        // not authenticated
      } finally {
        dispatch(setLoading(false));
      }
    };
    restoreAuth();
  }, [dispatch]);

  useEffect(() => {
    const saved = localStorage.getItem("spark-theme") || "dark";
    dispatch(setTheme(saved));
  }, [dispatch]);

  if (loading) return <Loader fullscreen />;

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="events" element={<EventsManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="achievements" element={<AchievementsManager />} />
              <Route path="team" element={<TeamManager />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>

      {!isDashboard && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        theme={theme}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;