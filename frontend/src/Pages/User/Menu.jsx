import api from '../../api.js';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems(query = '') {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/menu', { params: query ? { search: query } : {} });
      setItems(res.data);
    } catch (err) {
      setError('Could not load the menu right now. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchItems(search);x
  }

  const categories = ['All', ...new Set(items.map((i) => i.category))];
  const visible = category === 'All' ? items : items.filter((i) => i.category === category);

  return (
    <section className="section" style={{ borderBottom: 'none' }}>
      <div className="wrap">
        <span className="eyebrow">Full Menu</span>
        <h2>Search the table.</h2>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, margin: '28px 0', maxWidth: 480, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search dishes, e.g. salmon, pizza..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: 220,
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-line)',
              borderRadius: 3,
              padding: '12px 14px',
              color: 'var(--color-cream)'
            }}
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="btn"
                style={{
                  border: '1px solid var(--color-line)',
                  background: category === c ? 'var(--color-gold)' : 'transparent',
                  color: category === c ? '#1a1411' : 'var(--color-cream-dim)'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading && <p>Loading menu...</p>}
        {error && <div className="form-msg error" style={{ maxWidth: 480 }}>{error}</div>}
        {!loading && !error && visible.length === 0 && <p>No dishes match your search.</p>}

        <div className="menu-grid">
          {visible.map((item) => (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} />
                ) : (
                  <div className="menu-item-image-placeholder" />
                )}
              </div>
              <div className="menu-item-body">
                <div className="menu-item-top">
                  <h3>{item.name}</h3>
                  <span className="menu-price">${Number(item.price).toFixed(2)}</span>
                </div>
                <span className="eyebrow" style={{ marginBottom: 8 }}>{item.category}</span>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <Link to="/order" className="btn btn-outline">Order From This Menu</Link>
        </div>
      </div>

      <style>{`
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .menu-item-card {
          background: var(--color-panel);
          border: 1px solid var(--color-line);
          border-radius: 6px;
          overflow: hidden;
        }
        .menu-item-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          background: var(--color-bg-alt);
        }
        .menu-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .menu-item-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(155deg, var(--color-wine) 0%, var(--color-panel) 70%);
        }
        .menu-item-body {
          padding: 22px;
        }
        .menu-item-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
        }
        .menu-price {
          font-family: var(--font-mono);
          color: var(--color-gold);
          white-space: nowrap;
        }
      `}</style>
    </section>
  );
}