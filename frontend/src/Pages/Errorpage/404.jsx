import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section" style={{ borderBottom: 'none', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2>404 ERROR PAGE</h2>
      <p>The page you're looking for doesn't exist.</p>
      <div>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Home</Link>
      </div>
    </section>
  );
}
