import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import imageHero from '../../assets/hero-kitchen.png';
import imageKitchen from '../../assets/rustic-luxury-italian-kitchen-designs-ideas.jpg';

const table = [
  { n: '01', t: 'Seasonal', d: 'The menu follows the harvest, not the calendar — what growers bring us shapes what we cook.' },
  { n: '02', t: 'Direct', d: 'We buy from farms and fishers we can name, not distributors we can\u2019t.' },
  { n: '03', t: 'Unhurried', d: 'Pasta is rolled by hand each morning. Good food takes the time it takes.' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function About() {
  return (
    <div className="mr-about">
      {/* HERO */}
      <section className="mr-hero">
        <img src={imageHero} alt="" className="mr-hero-bg" />
        <div className="mr-hero-scrim" />
        <div className="mr-hero-vignette" />
        <motion.div
          className="wrap mr-hero-inner"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span variants={fadeInUp} className="mr-eyebrow mr-eyebrow-cream">
            About Tavola
          </motion.span>
          <motion.h1 variants={fadeInUp} className="mr-hero-title">
            A small kitchen with
            <br />
            a long memory.
          </motion.h1>
          <motion.p variants={fadeInUp} className="mr-hero-desc">
            Tavola began as a family table before it became a restaurant. We
            still cook the way we did on day one: a short seasonal menu,
            produce from people we know, and enough time to do it properly.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/booking" className="mr-btn">
              Reserve a Table
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1L12 2z" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* STORY */}
      <section className="mr-story">
        <div className="wrap mr-story-grid">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <span className="mr-eyebrow mr-eyebrow-dark">Our Story</span>
            <h2 className="mr-story-title">
              Ingredients first,
              <br />
              everything else second.
            </h2>
            <p className="mr-story-desc">
              We began with a simple belief: the most memorable meals are
              made with care, curiosity, and a real respect for the
              ingredient. Every service at Tavola moves with the rhythm of
              the season — precise in the kitchen, unhurried at the table.
            </p>
          </motion.div>
          <motion.div
            className="mr-story-photo"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            <img src={imageKitchen} alt="A chef plating a dish at Tavola" />
          </motion.div>
        </div>
      </section>

      {/* THE TABLE */}
      <section className="mr-table-section">
        <div className="wrap">
          <motion.span
            className="mr-eyebrow mr-eyebrow-dark mr-table-eyebrow"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            The Table
          </motion.span>

          <motion.div
            className="mr-table-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {table.map((v) => (
              <motion.div key={v.n} variants={fadeInUp} className="mr-table-item">
                <div className="mr-table-rule" />
                <span className="mr-table-num">{v.n}</span>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="mr-cta">
        <motion.div
          className="wrap mr-cta-inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.span variants={fadeInUp} className="mr-eyebrow mr-eyebrow-cream">
            An Evening Awaits
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mr-cta-title">
            Come hungry. Leave unhurried.
          </motion.h2>
          <motion.p variants={fadeInUp} className="mr-cta-sub">
            Dinner Tuesday&ndash;Sunday &middot; 5&ndash;10:30 PM
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link to="/booking" className="mr-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              Make a Reservation
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <style>{`
        .mr-about {
          --mr-maroon: #6E1423;
          --mr-maroon-dark: #3F0E17;
          --mr-cream: #FBF6EC;
          --mr-cream-2: #F5EEE1;
          --mr-blush: #F3D9D9;
          --mr-ink: #2A1B14;
          --mr-ink-soft: #6b5645;
          --mr-gold: #B08968;
          --mr-line: rgba(110, 20, 35, 0.14);

          font-family: var(--font-body, Georgia, serif);
          overflow-x: hidden;
        }

        .mr-about h1, .mr-about h2, .mr-about h3 {
          font-family: var(--font-display, Georgia, serif);
          font-weight: 400;
          margin: 0;
        }

        .wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .mr-eyebrow {
          display: block;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 1.2rem;
        }
        .mr-eyebrow-dark { color: var(--mr-maroon); }
        .mr-eyebrow-cream { color: rgba(251, 246, 236, 0.75); }

        .mr-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 999px;
          background: var(--mr-cream);
          color: var(--mr-maroon-dark);
          font-family: var(--font-mono, monospace);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
        }
        .mr-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(0,0,0,0.28);
        }

        /* HERO */
        .mr-hero {
          position: relative;
          min-height: 92vh;
          min-height: 92dvh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .mr-hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8);
        }
        .mr-hero-scrim {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 75% at 55% 38%, transparent 0%, rgba(10,5,6,0.45) 65%, rgba(6,3,4,0.88) 100%);
        }
        .mr-hero-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10,5,6,0) 0%, rgba(10,5,6,0.15) 35%, rgba(8,4,5,0.82) 78%, rgba(6,3,4,0.96) 100%);
        }
        .mr-hero-inner {
          position: relative;
          z-index: 1;
          padding: 0 0px 90px 0px ;
          max-width: 760px;
        }
        .mr-hero-title {
          font-size: clamp(2.6rem, 6vw, 4.6rem);
          line-height: 1.08;
          color: var(--mr-cream);
          margin-bottom: 1.4rem;
        }
        .mr-hero-desc {
          font-family: var(--font-body, Georgia, serif);
          font-size: 1.08rem;
          line-height: 1.7;
          color: rgba(251, 246, 236, 0.82);
          max-width: 480px;
          margin: 0 0 2rem;
        }

        /* STORY */
        .mr-story {
          background: var(--mr-cream);
          padding: 100px 0;
        }
        .mr-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .mr-story-title {
          font-size: clamp(1.9rem, 3.2vw, 2.7rem);
          color: var(--mr-ink);
          line-height: 1.15;
          margin-bottom: 1.4rem;
        }
        .mr-story-desc {
          color: var(--mr-ink-soft);
          font-size: 1.02rem;
          line-height: 1.75;
          max-width: 460px;
        }
        .mr-story-photo {
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 4 / 3;
        }
        .mr-story-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* THE TABLE */
        .mr-table-section {
          background: var(--mr-cream-2);
          border-top: 1px solid var(--mr-line);
          padding: 90px 0 100px;
        }
        .mr-table-eyebrow { margin-bottom: 2.6rem; }
        .mr-table-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .mr-table-rule {
          height: 1px;
          background: var(--mr-line);
          margin-bottom: 1.4rem;
        }
        .mr-table-num {
          display: block;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--mr-gold);
          margin-bottom: 0.7rem;
        }
        .mr-table-item h3 {
          font-size: 1.5rem;
          color: var(--mr-ink);
          margin-bottom: 0.7rem;
        }
        .mr-table-item p {
          color: var(--mr-ink-soft);
          line-height: 1.65;
          font-size: 0.96rem;
          margin: 0;
        }

        /* CTA */
        .mr-cta {
          background: var(--mr-maroon-dark);
          padding: 130px 24px;
          text-align: center;
        }
        .mr-cta-inner { max-width: 640px; margin: 0 auto; }
        .mr-cta-title {
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: var(--mr-cream);
          line-height: 1.15;
          margin-bottom: 1.2rem;
        }
        .mr-cta-sub {
          font-family: var(--font-mono, monospace);
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          color: rgba(251, 246, 236, 0.7);
          margin: 0 0 2.2rem;
        }

        /* RESPONSIVE */
        @media (max-width: 860px) {
          .mr-story-grid { grid-template-columns: 1fr; gap: 40px; }
          .mr-story-photo { order: -1; }
          .mr-table-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; gap: 32px; }
          .mr-story, .mr-table-section { padding-top: 72px; padding-bottom: 72px; }
          .mr-cta { padding: 96px 24px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mr-about * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}