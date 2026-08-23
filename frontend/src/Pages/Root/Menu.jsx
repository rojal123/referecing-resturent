import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api.js';
import useReveal from '../../hooks/useReveal.js';
import './menu.css';

import imageBruschetta from '../../assets/5.png';
import imageBurrata from '../../assets/6.png';
import imageAntipasti from '../../assets/3.png';
import imageArancini from '../../assets/7.png';
import imageRagu from '../../assets/8.png';
import imageCacioPepe from '../../assets/9.png';
import imageGnocchi from '../../assets/10.png';
import imageFish from '../../assets/11.png';
import imageCutlet from '../../assets/12.png';
import imageTiramisu from '../../assets/13.png';
import imagePannaCotta from '../../assets/14.png';
import imageHero from '../../assets/hero-kitchen.png';

// Shown immediately and used whenever the API is unreachable or returns
// nothing, so the page never looks broken while the backend is down.
const FALLBACK_MENU = [
  {
    id: 'fb-1',
    name: 'Tomato & Basil Bruschetta',
    category: 'Starters',
    price: 12,
    description: 'Toasted sourdough, heirloom tomatoes, garlic, torn basil.',
    is_available: true,
    image: imageBruschetta,
  },
  {
    id: 'fb-2',
    name: 'Burrata & Stone Fruit',
    category: 'Starters',
    price: 16,
    description: 'Creamy burrata, peaches, wild rocket, honey-thyme dressing.',
    is_available: true,
    image: imageBurrata,
  },
  {
    id: 'fb-3',
    name: 'Antipasti al Tagliere',
    category: 'Starters',
    price: 22,
    description: 'Cured meats, marinated olives, grilled vegetables, focaccia.',
    is_available: true,
    image: imageAntipasti,
  },
  {
    id: 'fb-4',
    name: 'Crispy Arancini',
    category: 'Starters',
    price: 13,
    description: 'Saffron risotto balls, fried sage, smoked aioli.',
    is_available: true,
    image: imageArancini,
  },
  {
    id: 'fb-5',
    name: 'Tagliatelle al Ragu',
    category: 'Mains',
    price: 24,
    description: 'Hand-rolled pasta, six-hour beef ragu, a whisper of nutmeg.',
    is_available: true,
    image: imageRagu,
  },
  {
    id: 'fb-6',
    name: 'Cacio e Pepe',
    category: 'Mains',
    price: 21,
    description: 'Fresh tonnarelli, pecorino, cracked black pepper.',
    is_available: true,
    image: imageCacioPepe,
  },
  {
    id: 'fb-7',
    name: 'Pesto Gnocchi',
    category: 'Mains',
    price: 20,
    description: 'Potato gnocchi, basil pesto, pine nuts, parmesan.',
    is_available: true,
    image: imageGnocchi,
  },
  {
    id: 'fb-8',
    name: 'Whole Roasted Branzino',
    category: 'Mains',
    price: 32,
    description: 'Market fish, cherry tomatoes, lemon, rosemary, olive oil.',
    is_available: true,
    image: imageFish,
  },
  {
    id: 'fb-9',
    name: 'Milanese Cutlet',
    category: 'Mains',
    price: 26,
    description: 'Breaded veal, wild rocket, shaved parmesan, lemon.',
    is_available: true,
    image: imageCutlet,
  },
  {
    id: 'fb-10',
    name: 'Tiramisu della Casa',
    category: 'Desserts',
    price: 11,
    description: 'Mascarpone, espresso-soaked savoiardi, a dusting of cocoa.',
    is_available: true,
    image: imageTiramisu,
  },
  {
    id: 'fb-11',
    name: 'Panna Cotta ai Frutti di Bosco',
    category: 'Desserts',
    price: 10,
    description: 'Vanilla-bean panna cotta, mixed berry compote.',
    is_available: true,
    image: imagePannaCotta,
  },
];

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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function PlateIcon() {
  return (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export default function Menu() {
  const [items, setItems] = useState(FALLBACK_MENU);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const usedFallback = useRef(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get('/menu')
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          setItems(
            data.map((item) => ({
              ...item,
              image: item.image_url || null,
            }))
          );
        } else {
          usedFallback.current = true;
        }
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        usedFallback.current = true;
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return ['All', ...unique];
  }, [items]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      if (item.is_available === false) return false;
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query)
      );
    });
  }, [items, search, activeCategory]);

  const groupedItems = useMemo(() => {
    const groups = [];
    const order = activeCategory === 'All' ? categories.filter((c) => c !== 'All') : [activeCategory];

    order.forEach((category) => {
      const groupItems = visibleItems.filter((item) => item.category === category);
      if (groupItems.length > 0) groups.push({ category, items: groupItems });
    });

    return groups;
  }, [visibleItems, categories, activeCategory]);

  return (
    <div className="menu-page">
      {/* HERO */}
      <section className="menu-hero">
        <img src={imageHero} alt="Tavola kitchen" className="menu-hero__bg" />
        <div className="menu-hero__scrim" />
        <div className="wrap menu-hero__inner">
          <p className="eyebrow menu-hero__eyebrow">Our Menu</p>
          <h1 className="menu-hero__title">Seasonal Italian, made by hand.</h1>
          <p className="menu-hero__subtitle">
            Pasta rolled daily, ingredients sourced within fifty kilometres, and
            a wine list built to match. Browse what's on the table this week.
          </p>
        </div>
      </section>

      <main className="wrap menu-main">
        {/* CONTROLS */}
        <Reveal className="menu-controls">
          <div className="menu-search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search the menu"
            />
            {search && (
              <button
                type="button"
                className="menu-search__clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="menu-tabs" role="tablist" aria-label="Menu categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={`menu-tab ${activeCategory === category ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>

        {status === 'error' && (
          <p className="menu-notice">
            We couldn't reach the kitchen just now, so here's our regular
            menu — prices and availability may vary.
          </p>
        )}

        {/* MENU GROUPS */}
        {groupedItems.length === 0 ? (
          <div className="menu-empty">
            <PlateIcon />
            <h3>No dishes match your search.</h3>
            <p>Try a different keyword or browse another category.</p>
            {(search || activeCategory !== 'All') && (
              <button
                type="button"
                className="menu-btn menu-btn--outline"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          groupedItems.map((group, groupIndex) => (
            <section className="menu-category" key={group.category}>
              <Reveal as="div" className="menu-category__heading" delay={groupIndex * 60}>
                <h2>{group.category}</h2>
                <div className="menu-category__rule" />
              </Reveal>

              <div className="menu-grid">
                {group.items.map((item, i) => (
                  <Reveal as="article" className="menu-card" delay={i * 70} key={item.id}>
                    <div className="menu-card__image-wrap">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="menu-card__image" />
                      ) : (
                        <div className="menu-card__image menu-card__image--placeholder">
                          <PlateIcon />
                        </div>
                      )}
                    </div>
                    <div className="menu-card__body">
                      <div className="menu-card__title-row">
                        <h3>{item.name}</h3>
                        <span className="menu-card__price">${Number(item.price).toFixed(2)}</span>
                      </div>
                      {item.description && <p className="menu-card__desc">{item.description}</p>}
                      <Link to="/order" className="menu-card__cta">
                        Order this dish
                      </Link>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          ))
        )}

        <Reveal className="menu-footer-cta">
          <h2>Ready to eat?</h2>
          <p>Order ahead for pickup or reserve a table for tonight.</p>
          <div className="menu-footer-cta__buttons">
            <Link to="/order" className="menu-btn menu-btn--filled">
              Start an Order
            </Link>
            <Link to="/booking" className="menu-btn menu-btn--outline">
              Book a Table
            </Link>
          </div>
        </Reveal>
      </main>
    </div>
  );
}