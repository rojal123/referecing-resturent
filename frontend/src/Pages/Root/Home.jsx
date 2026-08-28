import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import useReveal from '../../hooks/useReveal.js';
import './home.css';
import imageHero from '../../assets/hero-kitchen.png';
import TagliatellealRagu from '../../assets/8.png';
import BurrataCaprese from '../../assets/6.png';
import TiramisudellaCasa from '../../assets/13.png';

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
    role: 'Regular since 2022',
    rating: 5,
    comment:
      "The tagliatelle al ragu tasted like it came straight from a nonna's kitchen. Absolutely worth the trip.",
  },
  {
    id: 'fallback-2',
    full_name: 'Rajesh T.',
    role: 'Food blogger, Kathmandu Bites',
    rating: 5,
    comment:
      "Cozy atmosphere, attentive staff, and the burrata caprese was the best I've had in Kathmandu.",
  },
  {
    id: 'fallback-3',
    full_name: 'Emma L.',
    role: 'Guest',
    rating: 4,
    comment: 'Lovely evening out. The tiramisu alone is reason enough to come back.',
  },
];

const FEATURES = [
  {
    title: 'Pasta made fresh daily',
    desc: 'Every morning before the doors open, our kitchen rolls pasta by hand — the same way it always has.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z"/><path d="M8 12h8M12 8v8"/></svg>
    ),
  },
  {
    title: 'Seasonal tasting menu',
    desc: 'Built around what local growers bring us — the menu shifts with the seasons.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3v8a3 3 0 003 3v7M6 3v8M9 3v8M18 3c-2 1-3 3-3 6s1 4 3 4v8"/></svg>
    ),
  },
  {
    title: 'Open six nights a week',
    desc: 'Dinner service from 5 PM, closed Mondays. Reservations recommended on weekends.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
    ),
  },
];

const DISH_PREVIEWS = [
  {
    name: 'Tagliatelle al Ragu',
    price: '$24',
    desc: 'Hand-rolled pasta, six-hour beef ragu, a whisper of nutmeg.',
    image: TagliatellealRagu,
  },
  {
    name: 'Burrata Caprese',
    price: '$16',
    desc: 'Creamy burrata, heirloom tomatoes, torn basil, Sicilian oil.',
    image: BurrataCaprese,
  },
  {
    name: 'Tiramisu della Casa',
    price: '$11',
    desc: 'Mascarpone, espresso-soaked savoiardi, a dusting of cocoa.',
    image: TiramisudellaCasa,
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
      {/* HERO — unchanged */}
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

      {/* MARQUEE — unchanged */}
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

      {/* FEATURE BAR */}
      <section className="features-bar">
        <div className="wrap features-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} className="feature-item" delay={i * 80}>
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="section story-section" id="kitchen">
        <div className="wrap story-grid">
          <Reveal className="story-photo">
            <div className="story-photo-frame">
              <img src={TagliatellealRagu} alt="Rustic Italian kitchen" />
            </div>
            <div className="story-stat-card">
              <div className="story-stat-number">12</div>
              <div className="story-stat-label">Years of Cooking</div>
            </div>
          </Reveal>
          <Reveal className="story-copy" delay={100}>
            <span className="eyebrow-bf">Our Story</span>
            <h2>Ingredients first, everything else second.</h2>
            <p>
              Our menu changes with the seasons, guided by what local growers
              bring to our kitchen door. It is a dialogue between Italian
              heritage and the rich terroir of the Kathmandu valley.
            </p>
            <Link to="/about" className="story-link">
              Read Our Story <span className="how-arrow">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* MENU PREVIEW */}
      <section className="section menu-preview-section">
        <div className="wrap">
          <Reveal className="menu-preview-header section-header">
            <span className="eyebrow-bf">From Our Kitchen</span>
            <h2>A taste of what&apos;s on the table</h2>
            <p className="section-lead-bf">
              A small selection from our seasonal menu. Each dish is made to
              order with ingredients sourced within fifty kilometres.
            </p>
          </Reveal>

          <div className="menu-preview-grid">
            {DISH_PREVIEWS.map((dish, i) => (
              <Reveal key={dish.name} className="dish-preview-card" delay={i * 90}>
                <img src={dish.image} alt={dish.name} className="dish-preview-img" />
                <div className="dish-preview-body">
                  <div className="dish-preview-row">
                    <h3>{dish.name}</h3>
                    <span className="dish-preview-price">{dish.price}</span>
                  </div>
                  <p className="dish-preview-desc">{dish.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-section">
        <svg className="quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M7 11c0-3 2-5 5-5M7 11a4 4 0 004 4v3a7 7 0 01-4-2M17 11c0-3 2-5 5-5" />
        </svg>
        <Reveal as="blockquote" className="quote-text">
          &ldquo;We never set out to be a restaurant. We set out to keep the
          table set, and the door open, and the pasta warm — and somehow
          that became a place people keep coming back to.&rdquo;
        </Reveal>
        <p className="quote-attribution">Founder, Tavola</p>
      </section>

      {/* REVIEWS */}
      <section className="section reviews-section">
        <div className="wrap">
          <Reveal className="section-header">
            <span className="eyebrow-bf">Kind Words</span>
            <h2>What our guests say</h2>
          </Reveal>

          <div className="review-grid">
            {topReviews.map((r, i) => (
              <Reveal key={r.id} className="review-card" delay={i * 90}>
                <Stars value={r.rating} />
                <p className="review-comment">&ldquo;{r.comment}&rdquo;</p>
                <strong className="review-name">{r.full_name}</strong>
                {r.role && <span className="review-role">{r.role}</span>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FIND US */}
      <section className="findus-section">
        <div className="wrap findus-grid">
          <Reveal className="findus-copy">
            <span className="eyebrow-bf findus-eyebrow">Find Us</span>
            <h2>The table is set. Are you coming?</h2>
            <div className="findus-detail">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
              Thamel, Kathmandu
            </div>
            <div className="findus-detail">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              Tue&ndash;Sun 5 PM&ndash;10:30 PM &middot; Closed Mon
            </div>
            <div className="findus-btn-group">
              <Link to="/booking" className="btn-pill btn-pill-filled">
                Book a Table
              </Link>
              <Link to="/contact" className="btn-pill btn-pill-outline">
                Contact Us
              </Link>
            </div>
          </Reveal>
          <Reveal className="findus-photo" delay={100}>
            <div className="findus-photo-frame">
              <img src={TiramisudellaCasa} alt="Tavola dining room" />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}