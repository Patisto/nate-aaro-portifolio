import { useState } from 'react';
import { api } from '../lib/api.js';

const eventTypes = ['Wedding', 'Corporate Event', 'Birthday / Party', 'Product Shoot', 'Music Video', 'Graduation', 'Real Estate', 'Restaurant / Brand', 'Other'];

export default function Booking() {
  const [form, setForm] = useState({ client_name: '', phone: '', email: '', event_type: '', event_date: '', location: '', budget: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.client_name || !form.phone || !form.event_type) {
      setError('Please fill in your name, phone number, and event type.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const booking = await api.createBooking(form);
      setResult(booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 96, maxWidth: 560 }}>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎬</div>
          <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: 8 }}>
            Request received.
          </div>
          <p style={{ marginBottom: 28 }}>
            Your booking request has been sent. Aaron will reach out within 24 hours to confirm details.
          </p>
          <div className="card" style={{ padding: 24, marginBottom: 28 }}>
            <div className="timecode" style={{ marginBottom: 6 }}>Your booking reference</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>
              {result.reference}
            </div>
            <p style={{ marginTop: 8, fontSize: '0.85rem' }}>Save this — you can use it to check your booking status or access your gallery when your media is ready.</p>
          </div>
          <a
            href={`https://wa.me/265000000000?text=Hi%20Nate!%20My%20booking%20reference%20is%20${result.reference}%2C%20just%20sent%20a%20request%20for%20${encodeURIComponent(form.event_type)}.`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ display: 'inline-flex' }}
          >
            Follow up on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 680 }}>
      <div className="section-label"><span className="line" /><span className="timecode">Let's talk</span></div>
      <h1 style={{ margin: '16px 0 8px' }}>Book a session.</h1>
      <p style={{ marginBottom: 44 }}>Fill this in and Aaron will follow up within 24 hours to confirm your date and pricing.</p>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label>Your name *</label>
            <input value={form.client_name} onChange={set('client_name')} placeholder="John Mwale" />
          </div>
          <div>
            <label>Phone number *</label>
            <input value={form.phone} onChange={set('phone')} placeholder="+265 991 000 000" />
          </div>
        </div>

        <div>
          <label>Email (optional)</label>
          <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
        </div>

        <div>
          <label>Event type *</label>
          <select value={form.event_type} onChange={set('event_type')}>
            <option value="">Select event type…</option>
            {eventTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label>Event date</label>
            <input type="date" value={form.event_date} onChange={set('event_date')} />
          </div>
          <div>
            <label>Location</label>
            <input value={form.location} onChange={set('location')} placeholder="Blantyre, Malawi" />
          </div>
        </div>

        <div>
          <label>Budget range (optional)</label>
          <input value={form.budget} onChange={set('budget')} placeholder="e.g. MWK 100,000 – 200,000" />
        </div>

        <div>
          <label>Tell me about your event</label>
          <textarea value={form.notes} onChange={set('notes')} rows={4} placeholder="Any details, special requirements, or things you want captured…" />
        </div>

        {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
          {loading ? 'Sending…' : 'Send booking request'}
        </button>
      </form>
    </div>
  );
}
