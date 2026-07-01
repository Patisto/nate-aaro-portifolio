# Nate_Aaro — Portfolio + Booking CMS

Full-stack booking portfolio for a creative agency. Built with **React + Vite** (frontend), **Node.js / Express** (backend), and **PostgreSQL** (database).

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Vite |
| Backend | Node.js (ESM), Express 4 |
| Database | PostgreSQL |
| Auth | JWT + bcryptjs |
| File storage | Local disk (`/uploads`) — swap for Cloudflare R2 / S3 in prod |
| Deployment | Vercel (frontend) + Railway / Render / VPS (backend) |

---

## Features

### Public site
- Cinematic letterbox hero reveal with live timecode ticker
- Portfolio grid with category filtering (Weddings, Events, Corporate, etc.)
- Project detail pages with embedded video + photo galleries
- Services page with monthly retainer package cards
- Booking form (name, phone, email, event type, date, location, budget, notes)
- Booking confirmation with unique 6-character reference (e.g. `AB3XK7`)
- Booking tracker — clients check status by reference
- Private client gallery — protected by optional password, lightbox viewer
- Contact page + floating WhatsApp button

### Admin CMS (`/admin`)
- Secure JWT login
- Dashboard with stats (pending/confirmed/completed bookings, total projects)
- **Projects** — create, edit, delete; upload cover images; manage photo/video gallery per project; set featured flag
- **Bookings** — filter by status; update status (pending → confirmed → completed → cancelled); manage per-booking client gallery (upload files or paste URLs); set gallery password; client gallery link
- **Testimonials** — create, edit, delete; toggle visibility
- **Services** — create, edit, delete; emoji icon, price, sort order, visibility

---

## Setup

### 1. Clone and install

```bash
# Install server deps
cd server
npm install

# Install client deps
cd ../client
npm install
```

### 2. Set up PostgreSQL

Create a database:
```sql
cl
```

### 3. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/nate_aaro
JWT_SECRET=some-long-random-secret-here
PORT=4000
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=mwayanganaaron@gmail.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### 4. Run database migrations

```bash
cd server
npm run migrate
```

This creates all tables and seeds the admin account + default services.

### 5. Start the server

```bash
cd server
npm run dev   # development with --watch
# or
npm start     # production
```

### 6. Start the frontend

```bash
cd client
npm run dev
```

Visit `http://localhost:5173` — the public site.
Visit `http://localhost:5173/admin` — the CMS (login with the email/password from your `.env`).

---

## Production deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel
```

Set the Vite proxy (`vite.config.js`) to point to your production API URL instead.

### Backend → Railway / Render / Ubuntu VPS

```bash
cd server
npm start
```

Set the same env vars via the platform dashboard.

---

## File structure

```
nate-aaro/
├── server/
│   ├── index.js          # Express entry
│   ├── schema.sql        # PostgreSQL schema
│   ├── migrate.js        # Migration + seed script
│   ├── db.js             # pg Pool
│   ├── middleware/
│   │   └── auth.js       # JWT requireAuth
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── bookings.js
│   │   ├── testimonials.js
│   │   └── services.js
│   └── utils/
│       └── upload.js     # Multer disk storage
└── client/
    ├── src/
    │   ├── App.jsx        # Router
    │   ├── lib/api.js     # API client
    │   ├── index.css      # Design system
    │   ├── pages/         # Public pages
    │   ├── admin/         # CMS pages
    │   └── components/    # Navbar, Footer, etc.
    └── vite.config.js
```

---

## Gallery flow

1. Client books → gets reference e.g. `X7PQ4R`
2. Aaron shoots and edits → uploads media via Admin → Bookings → Gallery panel
3. Aaron sets booking status to `completed`
4. Client visits `yoursite.com/gallery/X7PQ4R` → optionally enters password → downloads their photos/videos
5. Client can also visit `yoursite.com/track` → enter reference → see status + gallery link

---

## Customise

- **WhatsApp number** — search `265000000000` across the codebase and replace with Aaron's real number
- **Social links** — `Footer.jsx` and `Contact.jsx`
- **Packages / pricing** — `Services.jsx` and Admin → Services
- **Admin email + password** — `.env` vars before running `migrate`
