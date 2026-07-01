import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { rows } = await query('SELECT * FROM services WHERE active = true ORDER BY sort_order ASC');
  res.json(rows);
});

router.get('/all', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT * FROM services ORDER BY sort_order ASC');
  res.json(rows);
});

router.post('/', requireAuth, async (req, res) => {
  const { title, description, starting_price, icon, sort_order, active } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const { rows } = await query(
    `INSERT INTO services (title, description, starting_price, icon, sort_order, active)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description || null, starting_price || null, icon || null, sort_order || 0, active !== false]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', requireAuth, async (req, res) => {
  const { title, description, starting_price, icon, sort_order, active } = req.body;
  const { rows } = await query(
    `UPDATE services SET title=$1, description=$2, starting_price=$3, icon=$4, sort_order=$5, active=$6
     WHERE id=$7 RETURNING *`,
    [title, description, starting_price, icon, sort_order || 0, active, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await query('DELETE FROM services WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

export default router;
