import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import useReveal from '../../hooks/useReveal.js';
import './home.css';
import imageHero from '../../assets/hero-kitchen.png';
import imageKitchen from '../../assets/rustic-luxury-italian-kitchen-designs-ideas.jpg';

function Reveal({ as: Tag = 'div', className = '', style, children, delay = 0 }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}

const FALLBACK_DISHES = [
  'Burrata Caprese',
  'Tagliatelle al Ragu',
  'Pan-Seared Salmon',
  'Wild Mushroom Arancini',
  'Margherita Pizza',
  'Tiramisu',
  'Panna Cotta',
];

const FALLBACK_REVIEWS = [
  {
    id: 'fallback-1',
    full_name: 'Sarah M.',
    rating: 5,
    comment:
      "The tagliatelle al ragu tasted like it came straight from a nonna's kitchen. Absolutely worth the trip.",
  },
  {
    id: 'fallback-2',
    full_name: 'Rajesh T.',
    rating: 5,
    comment:
      "Cozy atmosphere, attentive staff, and the burrata caprese was the best I've had in Kathmandu.",
  },
  {
    id: 'fallback-3',
    full_name: 'Emma L.',
    rating: 4,
    comment: 'Lovely evening out. The tiramisu alone is reason enough to come back.',
  },
];

function Stars({ value }) {
  return (
    <span className="review-stars" aria-label={`${value} out of 5 stars`}>
      {'\u2605'.repeat(value)}
      {'\u2606'.repeat(5 - value)}
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
  const heroRef = useRef(null);

  useEffect(() => {
    api
      .get('/menu')
      .then((res) => {
        const names = res.data.map((item) => item.name);
        if (names.length > 0) setDishes(names);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    api
      .get('/reviews')
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.items || res.data?.data || [];
        const top = [...data]
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 3);
        if (top.length > 0) setTopReviews(top);
      })
      .catch(() => {});
  }, []);

  // Subtle parallax on hero background
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        const bg = hero.querySelector('.hero-bg');
        if (bg) bg.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.08)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <img src={imageHero} alt="Tavola kitchen" className="hero-bg" />
        <div className="hero-scrim" />
        <div className="wrap hero-inner">
          <p className="hero-eyebrow hero-fade-1">Italian Kitchen · Kathmandu</p>
          <h1 className="hero-huge hero-fade-2">
            Slow food,
            <br />
            served with intent.
          </h1>
          <p className="hero-subtitle hero-fade-3">
            A seasonal Italian kitchen rooted in Kathmandu. We believe in the
            slow art of pasta making and the deliberate sourcing of local
            ingredients.
          </p>
          <div className="hero-btn-group hero-fade-4">
            <Link to="/booking" className="btn-pill btn-pill-filled">
              Book a Table
            </Link>
            <Link to="/order" className="btn-pill btn-pill-outline">
              Order Ahead
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...dishes, ...dishes].map((d, i) => (
            <span key={i} className="marquee-item">
              {d}
              <span className="dot">&bull;</span>
            </span>
          ))}
        </div>
      </div>

      {/* KITCHEN / INGREDIENTS */}
      <section className="section kitchen-section" id="kitchen">
        <div className="wrap kitchen-grid">
          <Reveal className="kitchen-copy">
            <span className="eyebrow">Our Kitchen</span>
            <h2>Ingredients first, everything else second.</h2>
            <p>
              Our menu changes with the seasons, guided by what local growers
              bring to our kitchen door. It is a dialogue between Italian
              heritage and the rich terroir of the Kathmandu valley.
            </p>
            <Link to="/about" className="btn btn-outline kitchen-cta">
              Read Our Story
            </Link>
          </Reveal>
          <Reveal className="kitchen-photo" delay={120}>
            <div className="kitchen-photo-frame">
              <img
                src={imageKitchen}
                alt="Rustic Italian kitchen"
                className="kitchen-photo-img"
              />
              <div className="kitchen-photo-accent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE PROCESS */}
      <section className="section process-section">
        <div className="wrap">
          <Reveal className="section-header">
            <span className="eyebrow">Experience</span>
            <h2>The Process</h2>
            <p className="section-lead">
              From first glance at the menu to the last bite — three simple steps.
            </p>
          </Reveal>

          <div className="how-grid">
            {[
              {
                t: 'Browse',
                d: 'Explore our seasonal offerings and signature classics.',
                to: '/menu',
              },
              {
                t: 'Reserve',
                d: 'Pick a date, time, and party size — we hold the table for you.',
                to: '/booking',
              },
              {
                t: 'Order',
                d: 'Personalize your meal and collect it right on time.',
                to: '/order',
              },
            ].map((item, i) => (
              <Reveal key={item.t} className="how-card" delay={i * 100}>
                <div className="how-circle">0{i + 1}</div>
                <h3>{item.t}</h3>
                <p>{item.d}</p>
                <Link to={item.to} className="how-link">
                  Go <span className="how-arrow">&rarr;</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TOP REVIEWS */}
      <section className="section reviews-section">
        <div className="wrap">
          <Reveal className="section-header">
            <span className="eyebrow">Guest Reviews</span>
            <h2>What people are saying.</h2>
          </Reveal>

          <div className="review-grid">
            {topReviews.map((r, i) => (
              <Reveal key={r.id} className="review-card" delay={i * 90}>
                <Avatar name={r.full_name} />
                <Stars value={r.rating} />
                <strong className="review-name">{r.full_name}</strong>
                <p className="review-comment">&ldquo;{r.comment}&rdquo;</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="reviews-footer">
            <Link to="/menu#reviews" className="how-link">
              Read All Reviews <span className="how-arrow">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <span className="cta-watermark" aria-hidden="true">
          EST. 2014
        </span>
        <Reveal className="cta-inner">
          <span className="eyebrow">Reserve Your Evening</span>
          <h2>The table is set. Are you coming?</h2>
          <p className="cta-lead">
            Join us for an evening of careful cooking and unhurried hospitality.
          </p>
          <Link to="/booking" className="btn btn-primary cta-btn">
            Book a Table Now
          </Link>
        </Reveal>
      </section>
    </div>
  );
}