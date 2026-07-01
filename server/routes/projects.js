import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { upload, uploadToSupabase } from '../utils/upload.js';

const router = Router();

// Public: list projects (optionally filter by category)
router.get('/', async (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM projects';
  const params = [];
  if (category && category !== 'All') {
    sql += ' WHERE category = $1';
    params.push(category);
  }
  sql += ' ORDER BY featured DESC, sort_order ASC, created_at DESC';
  const { rows } = await query(sql, params);
  res.json(rows);
});

// Public: single project with media
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const project = await query('SELECT * FROM projects WHERE id = $1', [id]);
  if (project.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  const media = await query('SELECT * FROM project_media WHERE project_id = $1 ORDER BY sort_order ASC', [id]);
  res.json({ ...project.rows[0], media: media.rows });
});

// Admin: create project
router.post('/', requireAuth, async (req, res) => {
  const { title, category, description, cover_image, video_url, featured, sort_order } = req.body;
  if (!title || !category) return res.status(400).json({ error: 'Title and category required' });
  const { rows } = await query(
    `INSERT INTO projects (title, category, description, cover_image, video_url, featured, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [title, category, description || null, cover_image || null, video_url || null, !!featured, sort_order || 0]
  );
  res.status(201).json(rows[0]);
});

// Admin: update project
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title, category, description, cover_image, video_url, featured, sort_order } = req.body;
  const { rows } = await query(
    `UPDATE projects SET title=$1, category=$2, description=$3, cover_image=$4, video_url=$5, featured=$6, sort_order=$7
     WHERE id=$8 RETURNING *`,
    [title, category, description, cover_image, video_url, !!featured, sort_order || 0, id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// Admin: delete project
router.delete('/:id', requireAuth, async (req, res) => {
  await query('DELETE FROM projects WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

// Admin: add media to project
router.post('/:id/media', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { media_type, url, sort_order } = req.body;
  if (!media_type || !url) return res.status(400).json({ error: 'media_type and url required' });
  const { rows } = await query(
    'INSERT INTO project_media (project_id, media_type, url, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
    [id, media_type, url, sort_order || 0]
  );
  res.status(201).json(rows[0]);
});

router.delete('/media/:mediaId', requireAuth, async (req, res) => {
  await query('DELETE FROM project_media WHERE id = $1', [req.params.mediaId]);
  res.json({ ok: true });
});

// Admin: file upload (returns URL to use in cover_image / media)
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const url = await uploadToSupabase(req.file, 'projects');
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
