import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../Context/AuthContext.jsx";
import heroKitchen from "../../assets/hero-kitchen.png";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [status, setStatus] = useState(() =>
    location.state?.signupMessage
      ? { type: "success", text: location.state.signupMessage }
      : { type: "", text: "" }
  );

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      setStatus({ type: "success", text: res.data.message });
      const redirectTo = location.state?.from;
      navigate(redirectTo || (res.data.user.isAdmin ? "/admin" : "/"));
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Something went wrong. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tavola-page">
      <img src={heroKitchen} alt="" className="tavola-bg-image" />
      <div className="tavola-bg-overlay" />

      <div className="tavola-card">
        <h1 className="tavola-title">Tavola</h1>
        <p className="tavola-subtitle">Welcome back. Please sign in.</p>

        {status.text && (
          <p className={`tavola-msg ${status.type}`}>{status.text}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="tavola-field">
            <label className="tavola-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="tavola-input"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="tavola-field">
            <label className="tavola-label" htmlFor="password">Password</label>
            <div className="tavola-input-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="tavola-input"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="tavola-eye-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8M9.4 5.5A9.9 9.9 0 0 1 12 5c5 0 9 4 10 7-.5 1.5-1.5 3-2.9 4.2M6.6 6.6C4.6 8 3.1 9.9 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.7"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="tavola-remember-row">
            <label className="tavola-remember">
              <input
                type="checkbox"
                className="tavola-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="tavola-remember-label">Remember me</span>
            </label>
            <Link to="/forgot-password" className="tavola-forgot">Forgot Password?</Link>
          </div>

          <button type="submit" className="tavola-btn tavola-btn-primary" disabled={loading}>
            {loading ? "Signing In..." : "Sign in"}
          </button>
        </form>

        <p className="tavola-footer-link">
          Don&apos;t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}