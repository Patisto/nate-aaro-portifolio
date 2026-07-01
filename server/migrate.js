import fs from 'fs';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

async function migrate() {
  const sql = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
  await pool.query(sql);
  console.log('Schema applied.');

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (email && password) {
    const existing = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email, hash]);
      console.log(`Admin created: ${email}`);
    } else {
      console.log('Admin already exists, skipping.');
    }
  }

  // Seed default services if none exist
  const { rows } = await pool.query('SELECT COUNT(*) FROM services');
  if (parseInt(rows[0].count, 10) === 0) {
    const defaults = [
      ['Photography', 'Professional event, product, and portrait photography.', 'From MWK 50,000', '📷', 1],
      ['Videography', 'Cinematic event and brand video coverage.', 'From MWK 80,000', '🎥', 2],
      ['Video Editing', 'Reels, promos, and full cinematic edits.', 'From MWK 30,000', '🎬', 3],
      ['Drone Shots', 'Aerial footage for events and properties.', 'From MWK 60,000', '🚁', 4],
      ['Social Media Content', 'Monthly content packages for businesses.', 'From MWK 150,000/mo', '📱', 5],
      ['Event Coverage', 'Full-day coverage for weddings and events.', 'From MWK 200,000', '🎉', 6]
    ];
    for (const [title, description, starting_price, icon, sort_order] of defaults) {
      await pool.query(
        'INSERT INTO services (title, description, starting_price, icon, sort_order) VALUES ($1,$2,$3,$4,$5)',
        [title, description, starting_price, icon, sort_order]
      );
    }
    console.log('Seeded default services.');
  }

  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
