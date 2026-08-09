import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import useReveal from '../hooks/useReveal.js';
import './home.css';

function Reveal({ as: Tag = 'div', className = '', children }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

const FALLBACK_DISHES = [
  'Burrata Caprese', 'Tagliatelle al Ragu', 'Pan-Seared Salmon',
  'Wild Mushroom Arancini', 'Margherita Pizza', 'Tiramisu', 'Panna Cotta'
];

export default function Home() {
  const [dishes, setDishes] = useState(FALLBACK_DISHES);

  useEffect(() => {
    api.get('/menu')
      .then((res) => {
        const names = res.data.map((item) => item.name);
        if (names.length > 0) setDishes(names);
      })
      .catch(() => {
        // keep FALLBACK_DISHES if the menu can't be reached
      });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-scrim" />
        <div className="wrap hero-inner">
          <h1 className="hero-huge hero-fade-2">
            Slow food,served with intent.
          </h1>
          <p className="hero-fade-3 hero-subtitle">
            A seasonal Italian kitchen. We believe in the slow art of pasta
            making and the deliberate sourcing of local ingredients.
          </p>

          <div className="hero-fade-4">
            <Link to="/booking" className="btn-pill">Book a Table</Link>
          </div>
        </div>
      </section>

      {/* MARQUEE - live from the menu */}
      <div className="marquee">
        <div className="marquee-track">
          {[...dishes, ...dishes].map((d, i) => (
            <span key={i} className="marquee-item">
              {d} <span className="dot">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      {/* INGREDIENTS / KITCHEN */}
      <section className="section">
        <div className="wrap kitchen-grid">
          <Reveal>
            <span className="eyebrow">Our Kitchen</span>
            <h2>Ingredients first, everything else second.</h2>
            <p>
              Our menu changes with the seasons, guided by what local growers
              bring to our kitchen door. It is a dialogue between Italian
              heritage and the rich terroir of the Kathmandu valley.
            </p>
            <Link to="/about" className="btn btn-outline" style={{ marginTop: 12 }}>
              Read Our Story
            </Link>
          </Reveal>
          <Reveal className="kitchen-photo">
            <div className="kitchen-photo-inner" />
          </Reveal>
        </div>
      </section>

      {/* THE PROCESS */}
      <section className="section">
        <div className="wrap">
          <Reveal style={{ textAlign: 'center' }}>
            <span className="eyebrow">Experience</span>
            <h2 style={{ marginBottom: 40 }}>The Process</h2>
          </Reveal>

          <div className="how-grid">
            {[
              { t: 'Browse', d: 'Explore our seasonal offerings and signature classics.', to: '/menu' },
              { t: 'Reserve', d: 'Pick a date, time, and party size — we hold the table for you.', to: '/booking' },
              { t: 'Order', d: 'Personalize your meal and collect it right on time.', to: '/order' }
            ].map((item, i) => (
              <Reveal key={item.t} className="how-card">
                <span className="how-index">0{i + 1}</span>
                <h3>{item.t}</h3>
                <p>{item.d}</p>
                <Link to={item.to} className="how-link">Go &rarr;</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with watermark */}
      <section className="section cta-section">
        <span className="cta-watermark">EST. 2014</span>
        <Reveal style={{ position: 'relative', textAlign: 'center' }}>
          <span className="eyebrow">Reserve Your Evening</span>
          <h2>The table is set. Are you coming?</h2>
          <Link to="/booking" className="btn btn-primary" style={{ marginTop: 20 }}>
            Book a Table Now
          </Link>
        </Reveal>
      </section>
    </div>
  );
}