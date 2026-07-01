import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function Gallery() {
  const { reference } = useParams();
  const [info, setInfo] = useState(null);
  const [password, setPassword] = useState('');
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.getGalleryInfo(reference)
      .then(async (info) => {
        setInfo(info);
        if (!info.requires_password) {
          const g = await api.getGallery(reference, '');
          setGallery(g);
        }
      })
      .catch(() => setError('Gallery not found or not yet available.'))
      .finally(() => setLoading(false));
  }, [reference]);

  async function unlock(e) {
    e.preventDefault();
    setUnlocking(true);
    setError('');
    try {
      const g = await api.getGallery(reference, password);
      setGallery(g);
    } catch (err) {
      setError('Incorrect password. Contact Aaron for access.');
    } finally {
      setUnlocking(false);
    }
  }

  if (loading) return <div className="container" style={{ padding: '80px 0' }}><p>Loading gallery…</p></div>;
  if (error && !info) return <div className="container" style={{ padding: '80px 0' }}><p>{error}</p></div>;

  if (!gallery) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 96, maxWidth: 480 }}>
        <div className="section-label"><span className="line" /><span className="timecode">Private gallery</span></div>
        <h1 style={{ margin: '16px 0 8px' }}>Your gallery.</h1>
        <p style={{ marginBottom: 36 }}>This gallery is protected. Enter the password Aaron sent you.</p>
        <form onSubmit={unlock} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ flex: 1, minWidth: 200 }} />
          <button type="submit" className="btn btn-primary" disabled={unlocking}>
            {unlocking ? '…' : 'Unlock'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--danger)', marginTop: 16 }}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div className="section-label"><span className="line" /><span className="timecode">{gallery.reference}</span></div>
      <h1 style={{ marginBottom: 4 }}>{gallery.client_name}'s gallery.</h1>
      <div className="timecode" style={{ marginBottom: 40 }}>
        {gallery.event_type} {gallery.event_date && `— ${new Date(gallery.event_date).toLocaleDateString('en-MW', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      </div>

      {gallery.media.length === 0 && (
        <p>No media uploaded yet. Aaron will notify you when it's ready.</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {gallery.media.map((m) => (
          <div
            key={m.id}
            onClick={() => m.media_type === 'image' && setLightbox(m.url)}
            style={{ cursor: m.media_type === 'image' ? 'zoom-in' : 'default', borderRadius: 3, overflow: 'hidden' }}
          >
            {m.media_type === 'video' ? (
              <video src={m.url} controls style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            ) : (
              <img src={m.url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
            zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, cursor: 'zoom-out'
          }}
        >
          <img src={lightbox} alt="" style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 4 }} />
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: '1.8rem', cursor: 'pointer' }}
          >✕</button>
        </div>
      )}
    </div>
  );
}
