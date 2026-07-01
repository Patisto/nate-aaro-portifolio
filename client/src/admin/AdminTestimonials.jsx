import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const BLANK = { client_name: '', client_role: '', quote: '', avatar_url: '', rating: 5, active: true };

export default function AdminTestimonials() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);
  async function load() { api.getAllTestimonials().then(setList).catch(() => {}); }

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  function startNew() { setForm(BLANK); setEditing(null); setShowForm(true); setError(''); }
  function startEdit(t) {
    setForm({ client_name: t.client_name, client_role: t.client_role || '', quote: t.quote, avatar_url: t.avatar_url || '', rating: t.rating, active: t.active });
    setEditing(t.id); setShowForm(true); setError('');
  }

  async function save(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await api.updateTestimonial(editing, form);
      else await api.createTestimonial(form);
      setShowForm(false); setEditing(null); setForm(BLANK); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function del(id) {
    if (!confirm('Delete this testimonial?')) return;
    await api.deleteTestimonial(id).catch(() => {});
    await load();
  }

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2>Testimonials</h2>
        <button className="btn btn-primary" onClick={startNew}>+ New testimonial</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 28, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 20 }}>{editing ? 'Edit testimonial' : 'New testimonial'}</h3>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>Client name *</label>
                <input value={form.client_name} onChange={set('client_name')} required />
              </div>
              <div>
                <label>Role / Business</label>
                <input value={form.client_role} onChange={set('client_role')} placeholder="e.g. Owner, Blantyre Cafe" />
              </div>
            </div>
            <div>
              <label>Quote *</label>
              <textarea value={form.quote} onChange={set('quote')} rows={3} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>Avatar URL (optional)</label>
                <input value={form.avatar_url} onChange={set('avatar_url')} />
              </div>
              <div>
                <label>Rating (1–5)</label>
                <select value={form.rating} onChange={set('rating')}>
                  {[5,4,3,2,1].map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', margin: 0 }}>
              <input type="checkbox" checked={form.active} onChange={set('active')} style={{ width: 'auto' }} />
              Visible on site
            </label>
            {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.length === 0 && <p>No testimonials yet.</p>}
        {list.map((t) => (
          <div key={t.id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.client_name} {t.client_role && <span className="timecode" style={{ fontSize: '0.7rem' }}>— {t.client_role}</span>}</div>
              <div style={{ color: 'var(--gold)', margin: '4px 0' }}>{'★'.repeat(t.rating)}</div>
              <p style={{ maxWidth: 500 }}>"{t.quote}"</p>
              {!t.active && <span className="timecode" style={{ color: 'var(--danger)' }}>Hidden</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => startEdit(t)}>Edit</button>
              <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => del(t.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
