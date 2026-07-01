import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const BLANK = { title: '', description: '', starting_price: '', icon: '', sort_order: 0, active: true };

export default function AdminServices() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);
  async function load() { api.getAllServices().then(setList).catch(() => {}); }

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  function startNew() { setForm(BLANK); setEditing(null); setShowForm(true); setError(''); }
  function startEdit(s) {
    setForm({ title: s.title, description: s.description || '', starting_price: s.starting_price || '', icon: s.icon || '', sort_order: s.sort_order || 0, active: s.active });
    setEditing(s.id); setShowForm(true); setError('');
  }

  async function save(e) {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await api.updateService(editing, form);
      else await api.createService(form);
      setShowForm(false); setEditing(null); setForm(BLANK); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function del(id) {
    if (!confirm('Delete this service?')) return;
    await api.deleteService(id).catch(() => {});
    await load();
  }

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2>Services</h2>
        <button className="btn btn-primary" onClick={startNew}>+ New service</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 28, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 20 }}>{editing ? 'Edit service' : 'New service'}</h3>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>Title *</label>
                <input value={form.title} onChange={set('title')} required />
              </div>
              <div>
                <label>Icon (emoji)</label>
                <input value={form.icon} onChange={set('icon')} placeholder="📷" />
              </div>
            </div>
            <div>
              <label>Description</label>
              <textarea value={form.description} onChange={set('description')} rows={2} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>Starting price</label>
                <input value={form.starting_price} onChange={set('starting_price')} placeholder="From MWK 50,000" />
              </div>
              <div>
                <label>Sort order</label>
                <input type="number" value={form.sort_order} onChange={set('sort_order')} />
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
        {list.length === 0 && <p>No services yet.</p>}
        {list.map((s) => (
          <div key={s.id} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{s.title} {!s.active && <span className="timecode" style={{ color: 'var(--danger)', marginLeft: 8 }}>Hidden</span>}</div>
                <div className="timecode">{s.starting_price}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => startEdit(s)}>Edit</button>
              <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => del(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
