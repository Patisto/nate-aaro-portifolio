import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

const STATUS_COLORS = {
  pending: '#d4af6a',
  confirmed: '#6fae7f',
  completed: '#6fae7f',
  cancelled: '#c2685a'
};

export default function TrackBooking() {
  const [ref, setRef] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function track(e) {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    setError('');
    setBooking(null);
    try {
      const data = await api.trackBooking(ref.trim().toUpperCase());
      setBooking(data);
    } catch (err) {
      setError('Booking not found. Check your reference number and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 96, maxWidth: 560 }}>
      <div className="section-label"><span className="line" /><span className="timecode">Booking status</span></div>
      <h1 style={{ margin: '16px 0 8px' }}>Track your booking.</h1>
      <p style={{ marginBottom: 40 }}>Enter the 6-character reference from your confirmation.</p>

      <form onSubmit={track} style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value.toUpperCase())}
          placeholder="e.g. AB3XK7"
          maxLength={6}
          style={{ width: 180, fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '…' : 'Track'}
        </button>
      </form>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      {booking && (
        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="timecode" style={{ marginBottom: 4 }}>Booking #{booking.reference}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{booking.event_type}</div>
            </div>
            <div style={{
              padding: '6px 14px',
              borderRadius: 2,
              border: `1px solid ${STATUS_COLORS[booking.status] || '#555'}`,
              color: STATUS_COLORS[booking.status] || '#fff',
              fontSize: '0.75rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 700
            }}>
              {booking.status}
            </div>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div><span className="timecode">Client: </span>{booking.client_name}</div>
            {booking.event_date && <div><span className="timecode">Date: </span>{new Date(booking.event_date).toLocaleDateString('en-MW', { year: 'numeric', month: 'long', day: 'numeric' })}</div>}
            <div><span className="timecode">Submitted: </span>{new Date(booking.created_at).toLocaleDateString()}</div>
          </div>

          {booking.status === 'completed' && (
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <p style={{ marginBottom: 16 }}>Your media may be ready. Check your private gallery using your reference number.</p>
              <Link to={`/gallery/${booking.reference}`} className="btn btn-primary" style={{ display: 'inline-flex' }}>
                View my gallery →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
