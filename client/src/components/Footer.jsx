import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', padding: '56px 0 28px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 12 }}>
            NATE<span style={{ color: 'var(--gold)' }}>_</span>AARO
          </div>
          <p style={{ maxWidth: 320 }}>
            Turning moments into cinematic masterpieces — where every shot tells a story, and every story feels alive.
          </p>
        </div>

        <div>
          <div className="timecode" style={{ marginBottom: 14 }}>Navigate</div>
          {['Portfolio', 'Services', 'About', 'Booking', 'Contact'].map((l) => (
            <Link key={l} to={`/${l.toLowerCase()}`} style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontSize: '0.9rem' }}>
              {l}
            </Link>
          ))}
        </div>

        <div>
          <div className="timecode" style={{ marginBottom: 14 }}>Connect</div>
          <a href="mailto:mwayanganaaron@gmail.com" style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontSize: '0.9rem' }}>
            mwayanganaaron@gmail.com
          </a>
          <a href="https://instagram.com/nate_aaro" target="_blank" rel="noreferrer" style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontSize: '0.9rem' }}>
            Instagram
          </a>
          <a href="https://wa.me/265000000000" target="_blank" rel="noreferrer" style={{ display: 'block', marginBottom: 8, color: 'var(--muted)', fontSize: '0.9rem' }}>
            WhatsApp
          </a>
        </div>
      </div>

      <div className="container" style={{ marginTop: 44, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <span className="timecode">© {new Date().getFullYear()} NATE_AARO</span>
        <Link to="/track" className="timecode">Track a booking →</Link>
      </div>
    </footer>
  );
}
