import useReveal from '../../hooks/useReveal.js';

function Reveal({ as: Tag = 'div', className = '', children }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

const timeline = [
  { year: '2014', text: 'Tavola opens as a ten-table trattoria on Lakeside Avenue.' },
  { year: '2017', text: 'We start sourcing produce directly from three regional farms.' },
  { year: '2021', text: 'The dining room is rebuilt around an open kitchen.' },
  { year: '2024', text: 'Online booking and advance ordering launch.' }
];

export default function About() {
  return (
    <div>
      <section className="section" style={{ paddingTop: 90 }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <span className="eyebrow">About Tavola</span>
          <h2>A small kitchen with a long memory.</h2>
          <p style={{ fontSize: '1.05rem' }}>
            Tavola began as a family table before it became a restaurant. We
            still cook the way we did on day one: a short seasonal menu,
            produce from people we know, and enough time to do it properly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Our Story</span>
            <h2 style={{ marginBottom: 40 }}>How we got here</h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {timeline.map((t) => (
              <Reveal
                key={t.year}
                className="timeline-row"
              >
                <span className="timeline-year">{t.year}</span>
                <p style={{ margin: 0 }}>{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ borderBottom: 'none' }}>
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Our Values</span>
            <h2 style={{ marginBottom: 40 }}>What we cook by</h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { t: 'Seasonal', d: 'The menu follows the harvest, not the calendar.' },
              { t: 'Direct', d: 'We buy from farms and fishers we can name.' },
              { t: 'Unhurried', d: 'Good food takes the time it takes.' }
            ].map((v) => (
              <Reveal key={v.t} style={{ padding: 24, border: '1px solid var(--color-line)', borderRadius: 6, background: 'var(--color-panel)' }}>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .timeline-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 24px;
          padding: 22px 0;
          border-top: 1px solid var(--color-line);
        }
        .timeline-row:last-child {
          border-bottom: 1px solid var(--color-line);
        }
        .timeline-year {
          font-family: var(--font-mono);
          color: var(--color-gold);
        }
        @media (max-width: 860px) {
          section .wrap > div[style*="grid-template-columns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
