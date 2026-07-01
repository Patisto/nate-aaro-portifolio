import { Router } from 'express';
import crypto from 'crypto';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';

const router = Router();

function generateReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let ref = '';
  for (let i = 0; i < 6; i++) ref += chars[crypto.randomInt(0, chars.length)];
  return ref;
}

// Public: create a booking request
router.post('/', async (req, res) => {
  const { client_name, phone, email, event_type, event_date, location, budget, notes } = req.body;
  if (!client_name || !phone || !event_type) {
    return res.status(400).json({ error: 'Name, phone, and event type are required' });
  }

  let reference;
  let attempts = 0;
  while (attempts < 5) {
    reference = generateReference();
    const exists = await query('SELECT id FROM bookings WHERE reference = $1', [reference]);
    if (exists.rows.length === 0) break;
    attempts++;
  }

  const { rows } = await query(
    `INSERT INTO bookings (reference, client_name, phone, email, event_type, event_date, location, budget, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [reference, client_name, phone, email || null, event_type, event_date || null, location || null, budget || null, notes || null]
  );
  res.status(201).json(rows[0]);
});

// Public: check a booking status by reference (for client follow-up)
router.get('/track/:reference', async (req, res) => {
  const { rows } = await query(
    'SELECT reference, client_name, event_type, event_date, status, created_at FROM bookings WHERE reference = $1',
    [req.params.reference.toUpperCase()]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
  res.json(rows[0]);
});

// Public: view client gallery by reference (+ optional password)
router.post('/gallery/:reference', async (req, res) => {
  const { password } = req.body;
  const { rows } = await query('SELECT * FROM bookings WHERE reference = $1', [req.params.reference.toUpperCase()]);
  if (rows.length === 0) return res.status(404).json({ error: 'Gallery not found' });
  const booking = rows[0];

  if (booking.gallery_password && booking.gallery_password !== password) {
    return res.status(403).json({ error: 'Incorrect password' });
  }

  const media = await query(
    'SELECT * FROM booking_gallery_media WHERE booking_id = $1 ORDER BY sort_order ASC',
    [booking.id]
  );
  res.json({
    reference: booking.reference,
    client_name: booking.client_name,
    event_type: booking.event_type,
    event_date: booking.event_date,
    media: media.rows
  });
});

// Public: check if gallery requires a password (so frontend knows whether to prompt)
router.get('/gallery/:reference/info', async (req, res) => {
  const { rows } = await query(
    'SELECT reference, gallery_password IS NOT NULL AND gallery_password != \'\' AS requires_password FROM bookings WHERE reference = $1',
    [req.params.reference.toUpperCase()]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Gallery not found' });
  res.json(rows[0]);
});

// --- Admin routes ---

router.get('/', requireAuth, async (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM bookings';
  const params = [];
  if (status) {
    sql += ' WHERE status = $1';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';
  const { rows } = await query(sql, params);
  res.json(rows);
});

router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const { rows } = await query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.patch('/:id/gallery-password', requireAuth, async (req, res) => {
  const { password } = req.body;
  const { rows } = await query(
    'UPDATE bookings SET gallery_password = $1 WHERE id = $2 RETURNING *',
    [password || null, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.post('/:id/gallery-media', requireAuth, async (req, res) => {
  const { media_type, url, sort_order } = req.body;
  if (!media_type || !url) return res.status(400).json({ error: 'media_type and url required' });
  const { rows } = await query(
    'INSERT INTO booking_gallery_media (booking_id, media_type, url, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
    [req.params.id, media_type, url, sort_order || 0]
  );
  res.status(201).json(rows[0]);
});

router.delete('/gallery-media/:mediaId', requireAuth, async (req, res) => {
  await query('DELETE FROM booking_gallery_media WHERE id = $1', [req.params.mediaId]);
  res.json({ ok: true });
});

router.delete('/:id', requireAuth, async (req, res) => {
  await query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;
