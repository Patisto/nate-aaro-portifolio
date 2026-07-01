import { Link } from 'react-router-dom';

export default function Contact() {
  const contacts = [
    { label: 'Email', value: 'mwayanganaaron@gmail.com', href: 'mailto:mwayanganaaron@gmail.com' },
    { label: 'WhatsApp', value: '+265 000 000 000', href: 'https://wa.me/265000000000' },
    { label: 'Instagram', value: '@Nate_aaro', href: 'https://instagram.com/nate_aaro' },
    { label: 'Facebook', value: 'Nate Aaro', href: 'https://facebook.com' },
    { label: 'TikTok', value: '@nate_aaro', href: 'https://tiktok.com/@nate_aaro' },
    { label: 'Location', value: 'Blantyre, Malawi', href: null }
  ];

  return (
    <div>
      <section style={{ padding: '72px 0 64px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-label"><span className="line" /><span className="timecode">Reach out</span></div>
          <h1 style={{ marginBottom: 16 }}>Let's connect.</h1>
          <p style={{ fontSize: '1.05rem', maxWidth: 480 }}>
            Ready to book, or just want to explore an idea? Reach out on any channel — I usually respond within a few hours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div>
            <h2 style={{ marginBottom: 28 }}>Contact channels.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {contacts.map((c) => (
                <div key={c.label} className="card" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <span className="timecode">{c.label}</span>
                  {c.href
                    ? <a href={c.href} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)', fontWeight: 500 }}>{c.value}</a>
                    : <span style={{ color: 'var(--muted)' }}>{c.value}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ marginBottom: 28 }}>Ready to book?</h2>
            <p style={{ marginBottom: 28 }}>
              If you already know what you need — an event, a product shoot, a monthly content plan — the fastest path is the booking form. You'll get a reference number and a response within 24 hours.
            </p>
            <Link to="/booking" className="btn btn-primary">Fill out the booking form</Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 720px) {
          section .container { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
