import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(10,10,12,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.25s ease'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.04em' }}>
          NATE<span style={{ color: 'var(--gold)' }}>_</span>AARO
        </Link>

        <nav style={{ display: 'flex', gap: 36 }} className="desktop-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={({ isActive }) => ({
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--gold)' : 'var(--text)',
                opacity: isActive ? 1 : 0.75
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/booking" className="btn btn-primary" style={{ padding: '11px 22px' }}>
          Book Now
        </Link>
      </div>

      <nav className="mobile-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            style={({ isActive }) => ({
              fontSize: '0.78rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--gold)' : 'var(--muted)',
              whiteSpace: 'nowrap'
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <style>{`
        .mobile-nav { display: none; }
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-nav {
            display: flex;
            gap: 22px;
            padding: 0 24px 14px;
            overflow-x: auto;
            border-top: 1px solid var(--border);
            padding-top: 12px;
          }
        }
      `}</style>
    </header>
  );
}
