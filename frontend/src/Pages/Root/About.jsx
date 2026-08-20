import { motion } from 'framer-motion';

const timeline = [
  { year: '2014', text: 'Tavola opens as a ten-table trattoria on Lakeside Avenue.', icon: '🍷' },
  { year: '2017', text: 'We start sourcing produce directly from three regional farms.', icon: '🌿' },
  { year: '2021', text: 'The dining room is rebuilt around an open kitchen.', icon: '🔥' },
  { year: '2024', text: 'Online booking and advance ordering launch.', icon: '✨' }
];

const values = [
  { t: 'Seasonal', d: 'The menu follows the harvest, not the calendar.' },
  { t: 'Direct', d: 'We buy from farms and fishers we can name.' },
  { t: 'Unhurried', d: 'Good food takes the time it takes.' }
];

// Animation presets
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function About() {
  return (
    <div className="editorial-page">
      {/* Ambient Background Glows */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="wrap hero-wrap"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeInUp} className="eyebrow">About Tavola</motion.span>
          <motion.h1 variants={fadeInUp} className="hero-title">
            A small kitchen with <br />
            <span className="italic-accent">a long memory.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="hero-desc">
            Tavola began as a family table before it became a restaurant. We
            still cook the way we did on day one: a short seasonal menu,
            produce from people we know, and enough time to do it properly.
          </motion.p>
        </motion.div>
      </section>

      {/* Alternating Timeline Section */}
      <section className="story-section">
        <div className="wrap">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="eyebrow">Our Story</span>
            <h2>How we got here</h2>
          </motion.div>

          <div className="timeline-container">
            <div className="timeline-center-line" />
            
            {timeline.map((t, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={t.year}
                  className={`timeline-node ${isEven ? 'node-left' : 'node-right'}`}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="timeline-content glass-card">
                    <span className="timeline-icon">{t.icon}</span>
                    <span className="timeline-year">{t.year}</span>
                    <p className="timeline-text">{t.text}</p>
                  </div>
                  <div className="timeline-dot" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="wrap">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="eyebrow">Our Values</span>
            <h2>What we cook by</h2>
          </motion.div>

          <motion.div 
            className="values-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {values.map((v) => (
              <motion.div key={v.t} variants={fadeInUp} className="value-card glass-card">
                <h3>{v.t}</h3>
                <div className="card-divider" />
                <p>{v.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <style>{`
        /* Global Variables & Resets */
        .editorial-page {
          --bg-color: #0c0c0e;
          --text-main: #f3f3f2;
          --text-muted: #9c9c9c;
          --accent-gold: #cda365;
          --glass-bg: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.08);
          
          background-color: var(--bg-color);
          color: var(--text-main);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        .wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Typography */
        h1, h2, h3 {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-weight: 400;
          margin: 0;
        }

        .eyebrow {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--accent-gold);
          margin-bottom: 1.5rem;
        }

        .italic-accent {
          font-style: italic;
          color: var(--accent-gold);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
        }

        /* Ambient Backgrounds */
        .ambient-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
          pointer-events: none;
        }
        .glow-1 {
          top: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: rgba(205, 163, 101, 0.08);
        }
        .glow-2 {
          top: 40%;
          right: -15%;
          width: 600px;
          height: 600px;
          background: rgba(255, 255, 255, 0.03);
        }

        /* Glassmorphism Utility */
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 180px 0 120px;
          z-index: 1;
        }
        .hero-wrap {
          max-width: 800px;
        }
        .hero-title {
          font-size: clamp(3rem, 6vw, 5.5rem);
          line-height: 1.1;
          margin-bottom: 2rem;
        }
        .hero-desc {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 540px;
        }

        /* Alternating Timeline Section */
        .story-section {
          position: relative;
          padding: 80px 0;
          z-index: 1;
        }

        .timeline-container {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }

        .timeline-center-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--glass-border) 10%, var(--glass-border) 90%, transparent);
        }

        .timeline-node {
          position: relative;
          width: 50%;
          padding: 2rem 0;
        }
        
        .node-left {
          left: 0;
          padding-right: 3rem;
          text-align: right;
        }
        
        .node-right {
          left: 50%;
          padding-left: 3rem;
        }

        .timeline-content {
          padding: 2rem;
          display: inline-block;
          max-width: 400px;
          position: relative;
        }

        .timeline-year {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .timeline-icon {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .timeline-text {
          color: var(--text-muted);
          margin: 0;
          line-height: 1.6;
        }

        .timeline-dot {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          background: var(--accent-gold);
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(205, 163, 101, 0.4);
          transform: translateY(-50%);
        }

        .node-left .timeline-dot { right: -6px; }
        .node-right .timeline-dot { left: -6px; }

        /* Values Section */
        .values-section {
          padding: 100px 0 160px;
          position: relative;
          z-index: 1;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .value-card {
          padding: 3rem 2.5rem;
          text-align: center;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.05);
        }

        .value-card h3 {
          font-size: 1.75rem;
          margin-bottom: 1rem;
        }

        .card-divider {
          width: 40px;
          height: 1px;
          background: var(--accent-gold);
          margin: 0 auto 1.5rem;
        }

        .value-card p {
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 860px) {
          .values-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            margin: 0 auto;
          }

          .timeline-center-line {
            left: 20px;
          }

          .timeline-node {
            width: 100%;
            padding: 1.5rem 0 1.5rem 50px !important;
            left: 0 !important;
            text-align: left !important;
          }

          .timeline-dot {
            left: 14px !important;
            right: auto !important;
          }

          .timeline-content {
            width: 100%;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}