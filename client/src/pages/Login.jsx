import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiZap,
  FiLogIn,
} from "react-icons/fi";
import { toast } from "react-toastify";

import { loginUser } from "../api/api.js";
import { login, setLoading } from "../store/authSlice.js";

import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }

    setSubmitting(true);
    dispatch(setLoading(true));

    try {
      const response = await loginUser(form);

      dispatch(login(response.data.user));

      toast.success("Welcome back! 🎉");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Invalid credentials";

      toast.error(message);
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <main className="spark-login-page">
      <div className="spark-login-orb spark-login-orb-one" />
      <div className="spark-login-orb spark-login-orb-two" />

      <motion.div
        className="spark-login-container"
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <section className="spark-login-card">

          {/* Brand */}
          <div className="spark-login-brand">
            <motion.div
              className="spark-login-brand-icon"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <FiZap size={25} />
            </motion.div>

            <h1 className="spark-login-title">
              Welcome Back
            </h1>

            <p className="spark-login-subtitle">
              Sign in Only For <strong>Core Team</strong> of Spark Club
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="spark-login-form"
          >
            {/* Email */}
            <div className="spark-login-field">
              <label
                htmlFor="login-email"
                className="spark-login-label"
              >
                Email Address
              </label>

              <div className="spark-login-input-wrapper">
                <FiMail
                  className="spark-login-input-icon"
                  size={16}
                />

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="spark-login-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="spark-login-field">
              <label
                htmlFor="login-password"
                className="spark-login-label"
              >
                Password
              </label>

              <div className="spark-login-input-wrapper">
                <FiLock
                  className="spark-login-input-icon"
                  size={16}
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="spark-login-input spark-login-password-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="spark-login-password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="spark-login-submit"
              disabled={submitting}
              whileTap={{ scale: 0.98 }}
            >
              {submitting ? (
                "Signing in..."
              ) : (
                <>
                  <FiLogIn size={16} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Back */}
          <div className="spark-login-back">
            <Link
              to="/"
              className="spark-login-back-link"
            >
              ← Back to Home
            </Link>
          </div>
        </section>

        <p className="spark-login-note">
          Access restricted to club members only
        </p>
      </motion.div>
    </main>
  );
}