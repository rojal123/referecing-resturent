import { useState } from 'react';
import api from '../../../api.js';
import { useAdminList, formatDate } from '../helpers.js';

export default function Notifications() {
  const { items, error, reload } = useAdminList('/admin/messages');
  const { items: customers } = useAdminList('/admin/customers');

  const [recipientId, setRecipientId] = useState('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState({ type: '', text: '' });

  async function remove(id) {
    if (!window.confirm('Delete this message?')) return;
    await api.delete(`/admin/messages/${id}`);
    reload();
  }

  async function handleSend(e) {
    e.preventDefault();
    setSendStatus({ type: '', text: '' });
    setSending(true);
    try {
      const res = await api.post('/admin/notifications', { recipientId, title, message });
      setSendStatus({ type: 'success', text: res.data.message });
      setTitle('');
      setMessage('');
    } catch (err) {
      setSendStatus({
        type: 'error',
        text: err.response?.data?.message || 'Could not send notification'
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-head">
        <h3>Send Notification</h3>
      </div>

      <form onSubmit={handleSend} style={{ maxWidth: 520, marginBottom: 8 }}>
        <div className="field">
          <label htmlFor="notif-recipient">Send to</label>
          <select
            id="notif-recipient"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          >
            <option value="all">All users</option>
            {customers && customers.map((c) => (
              <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="notif-title">Title</label>
          <input
            id="notif-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
          />
        </div>

        <div className="field">
          <label htmlFor="notif-message">Message</label>
          <textarea
            id="notif-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
          />
        </div>

        {sendStatus.text && (
          <div className={`form-msg ${sendStatus.type}`}>{sendStatus.text}</div>
        )}

        <button className="admin-btn-primary" type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send Notification'}
        </button>
      </form>

      <div className="admin-panel-head" style={{ marginTop: 40 }}>
        <h3>Contact Messages</h3>
      </div>
      {error && <div className="form-msg error">{error}</div>}
      {!items && !error && <p className="admin-empty">Loading...</p>}
      {items && items.length === 0 && <p className="admin-empty">No messages yet.</p>}
      {items && items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Sent</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>{m.full_name}<br />{m.email}</td>
                  <td>{m.subject || '—'}</td>
                  <td className="wrap-cell">{m.message}</td>
                  <td>{formatDate(m.created_at)}</td>
                  <td>
                    <button className="admin-btn-sm admin-btn-danger" onClick={() => remove(m.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}