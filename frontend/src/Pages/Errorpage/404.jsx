import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section" style={{ borderBottom: 'none', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <span className="eyebrow" style={{ justifyContent: 'center' }}>404</span>
      <h2>This table isn't set.</h2>
      <p>The page you're looking for doesn't exist.</p>
      <div>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Home</Link>
      </div>
    </section>
  );
}
