import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

function TimecodeTicker() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), 1000 / 24);
    return () => clearInterval(id);
  }, []);
  const frames = t % 24;
  const totalSeconds = Math.floor(t / 24);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return <span>{`00:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`}</span>;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const id = setTimeout(() => setOpen(true), 150);
    api.getProjects().then((p) => setProjects(p.slice(0, 4))).catch(() => {});
    api.getTestimonials().then((t) => setTestimonials(t.slice(0, 3))).catch(() => {});
    return () => clearTimeout(id);
  }, []);

  return (
    <div>
      {/* HERO — cinematic letterbox reveal */}
      <section style={{ position: 'relative', height: '92vh', minHeight: 560, overflow: 'hidden', display: 'flex', alignItems: 'center', background: 'radial-gradient(ellipse at 50% 30%, #1c1a16 0%, #0a0a0c 70%)' }}>
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: open ? '0%' : '50%',
            background: '#000',
            transition: 'height 0.9s cubic-bezier(.77,0,.18,1)',
            zIndex: 5
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: open ? '0%' : '50%',
            background: '#000',
            transition: 'height 0.9s cubic-bezier(.77,0,.18,1)',
            zIndex: 5
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="timecode" style={{ marginBottom: 18, opacity: open ? 1 : 0, transition: 'opacity 0.6s ease 0.5s' }}>
            REC ● <TimecodeTicker />
          </div>
          <h1 style={{ opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.7s ease 0.55s' }}>
            Cinematic Videos<br />
            Photography<br />
            <span style={{ color: 'var(--gold)' }}>Content Creation.</span>
          </h1>
          <p style={{ maxWidth: 480, marginTop: 24, fontSize: '1.05rem', opacity: open ? 1 : 0, transition: 'opacity 0.7s ease 0.7s' }}>
            Nate_Aaro creates moments that move — weddings, brand films, and stories shot to be felt, not just watched.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 36, opacity: open ? 1 : 0, transition: 'opacity 0.7s ease 0.85s', flexWrap: 'wrap' }}>
            <Link to="/booking" className="btn btn-primary">Book Now</Link>
            <Link to="/portfolio" className="btn btn-ghost">View Portfolio</Link>
          </div>
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="container">
          <div className="section-label"><span className="line" /><span className="timecode">What I shoot</span></div>
          <h2 style={{ marginBottom: 40 }}>Built for every kind of story.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {['Weddings', 'Events', 'Corporate', 'Product Videos', 'Music Videos', 'Photography'].map((c) => (
              <Link key={c} to={`/portfolio?category=${encodeURIComponent(c)}`} className="card" style={{ padding: 24, display: 'block' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{c}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-label"><span className="line" /><span className="timecode">Recent frames</span></div>
            <h2 style={{ marginBottom: 40 }}>Featured work.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {projects.map((p) => (
                <Link key={p.id} to={`/portfolio/${p.id}`} className="card" style={{ overflow: 'hidden', display: 'block' }}>
                  <div style={{ aspectRatio: '4/3', background: '#101012', backgroundImage: p.cover_image ? `url(${p.cover_image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ padding: 16 }}>
                    <div className="timecode" style={{ marginBottom: 6 }}>{p.category}</div>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link to="/portfolio" className="btn btn-ghost">See full portfolio</Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-label"><span className="line" /><span className="timecode">Client reels</span></div>
            <h2 style={{ marginBottom: 40 }}>What clients say.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {testimonials.map((t) => (
                <div key={t.id} className="card" style={{ padding: 28 }}>
                  <div style={{ color: 'var(--gold)', marginBottom: 12 }}>{'★'.repeat(t.rating || 5)}</div>
                  <p style={{ color: 'var(--text)', marginBottom: 16 }}>"{t.quote}"</p>
                  <div style={{ fontWeight: 600 }}>{t.client_name}</div>
                  {t.client_role && <div className="timecode" style={{ marginTop: 4 }}>{t.client_role}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: '96px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: 20 }}>Got a moment worth capturing?</h2>
          <p style={{ maxWidth: 480, margin: '0 auto 32px' }}>Tell me about your event or project and I'll get back to you within 24 hours.</p>
          <Link to="/booking" className="btn btn-primary">Start a Booking</Link>
        </div>
      </section>
    </div>
  );
}
