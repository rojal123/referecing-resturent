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
      navigate(res.data.user.isAdmin ? "/admin" : "/");
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Something went wrong. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSocialLogin(provider) {
    window.location.href = `${api.defaults.baseURL}/auth/${provider}`;
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

        <div className="tavola-social-row">
          <button
            type="button"
            className="tavola-social-btn"
            onClick={() => handleSocialLogin("google")}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            className="tavola-social-btn"
            onClick={() => handleSocialLogin("facebook")}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#1877F2" d="M18 9a9 9 0 1 0-10.4 8.89v-6.29H5.31V9h2.29V7.01c0-2.26 1.35-3.51 3.41-3.51.99 0 2.02.18 2.02.18v2.22h-1.14c-1.12 0-1.47.7-1.47 1.41V9h2.5l-.4 2.6h-2.1v6.29A9 9 0 0 0 18 9z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="tavola-divider"><span>or</span></div>

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