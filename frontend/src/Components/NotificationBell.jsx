import { useEffect, useRef, useState } from 'react';
import api from '../api.js';
import './notificationBell.css';

const POLL_INTERVAL_MS = 30000;

function timeAgo(value) {
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState(null);
  const wrapperRef = useRef(null);

  async function fetchUnreadCount() {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.unread_count);
    } catch {
      // Silently ignore -- a failed poll shouldn't disrupt the page.
    }
  }

  async function fetchNotifications() {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch {
      setNotifications([]);
    }
  }

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next) fetchNotifications();
  }

  async function markRead(id) {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore -- notification stays unread, user can retry.
    }
  }

  async function markAllRead() {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Ignore -- unread state is refreshed on next poll regardless.
    }
  }

  return (
    <div className="notif-bell-wrap" ref={wrapperRef}>
      <button
        type="button"
        className="notif-bell-btn"
        onClick={toggleOpen}
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2a6 6 0 0 0-6 6v3.09c0 .5-.18.98-.5 1.36L4 14.5c-.83 1-.1 2.5 1.19 2.5h13.62c1.29 0 2.02-1.5 1.19-2.5l-1.5-2.05a2 2 0 0 1-.5-1.36V8a6 6 0 0 0-6-6z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 20a2.5 2.5 0 0 0 5 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="notif-bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-head">
            <span>Notifications</span>
            {notifications && notifications.some((n) => !n.is_read) && (
              <button type="button" className="notif-mark-all" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-dropdown-list">
            {!notifications && <p className="notif-empty">Loading...</p>}
            {notifications && notifications.length === 0 && (
              <p className="notif-empty">You're all caught up.</p>
            )}
            {notifications && notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`notif-item ${n.is_read ? '' : 'unread'}`}
                onClick={() => !n.is_read && markRead(n.id)}
              >
                <div className="notif-item-top">
                  <span className="notif-item-title">{n.title}</span>
                  {!n.is_read && <span className="notif-dot" aria-hidden="true" />}
                </div>
                <p className="notif-item-message">{n.message}</p>
                <span className="notif-item-time">{timeAgo(n.created_at)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}