# Math Worksheet - Rounding to Nearest 10

This project is a small web app (Vue 3 frontend) that implements a Grade-4 worksheet for "Rounding Off to Nearest 10" and an optional backend to store high scores.

Files of interest:
- `frontend/` — Vue 3 app (Vite). Contains the UI, questions, and styling.
- `backend/api/` — serverless API endpoints written for Node (MongoDB-backed). Contains `/api/scores` used to store and fetch high scores.
- `backend/src/` — an alternate Express + SQLite server (for local development). Note: Vercel deployment uses `backend/api` by default.

Live deployment guidance (recommended):

1. Create a MongoDB Atlas cluster (free tier is fine).
   - Create a database user and whitelist the IPs or allow access from anywhere.
   - Obtain the connection string (it looks like `mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`).

2. Create a GitHub repository and push this project.

3. Deploy on Vercel
   - Go to https://vercel.com and create a new project from the GitHub repo.
   - In Vercel project settings -> Environment Variables add:
     - `MONGODB_URI` = your connection string (include credentials)
     - (optional) `MONGODB_DB` = the DB name (defaults to `worksheet`)
     - (optional) `VITE_API_URL` = leave blank so frontend talks to `/api` on same domain
   - Vercel will use the existing `vercel.json` which:
     - Builds `frontend` with `@vercel/static-build` (Vite build)
     - Deploys `backend/api/*.js` as serverless Node functions
     - Routes `/api/*` to `backend/api/*` and serves compiled frontend from `/frontend/dist`

4. Test the deployed site
   - Open the site URL from Vercel.
   - Enter your name and answer questions.
   - Click `Submit` — the app should POST to `/api/scores` and store your result in MongoDB.

Local development
1. Frontend
   - cd frontend
   - npm install
   - npm run dev

2. Backend (serverless endpoints, local emulation not included)
   - The `backend/api` serverless functions expect MongoDB and are designed for serverless hosts (Vercel). For local development with SQLite, see `backend/src`.

3. Express SQLite server (local alternative)
   - cd backend
   - npm install
   - npm run dev
   - This will start an Express server on `localhost:4000` that exposes `/api/scores` backed by `db.sqlite`.

Notes and recommendations
- The repository contains two backend approaches: serverless MongoDB (`backend/api`) and an Express+SQLite server (`backend/src`). For Vercel deployment keep using `backend/api` and provide `MONGODB_URI`. If you'd rather use the SQLite server, deploy it on a host that supports persistent files and a long-running Node process and update the frontend `VITE_API_URL` to point to it.
- If you want, I can add a small setup script, convert the serverless API to use SQLite-compatible filenames for serverless (not recommended), or remove the unused backend variant.

License and attribution
- Worksheet content reproduced from: https://www.mathinenglish.com — included in the app footer.

If you'd like, I can implement a small set of fixes first (preserve name on reset, better API error handling, small accessibility improvements) and then deploy to Vercel for you. Tell me which route you prefer: I deploy using MongoDB Atlas + Vercel, or I adapt the app to your preferred hosting.
# Math Worksheet Project

This repo contains a Vue 3 frontend and serverless backend API for logging high scores. The app reproduces the "Rounding Off to Nearest 10" worksheet and allows users to submit their name and score.

Main folders:
- `frontend/` - Vue 3 app (Vite).
- `backend/` - serverless API endpoints (for Vercel) using MongoDB.

Quick local run (frontend):

```powershell
cd frontend
npm install
npm run dev
```

Backend (local testing):
- The backend is written as Vercel-style serverless functions under `backend/api`. You need a `MONGODB_URI` environment variable pointing to a MongoDB Atlas cluster.

Deployment to Vercel (recommended):
1. Create a GitHub repo and push the project.
2. Create a MongoDB Atlas cluster and get the connection string (replace password and whitelist Vercel IPs or use Atlas IP access rules).
3. In Vercel, import the GitHub repo and set environment variables:
   - `MONGODB_URI` - MongoDB connection string
   - `MONGODB_DB` - (optional) database name, default `worksheet`
4. Set Vercel project root to repo root; Vercel will detect frontend and backend folders. The API routes will be available under `https://<proj>.vercel.app/api/<route>`.

Set `VITE_API_URL` environment variable in Vercel to `/api` (default) or the full URL if needed.

Notes:
- I switched the backend from SQLite to MongoDB for compatibility with serverless hosting.
- `backend/api` contains `scores.js` and `health.js` endpoints.

First-time GitHub push (PowerShell)

1. Create a new repository on GitHub (do not initialize with README or .gitignore).

2. From your project root run:

```powershell
git init
git add .
git commit -m "Initial commit - math worksheet frontend and serverless backend"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Replace `<your-username>` and `<your-repo>` with your GitHub username and the repo name.

Setting Vercel environment variables (quick notes):
- Go to your Vercel project > Settings > Environment Variables.
- Add `MONGODB_URI` with the Atlas connection string and `MONGODB_DB` (optional).
- Add `VITE_API_URL` = `/api` if you need it.
