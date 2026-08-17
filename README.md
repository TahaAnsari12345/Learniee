# Learniee Parent Dashboard

A responsive full-stack course discovery dashboard for parents. Parents can create an account, sign in, search a PostgreSQL course catalogue, combine filters, and sort results.

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
