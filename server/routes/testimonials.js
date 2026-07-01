import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT * FROM testimonials WHERE active = true ORDER BY created_at DESC');
  res.json(rows);
});

router.get('/all', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT * FROM testimonials ORDER BY created_at DESC');
  res.json(rows);
});

router.post('/', requireAuth, async (req, res) => {
  const { client_name, client_role, quote, avatar_url, rating, active } = req.body;
  if (!client_name || !quote) return res.status(400).json({ error: 'client_name and quote required' });
  const { rows } = await query(
    `INSERT INTO testimonials (client_name, client_role, quote, avatar_url, rating, active)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [client_name, client_role || null, quote, avatar_url || null, rating || 5, active !== false]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { client_name, client_role, quote, avatar_url, rating, active } = req.body;
  const { rows } = await query(
    `UPDATE testimonials SET client_name=$1, client_role=$2, quote=$3, avatar_url=$4, rating=$5, active=$6
     WHERE id=$7 RETURNING *`,
    [client_name, client_role, quote, avatar_url, rating, active, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

export default router;
