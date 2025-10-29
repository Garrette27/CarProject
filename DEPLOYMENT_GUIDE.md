# Deployment Guide

## Summary

✅ Your backend is working locally!
✅ Login credentials: **admin** / **admin123**
✅ I've fixed the JWT authentication issue
✅ Backend is ready for deployment

## How to Deploy

### Step 1: Deploy Backend

You have two options:

#### Option A: Render.com (Free, Easy)
1. Go to https://render.com
2. Sign up/Login (can use GitHub)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - **Name**: `car-backend`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
6. Click "Create Web Service"
7. Wait for deployment (~5 mins)
8. Copy the URL: `https://car-backend-xxxx.onrender.com`

#### Option B: Railway.app (Alternative)
1. Go to https://railway.app
2. Sign up/Login
3. New Project → From GitHub Repo
4. Select your repo
5. Railway auto-detects Node.js
6. Set start command: `cd backend && npm start`
7. Copy the URL

### Step 2: Update Frontend Environment

1. Create `.env.production` file:
```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Update Netlify to use `.env.production`:
   - Go to Netlify site settings
   - Build & Deploy → Environment Variables
   - Add: `VITE_API_URL` = your backend URL

### Step 3: Rebuild Frontend

1. In your project root:
```bash
npm run build
```

2. Deploy `dist/` folder to Netlify

3. Or push to GitHub if using Netlify auto-deploy

## Test Your Deployment

1. Visit: https://comforting-truffle-0c5b64.netlify.app/
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. You should see your cars!

## Troubleshooting

**Backend returns 404:**
- Check if the URL is correct in `.env.production`
- Rebuild frontend after changing environment variables

**401 Unauthorized:**
- Clear browser cache and sessionStorage
- Login again

**Backend stops working:**
- Render free tier spins down after 15 min inactivity
- Visit backend URL to wake it up
- Or upgrade to paid plan

## Local Testing (Current Setup)

Your local setup is working:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Login: admin / admin123

## Files Changed

✅ `src/api/carapi.ts` - Fixed Bearer token format
✅ `backend/server.js` - Fixed JWT authentication, added proper token parsing
✅ `backend/package.json` - Ready for deployment
✅ Created deployment documentation

