import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api.js";
import { useAuth } from "../../Context/AuthContext.jsx";
import heroKitchen from "../../assets/hero-kitchen.png";
import "./Login.css";

// Separate login screen for /admin/login. Same visual language as the
// customer login, but: different copy, no "create account" link, and
// it refuses entry (with a clear message) if the account isn't an admin
// instead of silently sending them to the public homepage.
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [status, setStatus] = useState({ type: "", text: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data.user.isAdmin) {
        setStatus({
          type: "error",
          text: "This account doesn't have admin access."
        });
        setLoading(false);
        return;
      }

      login(res.data.user, res.data.token);
      const redirectTo = location.state?.from;
      navigate(redirectTo || "/admin");
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
        <p className="tavola-subtitle">Admin sign in</p>

        {status.text && (
          <p className={`tavola-msg ${status.type}`}>{status.text}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="tavola-field">
            <label className="tavola-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className="tavola-input"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="tavola-field">
            <label className="tavola-label" htmlFor="admin-password">Password</label>
            <div className="tavola-input-wrap">
              <input
                id="admin-password"
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

          <button type="submit" className="tavola-btn tavola-btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Signing In..." : "Sign in"}
          </button>
        </form>

        <p className="tavola-footer-link">
          Not an admin? <Link to="/login">Go to customer login</Link>
        </p>
      </div>
    </div>
  );
}