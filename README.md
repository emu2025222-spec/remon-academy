# Remon Academy — Coaching Management Platform

A complete full-stack coaching/education management system (Est. 2026).

## 1. Overview
Two sides in one repo:
- **Public website**: home, about, courses, teachers, results info, notices, gallery, contact
- **Secure system**: student registration/login + dashboard, admin login + full management dashboard

## 2. Technologies
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, React Hook Form + Zod, Recharts, Lucide icons
- **Backend**: Node.js, Express, TypeScript, MongoDB + Mongoose
- **Auth**: JWT (httpOnly cookie), bcrypt password hashing, role-based (ADMIN/STUDENT) middleware
- **Uploads**: Multer, stored locally under `server/uploads/`

## 3. Requirements
- Node.js 18+
- MongoDB (local install or MongoDB Atlas free tier)
- VS Code (or any editor)

## 4. Installation

```bash
# from the project root
cd server
npm install
cp .env.example .env      # edit values, see section 5

cd ../client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
```

## 5. Environment Variables (`server/.env`)
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/remon_academy
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
COOKIE_NAME=remon_token
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
SEED_ADMIN_EMAIL=admin@remonacademy.com
SEED_ADMIN_PASSWORD=ChangeMe123!
```

## 6. Database Setup
**Option A — Local MongoDB**: install MongoDB Community Server; it runs at `mongodb://127.0.0.1:27017` by default. No extra setup needed if you leave the default `MONGO_URI`.

**Option B — MongoDB Atlas (recommended on Windows)**:
1. Create a free cluster at https://mongodb.com/cloud/atlas
2. Create a database user + allow your IP (or 0.0.0.0/0 for local dev)
3. Copy the connection string into `MONGO_URI` in `server/.env`

## 7. Run the Backend
```bash
cd server
npm run dev
```
Runs on **http://localhost:5000**. Health check: `GET /api/health`.

## 8. Run the Frontend
Open a **second terminal**:
```bash
cd client
npm run dev
```
Runs on **http://localhost:5173** (Vite proxies `/api` and `/uploads` to the backend — no CORS issues in dev).

## 9. Seed the Database
In the `server` terminal:
```bash
npm run seed
```
This creates: 1 admin, 3 demo students, 3 courses, 3 teachers, 2 notices, sample results & attendance. It also **wipes existing data first** — only run it on a fresh/dev database.

## 10. Default Admin Login (CHANGE IMMEDIATELY)
- Email: `admin@remonacademy.com`
- Password: `ChangeMe123!`
- Change it via **Admin Dashboard → Settings** is not for password — use `POST /api/auth/forgot-password` with the admin email, or update it directly in the database, then log in again.

Demo student: `tanvir.student@example.com` / `Student123!` (Student ID also printed by the seed script, e.g. `RA-2026-0001`).

## 11. Folder Structure
```
remon-academy/
├── client/   React + Vite + TS + Tailwind frontend
│   src/{components,pages,layouts,hooks,services,context,routes,types,utils,config}
├── server/   Node + Express + TS + MongoDB backend
│   src/{config,controllers,models,routes,middleware,services,utils,seed}
│   uploads/{students,teachers,courses,gallery,notices,assignments}
```

## 12. API Overview
All responses follow `{ success, message, data }` (or `{ success:false, message, errors }`).

| Area | Base path | Notes |
|---|---|---|
| Auth | `/api/auth` | register, login, admin/login, logout, me, forgot/reset-password |
| Students | `/api/students` | admin CRUD + `/me` self-service |
| Courses | `/api/courses` | admin CRUD + `/public` for the website |
| Teachers | `/api/teachers` | admin CRUD + `/public` |
| Attendance | `/api/attendance` | admin bulk-mark + `/my` for students |
| Results | `/api/results` | admin CRUD + `/my` for students |
| Notices | `/api/notices` | admin CRUD + `/public` |
| Assignments | `/api/assignments` | admin CRUD, student `/my` + submit |
| Schedule | `/api/schedule` | admin CRUD + `/my` |
| Fees | `/api/fees` | admin CRUD + `/my` |
| Gallery | `/api/gallery` | public read, admin upload/delete |
| Contact | `/api/contact` | public submit, admin inbox |
| Settings | `/api/settings` | public read, admin update |
| Dashboard | `/api/dashboard` | public-stats, admin-stats, student-growth |

Admin-only routes require the JWT cookie with role `ADMIN`; student-only "my ___" routes resolve the logged-in user's own Student record server-side — a student can never query another student's data by changing an ID in the request.

## 13. Production Deployment (outline)
- **Backend**: `npm run build && npm start` behind a process manager (PM2) or containerize; set `NODE_ENV=production`, a strong `JWT_SECRET`, and a production `MONGO_URI` (Atlas). Put it behind HTTPS (Nginx/Caddy or a platform like Render/Railway).
- **Frontend**: `npm run build` produces static files in `client/dist` — deploy to Vercel/Netlify/Nginx. Set `VITE_API_URL` to your deployed API URL.
- **Uploads**: local disk storage works for a single server; for multi-instance or serverless deployment, swap `server/src/middleware/upload.ts` to use Cloudinary/S3 (the multer `storage` engine is the only thing that needs to change — controllers already just store whatever URL/path comes back).
- Update `CLIENT_URL` (backend CORS) and `VITE_API_URL` (frontend) to your real domains.

## 14. Troubleshooting
- **"Cannot reach the server" in the UI**: backend isn't running, or `VITE_API_URL`/proxy is misconfigured.
- **401 on every request**: cookies blocked — check `CLIENT_URL` matches the frontend origin exactly (including port) and that you're not mixing `http`/`https`.
- **MongoDB connection refused**: MongoDB isn't running locally, or your Atlas IP allowlist doesn't include your current IP.
- **Seed script wipes data you wanted to keep**: don't run `npm run seed` against a database with real data — it's for fresh dev setups only.
- **Uploads 404**: confirm `server/uploads/<folder>` exists (it's created automatically on first upload) and that you're hitting the backend's `/uploads/...` path, not the frontend's.
