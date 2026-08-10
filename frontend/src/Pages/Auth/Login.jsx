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

  return (
    <div className="tavola-page">
      <img src={heroKitchen} alt="" className="tavola-bg-image" />

      <div className="tavola-card">
        <h1 className="tavola-title">Tavola</h1>
        <p className="tavola-subtitle">Welcome back. Please sign in.</p>

        {status.text && (
          <p className={`tavola-msg ${status.type}`}>{status.text}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="tavola-field">
            <div className="tavola-label-row">
              <label className="tavola-label" htmlFor="email">Email address</label>
            </div>
            <input
              id="email"
              type="email"
              className="tavola-input"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="tavola-field">
            <div className="tavola-label-row">
              <label className="tavola-label" htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              type="password"
              className="tavola-input"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="tavola-remember-row">
            <label className="tavola-remember">
              <input
                type="checkbox"
                className="tavola-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="tavola-remember-label">Remember me on this device</span>
            </label>
            <Link to="/forgot-password" className="tavola-forgot">Forgot Password?</Link>
          </div>

          <button type="submit" className="tavola-btn tavola-btn-primary" disabled={loading}>
            {loading ? "Signing In..." : "Sign in"}
          </button>
          <Link to="/signup" className="tavola-btn tavola-btn-secondary" style={{ display: "block", textAlign: "center" }}>
            Create an account
          </Link>
        </form>

        <p className="tavola-footer">
          By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}