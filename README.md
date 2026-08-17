# Learniee Parent Dashboard

A responsive full-stack course discovery dashboard for parents. Parents can create an account, sign in, search a PostgreSQL course catalogue, combine filters, and sort results.

## Live application and source code

- Frontend: [https://learniee-eight.vercel.app/](https://learniee-eight.vercel.app/)
- Backend health check: [https://learniee-api.onrender.com/api/health](https://learniee-api.onrender.com/api/health)
- GitHub repository: [https://github.com/TahaAnsari12345/Learniee/](https://github.com/TahaAnsari12345/Learniee/)

> The Render service may sleep after inactivity. Open the health-check link and wait for `{ "status": "ok" }` before using the live app.

## Features

- JWT-based signup, login, persisted session, logout, and protected dashboard route
- API-backed course search, grade/subject/price/rating filters, and sorting
- PostgreSQL schema and seed script with 120 child-focused course records
- Responsive dashboard, loading/error/empty states, and accessible forms

## Structure

- `frontend/` — React, Vite, React Router, Axios, Lucide UI
- `backend/` — Express, pg, bcrypt, JWT API
- `backend/src/db/schema.sql` — database schema
- `backend/src/db/seed.js` — sample course seed script

## Database

Data is stored in PostgreSQL. Example course: `Mathematics Mastery | Mathematics | grade 5 | ₹649 | Ananya Rao | 4.1`.

## Local setup

1. Create a PostgreSQL database named `learniee`.
2. Copy `backend/.env.example` to `backend/.env`, then set your database URL and JWT secret.
3. Run `cd backend && npm install && npm run seed && npm run dev`.
4. Copy `frontend/.env.example` to `frontend/.env` if the API uses a non-default URL.
5. In another terminal, run `cd frontend && npm install && npm run dev`.

## API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/courses?search=&grade=&subject=&minPrice=&maxPrice=&rating=&sort=&page=&limit=`

## Future improvements

Add course detail pages, parent child profiles, server-side saved courses, automated tests, and production deployment/security hardening.

## Deployment architecture

| Layer | Service |
| --- | --- |
| React frontend | Vercel |
| Express backend | Render |
| PostgreSQL database | Neon |

## Detailed deployment instructions

### 1. Neon PostgreSQL database

1. Create a Neon project and database.
2. Copy its PostgreSQL connection string from the Neon dashboard.
3. Add that value as `DATABASE_URL` in Render. Keep it secret; never commit it in `.env` or Git.
4. Seed Neon once from your local computer:

   ```powershell
   cd backend
   $env:DATABASE_URL = "your-neon-connection-string"
   npm run seed
   ```

   The seed script creates the tables and inserts 120 sample courses. It refreshes the sample `courses` table, so do not run it on every deployment.

### 2. Backend deployment on Render

1. Push this project to GitHub.
2. In Render, select **New** → **Web Service** and connect the repository.
3. Use these settings:

   | Render setting | Value |
   | --- | --- |
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Health Check Path | `/api/health` |
   | Node version | `22.19.0` |

4. Add these Render environment variables:

   ```env
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=use-a-long-random-secret
   CLIENT_URL=https://learniee-eight.vercel.app
   ```

5. Click **Create Web Service**. Confirm the API works using [the live health-check endpoint](https://learniee-api.onrender.com/api/health).

### 3. Frontend deployment on Vercel

1. In Vercel, import the same GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Use Vite’s default values: build command `npm run build` and output directory `dist`.
4. In Vercel → **Settings** → **Environment Variables**, add:

   ```env
   VITE_API_URL=https://learniee-api.onrender.com/api
   ```

5. Deploy the project. The live site is [https://learniee-eight.vercel.app/](https://learniee-eight.vercel.app/).

### Local development instructions

#### Backend

```powershell
cd backend
Copy-Item .env.example .env
```

Set `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_URL=http://localhost:5173` in `backend/.env`, then run:

```powershell
npm install
npm run seed
npm run dev
```

#### Frontend

```powershell
cd frontend
Copy-Item .env.example .env
```

Set the following in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then run:

```powershell
npm install
npm run dev
```

Open the local Vite URL, normally `http://localhost:5173`.

### Deployment troubleshooting

- If signup/login says it cannot connect, verify Vercel has the correct `VITE_API_URL` and then redeploy the frontend.
- Ensure Render `CLIENT_URL` exactly matches the Vercel URL, without a trailing slash, then redeploy the backend.
- Check `https://learniee-api.onrender.com/api/health`; it must return `{ "status": "ok" }`.
- Do not use `http://localhost:5000/api` in Vercel production settings.
