import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <section style={{ padding: '72px 0 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          <div style={{ paddingBottom: 72 }}>
            <div className="section-label"><span className="line" /><span className="timecode">The director</span></div>
            <h1 style={{ margin: '16px 0 24px' }}>Hi, I'm Aaron<br /><span style={{ color: 'var(--gold)' }}>Nate_Aaro.</span></h1>
            <p style={{ fontSize: '1.05rem', marginBottom: 20 }}>
              I shoot, direct, and edit cinematic visuals — from intimate wedding films to commercial brand content for businesses across Malawi.
            </p>
            <p style={{ marginBottom: 20 }}>
              My approach is simple: I try to understand what the moment actually feels like before I pick up a camera, so that what comes out of post-production feels alive rather than recorded.
            </p>
            <p style={{ marginBottom: 40 }}>
              Whether it's a once-in-a-lifetime event or a monthly content package for your restaurant, I bring the same attention to story and detail to every frame.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/booking" className="btn btn-primary">Work with me</Link>
              <Link to="/portfolio" className="btn btn-ghost">See my work</Link>
            </div>
          </div>

          <div>
            {/* Placeholder portrait — replace with actual photo via CMS */}
            <div style={{
              width: '100%',
              aspectRatio: '3/4',
              background: 'linear-gradient(160deg, #1c1a16, #0a0a0c)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'var(--muted)',
              gap: 8
            }}>
              <span style={{ fontSize: '3rem' }}>🎬</span>
              <span className="timecode">Portrait goes here</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-label"><span className="line" /><span className="timecode">The kit</span></div>
          <h2 style={{ marginBottom: 40 }}>What I shoot with.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {['Sony A7 Series', 'DJI Drone', 'Professional Lighting', 'Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve'].map((gear) => (
              <div key={gear} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>◆</span>
                <span style={{ fontWeight: 500 }}>{gear}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', lineHeight: 1.2, maxWidth: 640, margin: '0 auto 32px', color: 'var(--text)' }}>
            "Turning moments into cinematic masterpieces — where every shot tells a story, and every story feels alive."
          </div>
          <div className="timecode">— Nate_Aaro</div>
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
