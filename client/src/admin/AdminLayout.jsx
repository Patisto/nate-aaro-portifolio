import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: '📊 Dashboard', end: true },
  { to: '/admin/projects', label: '🎬 Projects' },
  { to: '/admin/bookings', label: '📅 Bookings' },
  { to: '/admin/testimonials', label: '⭐ Testimonials' },
  { to: '/admin/services', label: '💼 Services' },
  { to: '/admin/settings', label: '⚙️ Settings' }
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('na_admin_token');
    navigate('/admin/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: 'var(--bg-elevated)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 0',
        flexShrink: 0
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: '0.04em', padding: '0 24px 24px', borderBottom: '1px solid var(--border)' }}>
          NATE<span style={{ color: 'var(--gold)' }}>_</span>AARO
          <div className="timecode" style={{ fontSize: '0.65rem', marginTop: 4 }}>Admin CMS</div>
        </div>
        <nav style={{ flex: 1, paddingTop: 16 }}>
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: 'block',
                padding: '11px 24px',
                fontSize: '0.85rem',
                color: isActive ? 'var(--gold)' : 'var(--muted)',
                background: isActive ? 'rgba(212,175,106,0.06)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent'
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <a href="/" target="_blank" className="timecode" style={{ display: 'block', marginBottom: 10 }}>View site →</a>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
