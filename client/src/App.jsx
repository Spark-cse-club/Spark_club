
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getCurrentUser, refreshAccessToken } from "./api/api.js";
import { login, setLoading } from "./store/authSlice.js";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        await refreshAccessToken();

        const response = await getCurrentUser();

        dispatch(login(response.data.user));
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        dispatch(setLoading(false));
      }
    };

    restoreAuth();
  }, [dispatch]);
  
  return (
    <BrowserRouter>
      <Navbar/>

      <Routes>
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
        />
      </Routes>
      
      <Footer/>
    </BrowserRouter>
  )
}

export default App;