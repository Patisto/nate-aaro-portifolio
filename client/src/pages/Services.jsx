import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.getServices().then(setServices).catch(() => {});
  }, []);

  return (
    <div>
      <section style={{ padding: '72px 0 56px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-label"><span className="line" /><span className="timecode">What I offer</span></div>
          <h1 style={{ marginBottom: 16 }}>Services.</h1>
          <p style={{ maxWidth: 520, fontSize: '1.05rem' }}>
            From one-day shoots to monthly content subscriptions — built around your business, not a template.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {services.map((s) => (
              <div key={s.id} className="card" style={{ padding: 32 }}>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ marginBottom: 10 }}>{s.title}</h3>
                <p style={{ marginBottom: 20 }}>{s.description}</p>
                {s.starting_price && (
                  <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {s.starting_price}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly packages */}
      <section className="section">
        <div className="container">
          <div className="section-label"><span className="line" /><span className="timecode">Monthly packages</span></div>
          <h2 style={{ marginBottom: 40 }}>Retainer plans for businesses.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { tier: 'Bronze', items: ['4 edited videos', '20 photos', 'Social posting'], price: 'MWK 150,000/mo' },
              { tier: 'Silver', items: ['8 edited videos', '40 photos', 'Social posting', 'Monthly report'], price: 'MWK 250,000/mo', featured: true },
              { tier: 'Gold', items: ['Unlimited shoot days', 'Weekly reels', 'Event coverage', 'Priority editing', 'Monthly report'], price: 'MWK 500,000/mo' }
            ].map((pkg) => (
              <div
                key={pkg.tier}
                className="card"
                style={{
                  padding: 32,
                  borderColor: pkg.featured ? 'var(--gold)' : 'var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {pkg.featured && (
                  <div style={{
                    position: 'absolute', top: 16, right: -24,
                    background: 'var(--gold)', color: '#0a0a0c',
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em',
                    padding: '4px 36px', transform: 'rotate(45deg)'
                  }}>POPULAR</div>
                )}
                <div className="timecode" style={{ marginBottom: 8 }}>{pkg.tier}</div>
                <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', color: 'var(--gold)', marginBottom: 20 }}>
                  {pkg.price}
                </div>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                  {pkg.items.map((item) => (
                    <li key={item} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--gold)' }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/booking" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <h2 style={{ marginBottom: 16 }}>Not sure which package?</h2>
          <p style={{ maxWidth: 440, margin: '0 auto 32px' }}>Send a message and I'll put together a custom quote based on your needs.</p>
          <Link to="/contact" className="btn btn-primary">Get a custom quote</Link>
        </div>
      </section>
    </div>
  );
}
