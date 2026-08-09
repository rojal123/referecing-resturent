import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tavola_user');
    if (!saved || saved === 'undefined') return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await api.get('/auth/me');
        if (!cancelled) {
          setUser(res.data.user);
          localStorage.setItem('tavola_user', JSON.stringify(res.data.user));
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          localStorage.removeItem('tavola_user');
        }
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    checkSession();
    return () => { cancelled = true; };
  }, []);

  function login(userData) {
    localStorage.setItem('tavola_user', JSON.stringify(userData));
    setUser(userData);
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // still clear local state even if the request fails
    }
    localStorage.removeItem('tavola_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkingSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}