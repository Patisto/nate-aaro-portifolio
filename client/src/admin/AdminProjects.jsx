import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const CATEGORIES = ['Weddings', 'Events', 'Corporate', 'Product Videos', 'Music Videos', 'Photography', 'Reels'];

const BLANK = { title: '', category: '', description: '', cover_image: '', video_url: '', featured: false, sort_order: 0 };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');

  useEffect(() => { load(); }, []);

  async function load() {
    api.getProjects().then(setProjects).catch(() => {});
  }

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  function startNew() {
    setForm(BLANK);
    setEditing(null);
    setShowForm(true);
    setError('');
  }

  function startEdit(p) {
    setForm({ title: p.title, category: p.category, description: p.description || '', cover_image: p.cover_image || '', video_url: p.video_url || '', featured: !!p.featured, sort_order: p.sort_order || 0 });
    setEditing(p.id);
    setShowForm(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await api.updateProject(editing, form);
      else await api.createProject(form);
      setShowForm(false);
      setEditing(null);
      setForm(BLANK);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!confirm('Delete this project? This removes all its media too.')) return;
    await api.deleteProject(id).catch(() => {});
    await load();
  }

  async function uploadCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadProjectFile(file);
      setForm((f) => ({ ...f, cover_image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function addMedia(projectId) {
    if (!mediaUrl.trim()) return;
    await api.addProjectMedia(projectId, { media_type: mediaType, url: mediaUrl }).catch(() => {});
    setMediaUrl('');
    // re-load expanded project
    const p = await api.getProject(projectId);
    setProjects((prev) => prev.map((pr) => pr.id === projectId ? { ...pr, media: p.media } : pr));
    setExpanded(p);
  }

  async function delMedia(mediaId, projectId) {
    await api.deleteProjectMedia(mediaId).catch(() => {});
    const p = await api.getProject(projectId);
    setExpanded(p);
  }

  return (
    <div style={{ padding: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2>Projects</h2>
        <button className="btn btn-primary" onClick={startNew}>+ New project</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 28, marginBottom: 32 }}>
          <h3 style={{ marginBottom: 20 }}>{editing ? 'Edit project' : 'New project'}</h3>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>Title *</label>
                <input value={form.title} onChange={set('title')} placeholder="e.g. The Mwale Wedding" required />
              </div>
              <div>
                <label>Category *</label>
                <select value={form.category} onChange={set('category')} required>
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label>Description</label>
              <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Brief description of this project…" />
            </div>
            <div>
              <label>Cover image URL (or upload below)</label>
              <input value={form.cover_image} onChange={set('cover_image')} placeholder="https://… or /uploads/filename.jpg" />
            </div>
            <div>
              <label>Upload cover image</label>
              <input type="file" accept="image/*" onChange={uploadCover} style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '0.85rem', color: 'var(--muted)' }} />
              {uploading && <span className="timecode"> Uploading…</span>}
              {form.cover_image && <img src={form.cover_image} alt="" style={{ marginTop: 8, height: 80, borderRadius: 3 }} />}
            </div>
            <div>
              <label>Video URL (YouTube embed / Vimeo / direct .mp4)</label>
              <input value={form.video_url} onChange={set('video_url')} placeholder="https://www.youtube.com/embed/…" />
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'none', margin: 0 }}>
                <input type="checkbox" checked={form.featured} onChange={set('featured')} style={{ width: 'auto' }} />
                Featured on homepage
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ margin: 0 }}>Sort order</label>
                <input type="number" value={form.sort_order} onChange={set('sort_order')} style={{ width: 70 }} />
              </div>
            </div>
            {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update project' : 'Create project'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.length === 0 && <p>No projects yet. Add one above.</p>}
        {projects.map((p) => (
          <div key={p.id} className="card">
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {p.cover_image && <img src={p.cover_image} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 2 }} />}
                <div>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div className="timecode">{p.category} {p.featured ? '★ Featured' : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => setExpanded(expanded?.id === p.id ? null : p)}>
                  {expanded?.id === p.id ? 'Close' : 'Media'}
                </button>
                <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => startEdit(p)}>Edit</button>
                <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => del(p.id)}>Delete</button>
              </div>
            </div>

            {expanded?.id === p.id && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
                <div style={{ marginTop: 16, marginBottom: 12, fontWeight: 600 }}>Gallery media</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                  {(expanded.media || []).map((m) => (
                    <div key={m.id} style={{ position: 'relative' }}>
                      {m.media_type === 'video'
                        ? <video src={m.url} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 2 }} />
                        : <img src={m.url} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 2 }} />
                      }
                      <button
                        onClick={() => delMedia(m.id, p.id)}
                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: 2, cursor: 'pointer', fontSize: '0.7rem', padding: '1px 4px' }}
                      >✕</button>
                    </div>
                  ))}
                  {(expanded.media || []).length === 0 && <span className="timecode">No media yet</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} style={{ width: 90 }}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Media URL" style={{ flex: 1, minWidth: 200 }} />
                  <button className="btn btn-primary" style={{ padding: '10px 16px' }} onClick={() => addMedia(p.id)}>Add</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
