import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api.js';

const categories = ['All', 'Weddings', 'Events', 'Corporate', 'Product Videos', 'Music Videos', 'Photography', 'Reels'];

export default function Portfolio() {
  const [params, setParams] = useSearchParams();
  const active = params.get('category') || 'All';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProjects(active).then((p) => { setProjects(p); setLoading(false); }).catch(() => setLoading(false));
  }, [active]);

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div className="section-label"><span className="line" /><span className="timecode">The reel</span></div>
      <h1 style={{ marginBottom: 32 }}>Portfolio.</h1>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 44 }}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setParams(c === 'All' ? {} : { category: c })}
            className="btn"
            style={{
              padding: '9px 18px',
              fontSize: '0.8rem',
              background: active === c ? 'var(--gold)' : 'transparent',
              color: active === c ? '#0a0a0c' : 'var(--muted)',
              border: '1px solid ' + (active === c ? 'var(--gold)' : 'var(--border)')
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p>Loading projects…</p>}
      {!loading && projects.length === 0 && <p>No projects in this category yet — check back soon.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22 }}>
        {projects.map((p) => (
          <Link key={p.id} to={`/portfolio/${p.id}`} className="card" style={{ overflow: 'hidden', display: 'block' }}>
            <div style={{ aspectRatio: '4/3', background: '#101012', backgroundImage: p.cover_image ? `url(${p.cover_image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ padding: 18 }}>
              <div className="timecode" style={{ marginBottom: 6 }}>{p.category}</div>
              <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{p.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
