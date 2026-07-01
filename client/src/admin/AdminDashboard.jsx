import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.getBookings().then(setBookings).catch(() => {});
    api.getProjects().then(setProjects).catch(() => {});
  }, []);

  const pending = bookings.filter((b) => b.status === 'pending').length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const recent = bookings.slice(0, 6);

  const STATUS_COLOR = { pending: 'var(--gold)', confirmed: '#6fae7f', completed: '#6fae7f', cancelled: 'var(--danger)' };

  return (
    <div style={{ padding: 36 }}>
      <h2 style={{ marginBottom: 6 }}>Dashboard</h2>
      <p style={{ marginBottom: 36 }}>Overview of your bookings and content.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Total bookings', value: bookings.length, color: 'var(--text)' },
          { label: 'Pending', value: pending, color: 'var(--gold)' },
          { label: 'Confirmed', value: confirmed, color: '#6fae7f' },
          { label: 'Completed', value: completed, color: '#6fae7f' },
          { label: 'Projects', value: projects.length, color: 'var(--text)' }
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div className="timecode" style={{ marginTop: 8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3>Recent bookings</h3>
            <Link to="/admin/bookings" className="timecode">View all →</Link>
          </div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {recent.length === 0 && <p style={{ padding: 20 }}>No bookings yet.</p>}
            {recent.map((b) => (
              <div key={b.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.client_name}</div>
                  <div className="timecode" style={{ marginTop: 2 }}>{b.event_type} {b.event_date ? `— ${new Date(b.event_date).toLocaleDateString()}` : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: STATUS_COLOR[b.status] || '#fff' }}>{b.status}</span>
                  <span className="timecode" style={{ fontSize: '0.65rem' }}>#{b.reference}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: 14 }}>Quick links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { to: '/admin/projects', label: 'Add a project', icon: '🎬' },
              { to: '/admin/bookings', label: 'Manage bookings', icon: '📅' },
              { to: '/admin/testimonials', label: 'Add testimonial', icon: '⭐' },
              { to: '/admin/services', label: 'Edit services', icon: '💼' }
            ].map((l) => (
              <Link key={l.to} to={l.to} className="card btn btn-ghost" style={{ justifyContent: 'flex-start', gap: 10 }}>
                <span>{l.icon}</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
