import { useEffect, useState } from 'react';
import api from '../../api.js';

export function useAdminList(endpoint) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  async function reload() {
    try {
      setError('');
      const res = await api.get(endpoint);
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load this data');
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return { items, error, reload };
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}