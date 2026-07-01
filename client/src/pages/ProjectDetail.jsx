import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api.js';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getProject(id).then(setProject).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="container" style={{ padding: '80px 0' }}><p>{error}</p></div>;
  if (!project) return <div className="container" style={{ padding: '80px 0' }}><p>Loading…</p></div>;

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <Link to="/portfolio" className="timecode">← Back to portfolio</Link>
      <div className="timecode" style={{ marginTop: 24 }}>{project.category}</div>
      <h1 style={{ margin: '12px 0 20px' }}>{project.title}</h1>
      {project.description && <p style={{ maxWidth: 640, fontSize: '1.05rem', marginBottom: 40 }}>{project.description}</p>}

      {project.video_url && (
        <div style={{ marginBottom: 32, aspectRatio: '16/9', background: '#000', borderRadius: 4, overflow: 'hidden' }}>
          {project.video_url.includes('youtube') || project.video_url.includes('youtu.be') || project.video_url.includes('vimeo') ? (
            <iframe src={project.video_url} title={project.title} style={{ width: '100%', height: '100%', border: 0 }} allowFullScreen />
          ) : (
            <video src={project.video_url} controls style={{ width: '100%', height: '100%' }} />
          )}
        </div>
      )}

      {project.cover_image && (
        <img src={project.cover_image} alt={project.title} style={{ width: '100%', borderRadius: 4, marginBottom: 24 }} />
      )}

      {project.media?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {project.media.map((m) => (
            <div key={m.id} className="card" style={{ overflow: 'hidden' }}>
              {m.media_type === 'video' ? (
                <video src={m.url} controls style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
              ) : (
                <img src={m.url} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 56, textAlign: 'center' }}>
        <Link to="/booking" className="btn btn-primary">Book something like this</Link>
      </div>
    </div>
  );
}
