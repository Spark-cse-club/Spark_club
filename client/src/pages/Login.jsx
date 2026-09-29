import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiZap, FiLogIn } from "react-icons/fi";
import { toast } from "react-toastify";
import { loginUser } from "../api/api.js";
import { login, setLoading } from "../store/authSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Email and password are required"); return; }
    setSubmitting(true);
    dispatch(setLoading(true));
    try {
      const response = await loginUser(form);
      dispatch(login(response.data.user));
      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--nav-height))", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", position: "relative", overflow: "hidden", padding: "2rem 1rem" }}>
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}
      >
        {/* Card */}
        <div className="glass" style={{ borderRadius: "var(--radius-xl)", padding: "2.5rem", boxShadow: "var(--shadow-lg)" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              style={{ width: 56, height: 56, background: "var(--gradient-primary)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: "var(--shadow-glow)" }}
            >
              <FiZap color="white" size={26} />
            </motion.div>
            <h2 style={{ marginBottom: "0.35rem" }}>Welcome Back</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Sign in to your Spark dashboard</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <FiMail size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  className="form-input" placeholder="you@example.com"
                  style={{ paddingLeft: "2.5rem" }}
                  autoComplete="email" required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <FiLock size={16} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={form.password} onChange={handleChange}
                  className="form-input" placeholder="••••••••"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.75rem" }}
                  autoComplete="current-password" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 0, display: "flex" }}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" className="btn btn-primary"
              disabled={submitting}
              whileTap={{ scale: 0.97 }}
              style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", marginTop: "0.5rem" }}
            >
              {submitting ? (
                <>Signing in...</>
              ) : (
                <><FiLogIn size={16} /> Sign In</>
              )}
            </motion.button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link to="/" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Access restricted to club members only
        </p>
      </motion.div>
    </div>
  );
}