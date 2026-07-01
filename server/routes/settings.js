import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import { upload, uploadToSupabase } from '../utils/upload.js';

const router = Router();

// Public: get all settings (used by About/Contact pages)
router.get('/', async (req, res) => {
  const { rows } = await query('SELECT key, value FROM settings');
  const settings = {};
  rows.forEach((r) => { settings[r.key] = r.value; });
  res.json(settings);
});

// Admin: update a single setting key
router.patch('/:key', requireAuth, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  await query(
    'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
    [key, value]
  );
  res.json({ key, value });
});

// Admin: change account password
router.post('/account/change-password', requireAuth, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password)
    return res.status(400).json({ error: 'Both fields required' });
  if (new_password.length < 8)
    return res.status(400).json({ error: 'New password must be at least 8 characters' });

  const { rows } = await query('SELECT * FROM admins WHERE id = $1', [req.admin.id]);
  const admin = rows[0];
  if (!admin) return res.status(404).json({ error: 'Admin not found' });

  const match = await bcrypt.compare(current_password, admin.password_hash);
  if (!match) return res.status(401).json({ error: 'Current password is incorrect' });

  const hash = await bcrypt.hash(new_password, 10);
  await query('UPDATE admins SET password_hash = $1 WHERE id = $2', [hash, admin.id]);
  res.json({ ok: true });
});

// Admin: upload portrait image
router.post('/upload/portrait', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const url = await uploadToSupabase(req.file, 'portraits');
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;