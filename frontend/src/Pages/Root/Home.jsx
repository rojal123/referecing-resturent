import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import useReveal from '../../hooks/useReveal.js';
import './home.css';
import imageHero from "../../assets/hero-kitchen.png";

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

const FALLBACK_REVIEWS = [
  { id: 'fallback-1', full_name: 'Sarah M.', rating: 5, comment: 'The tagliatelle al ragu tasted like it came straight from a nonna\'s kitchen. Absolutely worth the trip.' },
  { id: 'fallback-2', full_name: 'Rajesh T.', rating: 5, comment: 'Cozy atmosphere, attentive staff, and the burrata caprese was the best I\'ve had in Kathmandu.' },
  { id: 'fallback-3', full_name: 'Emma L.', rating: 4, comment: 'Lovely evening out. The tiramisu alone is reason enough to come back.' }
];

function Stars({ value }) {
  return (
    <span className="review-stars">
      {'\u2605'.repeat(value)}{'\u2606'.repeat(5 - value)}
    </span>
  );
}

function Avatar({ name }) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  return <div className="review-avatar">{initial}</div>;
}

export default function Home() {
  const [dishes, setDishes] = useState(FALLBACK_DISHES);
  const [topReviews, setTopReviews] = useState(FALLBACK_REVIEWS);

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

  useEffect(() => {
    api.get('/reviews')
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data?.items || res.data?.data || []);
        const top = [...data]
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 3);
        if (top.length > 0) setTopReviews(top);
      })
      .catch(() => {
        // keep FALLBACK_REVIEWS if the backend can't be reached
      });
  }, []);

  return (
    <div>
    <section className="hero">
      <img
      src={imageHero}
      alt="Hero Kitchen"
      className="hero-bg"
      />
  <div className="hero-scrim" />
  <div className="wrap hero-inner">
    <h1 className="hero-huge hero-fade-2">
      Slow food, served with intent.
    </h1>
    <p className="hero-fade-3 hero-subtitle">
      A seasonal Italian kitchen rooted in Kathmandu. We believe in the
      slow art of pasta making and the deliberate sourcing of local
      ingredients.
    </p>

    <div className="hero-fade-4 hero-btn-group">
      <Link to="/booking" className="btn-pill btn-pill-filled">
        Book a Table
      </Link>
      <Link to="/order" className="btn-pill btn-pill-outline">
        Order Ahead
      </Link>
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
                <div className="how-circle">0{i + 1}</div>
                <h3>{item.t}</h3>
                <p>{item.d}</p>
                <Link to={item.to} className="how-link">Go &rarr;</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TOP REVIEWS */}
      <section className="section">
        <div className="wrap">
          <Reveal style={{ textAlign: 'center' }}>
            <span className="eyebrow">Guest Reviews</span>
            <h2 style={{ marginBottom: 40 }}>What people are saying.</h2>
          </Reveal>

          <div className="review-grid">
            {topReviews.map((r) => (
              <Reveal key={r.id} className="review-card">
                <Avatar name={r.full_name} />
                <Stars value={r.rating} />
                <strong className="review-name">{r.full_name}</strong>
                <p className="review-comment">&ldquo;{r.comment}&rdquo;</p>
              </Reveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/menu#reviews" className="how-link">Read All Reviews &rarr;</Link>
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