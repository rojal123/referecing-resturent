import axios from 'axios';

// In dev, vite.config.js proxies "/api" to http://localhost:5000
// In production, set VITE_API_URL to your deployed backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // Required so the browser sends/receives the httpOnly "tavola_session"
  // cookie set by the backend. Without this, login would appear to work
  // but the cookie would never actually be attached to later requests.
  withCredentials: true,
});

export default api;