import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

function Field({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card" style={{ padding: 28, marginBottom: 24 }}>
      <h3 style={{ marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

export default function AdminSettings() {
  // Contact / profile settings
  const [portrait, setPortrait] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [saving, setSaving] = useState('');
  const [msg, setMsg] = useState({});
  const [uploading, setUploading] = useState(false);

  // Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((s) => {
        setPortrait(s.portrait_url || '');
        setEmail(s.contact_email || '');
        setWhatsapp(s.whatsapp_number || '');
      })
      .catch(() => {});
  }, []);

  async function saveSetting(key, value, label) {
    setSaving(key);
    setMsg((m) => ({ ...m, [key]: '' }));
    try {
      const token = localStorage.getItem('na_admin_token');
      const res = await fetch(`/api/settings/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value })
      });
      if (!res.ok) throw new Error('Failed to save');
      setMsg((m) => ({ ...m, [key]: `${label} saved ✓` }));
    } catch (err) {
      setMsg((m) => ({ ...m, [key]: `Error: ${err.message}` }));
    } finally {
      setSaving('');
    }
  }

  async function uploadPortrait(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadPortrait(file);
      setPortrait(url);
      await saveSetting('portrait_url', url, 'Portrait');
    } catch (err) {
      setMsg((m) => ({ ...m, portrait_url: `Upload error: ${err.message}` }));
    } finally {
      setUploading(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (newPw !== confirmPw) { setPwMsg('New passwords do not match.'); return; }
    if (newPw.length < 8) { setPwMsg('New password must be at least 8 characters.'); return; }
    setPwSaving(true);
    setPwMsg('');
    try {
      const token = localStorage.getItem('na_admin_token');
      const res = await fetch('/api/settings/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPw, new_password: newPw })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setPwMsg('Password changed successfully ✓');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      setPwMsg(`Error: ${err.message}`);
    } finally {
      setPwSaving(false);
    }
  }

  const msgStyle = (key) => ({
    fontSize: '0.82rem',
    color: msg[key]?.startsWith('Error') ? 'var(--danger)' : 'var(--success)',
    marginTop: 4,
    minHeight: 18
  });

  return (
    <div style={{ padding: 36, maxWidth: 680 }}>
      <h2 style={{ marginBottom: 6 }}>Settings</h2>
      <p style={{ marginBottom: 32 }}>Manage your profile, contact info, and account security.</p>

      {/* Portrait */}
      <Section title="📸 About page portrait">
        <div>
          {portrait && (
            <img
              src={portrait}
              alt="Portrait"
              style={{ width: 120, height: 160, objectFit: 'cover', borderRadius: 3, marginBottom: 14, border: '1px solid var(--border)' }}
            />
          )}
          <label>Upload a new photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={uploadPortrait}
            style={{ background: 'transparent', border: 'none', padding: 0, color: 'var(--muted)', fontSize: '0.85rem' }}
          />
          {uploading && <span className="timecode" style={{ marginTop: 6, display: 'block' }}>Uploading…</span>}
        </div>
        <div>
          <label>Or paste an image URL</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={portrait} onChange={(e) => setPortrait(e.target.value)} placeholder="https://… or /uploads/photo.jpg" />
            <button
              className="btn btn-primary"
              style={{ padding: '10px 16px', flexShrink: 0 }}
              onClick={() => saveSetting('portrait_url', portrait, 'Portrait')}
              disabled={saving === 'portrait_url'}
            >
              {saving === 'portrait_url' ? '…' : 'Save'}
            </button>
          </div>
          <div style={msgStyle('portrait_url')}>{msg.portrait_url}</div>
        </div>
      </Section>

      {/* Contact info */}
      <Section title="📬 Contact information">
        <div>
          <Field label="Email address" value={email} onChange={setEmail} type="email" placeholder="you@email.com" />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              className="btn btn-primary"
              style={{ padding: '10px 16px' }}
              onClick={() => saveSetting('contact_email', email, 'Email')}
              disabled={saving === 'contact_email'}
            >
              {saving === 'contact_email' ? '…' : 'Save email'}
            </button>
          </div>
          <div style={msgStyle('contact_email')}>{msg.contact_email}</div>
        </div>

        <div>
          <Field
            label="WhatsApp number (digits only, with country code)"
            value={whatsapp}
            onChange={setWhatsapp}
            placeholder="265991000000"
          />
          <p style={{ fontSize: '0.78rem', marginTop: 4 }}>
            Example: <span style={{ color: 'var(--gold)' }}>265991234567</span> — no +, no spaces. Used for the floating WhatsApp button and booking confirmation link.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button
              className="btn btn-primary"
              style={{ padding: '10px 16px' }}
              onClick={() => saveSetting('whatsapp_number', whatsapp, 'WhatsApp number')}
              disabled={saving === 'whatsapp_number'}
            >
              {saving === 'whatsapp_number' ? '…' : 'Save number'}
            </button>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
              style={{ padding: '10px 16px' }}
            >
              Test link
            </a>
          </div>
          <div style={msgStyle('whatsapp_number')}>{msg.whatsapp_number}</div>
        </div>
      </Section>

      {/* Password */}
      <Section title="🔒 Change admin password">
        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Current password" value={currentPw} onChange={setCurrentPw} type="password" />
          <Field label="New password (min 8 characters)" value={newPw} onChange={setNewPw} type="password" />
          <Field label="Confirm new password" value={confirmPw} onChange={setConfirmPw} type="password" />
          {pwMsg && (
            <p style={{ fontSize: '0.82rem', color: pwMsg.includes('successfully') ? 'var(--success)' : 'var(--danger)', margin: 0 }}>
              {pwMsg}
            </p>
          )}
          <div>
            <button type="submit" className="btn btn-primary" disabled={pwSaving}>
              {pwSaving ? 'Changing…' : 'Change password'}
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}