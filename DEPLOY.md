# Deployment Guide — Math Worksheet Project

This document walks through deploying the project using MongoDB Atlas and Vercel (recommended). It assumes the repository is already on GitHub (you pushed to `https://github.com/obie58m/math_worksheet_task_repo`).

## Quick summary
- Provider: Vercel for frontend + serverless backend
- Database: MongoDB Atlas (free tier)
- Important environment variables:
  - `MONGODB_URI` — Atlas connection string (include username/password)
  - `MONGODB_DB` — optional DB name (default: `worksheet`)
  - `VITE_API_URL` — optional, `/api` by default

---

## Preconditions
- GitHub repo exists and the code is pushed (repo root).
- Vercel account (you can sign up using GitHub).
- MongoDB Atlas account (free tier works).

## Step 1 — Create MongoDB Atlas cluster
1. Sign in at https://cloud.mongodb.com.
2. Create a new cluster (choose Free Tier / Shared). Pick a region.
3. Create a database user (Database Access → Add New Database User).
   - Use a username and password you save somewhere secure.
4. Add a Network Access rule (Network Access → Add IP Address).
   - For quick testing set `0.0.0.0/0` (open access); tighten later.
5. Click your cluster → Connect → Connect your application and copy the connection string.
   - The string looks like: `mongodb+srv://<USER>:<PASSWORD>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`

Notes:
- Do NOT commit this connection string to your repository.
- If the password has special characters, use the Atlas-generated connection string.

## Step 2 — Create a Vercel project and set environment variables
1. Sign in to https://vercel.com and click **New Project** → Import your GitHub repository.
2. Vercel will detect `vercel.json` and the frontend/backend layout. Import with the project root.
3. Open Project → Settings → Environment Variables and add:
   - `MONGODB_URI` = (paste your Atlas connection string)
   - `MONGODB_DB` = `worksheet` (optional)
   - `VITE_API_URL` = `/api` (optional)
4. Save for the Production environment (and Preview if you want PRs to use it).

## Step 3 — Deploy and watch the build
- Vercel will build automatically after import. Watch logs for:
  - Frontend: `@vercel/static-build` runs `npm run build` in `frontend`.
  - Backend: `@vercel/node` packages `backend/api/*.js` as serverless functions.

If a build step fails, open the log entry and copy the error. Common causes: missing env vars or build-time errors in code.

## Step 4 — Verify the deployment
1. Open the Vercel-assigned URL (e.g., https://<project>.vercel.app).
2. Health endpoint: `GET /api/health` should return `{ "status": "ok" }`.
3. Scores endpoint: `POST /api/scores` with JSON `{ "name": "Test", "score": 10 }` should return 201 and the record should appear in Atlas collections.

PowerShell example (replace `<project>`):

```powershell
# GET scores
Invoke-RestMethod -Uri "https://<project>.vercel.app/api/scores" -Method GET

# POST score
Invoke-RestMethod -Uri "https://<project>.vercel.app/api/scores" -Method POST -Body (@{name="Tester"; score=10} | ConvertTo-Json) -ContentType "application/json"
```

## Optional: local testing
- Frontend dev server:
```powershell
cd frontend
npm install
npm run dev
```
- Local Express backend (SQLite variant under `backend/src`):
```powershell
cd backend
npm install
npm run dev
# server runs locally (README indicates :4000)
```

## Troubleshooting
- API returns 500 or cannot connect to MongoDB:
  - Confirm `MONGODB_URI` is correct in Vercel and Atlas network access permits connections.
- POST returns 400:
  - The scores endpoint validates `name` (required) and `score` (number between 0 and 12).
- Build fails in Vercel:
  - Check build logs for missing env vars or dependency errors.

## Security & housekeeping
- After successful testing, restrict Atlas IP access from `0.0.0.0/0` to specific IPs or use more secure connectivity options.
- Rotate DB user credentials if they were shared accidentally.

---

If you want, I can now:
- Walk you through creating the Atlas cluster step-by-step (I will prompt you for the connection string and guide the next steps), OR
- Create a GitHub Actions workflow to run tests/builds on push, OR
- Proceed to create a Vercel project and set environment variables if you provide access details.

Tell me which of those you want next and I will proceed.
