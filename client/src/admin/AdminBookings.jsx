import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

const STATUS = ['pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_COLOR = { pending: 'var(--gold)', confirmed: '#6fae7f', completed: '#6fae7f', cancelled: 'var(--danger)' };

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [galleryPassword, setGalleryPassword] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { load(); }, [filter]);

  async function load() {
    api.getBookings(filter || null).then(setBookings).catch(() => {});
  }

  async function setStatus(id, status) {
    await api.updateBookingStatus(id, status).catch(() => {});
    await load();
  }

  async function deleteBooking(id) {
    if (!confirm('Delete this booking?')) return;
    await api.deleteBooking(id).catch(() => {});
    await load();
  }

  async function saveGalleryPassword(id) {
    await api.setGalleryPassword(id, galleryPassword).catch(() => {});
    alert('Gallery password saved.');
  }

  async function uploadAndAddMedia(bookingId) {
    if (!mediaUrl.trim()) return;
    await api.addGalleryMedia(bookingId, { media_type: mediaType, url: mediaUrl }).catch(() => {});
    setMediaUrl('');
    // refresh expanded
    const gallery = await api.getGallery(expanded.reference, '').catch(() => null);
    if (gallery) setExpanded((b) => ({ ...b, _gallery: gallery }));
  }

  async function uploadFile(e, bookingId) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadBookingFile(file);
      await api.addGalleryMedia(bookingId, { media_type: file.type.startsWith('video') ? 'video' : 'image', url });
      const gallery = await api.getGallery(expanded.reference, '').catch(() => null);
      if (gallery) setExpanded((b) => ({ ...b, _gallery: gallery }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function expand(b) {
    if (expanded?.id === b.id) { setExpanded(null); return; }
    setGalleryPassword('');
    setMediaUrl('');
    const gallery = await api.getGallery(b.reference, '').catch(() => null);
    setExpanded({ ...b, _gallery: gallery });
  }

  async function delMedia(mediaId) {
    await api.deleteGalleryMedia(mediaId).catch(() => {});
    const gallery = await api.getGallery(expanded.reference, '').catch(() => null);
    if (gallery) setExpanded((b) => ({ ...b, _gallery: gallery }));
  }

  return (
    <div style={{ padding: 36 }}>
      <h2 style={{ marginBottom: 20 }}>Bookings</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {['', ...STATUS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="btn"
            style={{ padding: '8px 16px', fontSize: '0.78rem', background: filter === s ? 'var(--gold)' : 'transparent', color: filter === s ? '#0a0a0c' : 'var(--muted)', border: '1px solid ' + (filter === s ? 'var(--gold)' : 'var(--border)') }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bookings.length === 0 && <p>No bookings found.</p>}
        {bookings.map((b) => (
          <div key={b.id} className="card">
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700 }}>{b.client_name}</span>
                  <span className="timecode" style={{ fontSize: '0.65rem' }}>#{b.reference}</span>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: STATUS_COLOR[b.status] || '#fff' }}>
                    {b.status}
                  </span>
                </div>
                <div className="timecode">{b.event_type} {b.event_date ? `— ${new Date(b.event_date).toLocaleDateString()}` : ''}</div>
                {b.location && <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>📍 {b.location}</div>}
                {b.phone && <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>📞 {b.phone}</div>}
                {b.email && <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>✉️ {b.email}</div>}
                {b.budget && <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>💰 {b.budget}</div>}
                {b.notes && <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4, maxWidth: 400 }}>{b.notes}</div>}
                <div className="timecode" style={{ marginTop: 6, fontSize: '0.65rem' }}>Received {new Date(b.created_at).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <select
                  value={b.status}
                  onChange={(e) => setStatus(b.id, e.target.value)}
                  style={{ width: 120, padding: '8px 10px', fontSize: '0.8rem' }}
                >
                  {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => expand(b)}>
                  {expanded?.id === b.id ? 'Close' : 'Gallery'}
                </button>
                <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => deleteBooking(b.id)}>
                  Delete
                </button>
              </div>
            </div>

            {/* Gallery management panel */}
            {expanded?.id === b.id && (
              <div style={{ borderTop: '1px solid var(--border)', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ fontWeight: 600 }}>Client gallery</div>
                  <Link to={`/gallery/${b.reference}`} target="_blank" className="timecode">View as client →</Link>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label>Gallery password (optional — leave blank for open)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" value={galleryPassword} onChange={(e) => setGalleryPassword(e.target.value)} placeholder="Enter a password…" style={{ flex: 1 }} />
                    <button className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '0.82rem' }} onClick={() => saveGalleryPassword(b.id)}>
                      Save password
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                  {(expanded._gallery?.media || []).map((m) => (
                    <div key={m.id} style={{ position: 'relative' }}>
                      {m.media_type === 'video'
                        ? <video src={m.url} style={{ width: 90, height: 65, objectFit: 'cover', borderRadius: 2 }} />
                        : <img src={m.url} alt="" style={{ width: 90, height: 65, objectFit: 'cover', borderRadius: 2 }} />
                      }
                      <button
                        onClick={() => delMedia(m.id)}
                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: 2, cursor: 'pointer', fontSize: '0.7rem', padding: '1px 5px' }}
                      >✕</button>
                    </div>
                  ))}
                  {(expanded._gallery?.media || []).length === 0 && <span className="timecode">No media yet</span>}
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} style={{ width: 90 }}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Paste media URL…" style={{ flex: 1, minWidth: 200 }} />
                  <button className="btn btn-primary" style={{ padding: '10px 16px' }} onClick={() => uploadAndAddMedia(b.id)}>Add URL</button>
                </div>

                <div>
                  <label>Upload file directly</label>
                  <input type="file" accept="image/*,video/*" onChange={(e) => uploadFile(e, b.id)} style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--muted)', fontSize: '0.85rem' }} />
                  {uploading && <span className="timecode"> Uploading…</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
