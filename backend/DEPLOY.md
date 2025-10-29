# Deploy Backend to Render.com

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: car-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Auto-Deploy**: Yes
5. Click "Create Web Service"
6. Copy the URL (e.g., `https://car-backend.onrender.com`)
7. Update frontend `.env` with: `VITE_API_URL=your-render-url`
8. Rebuild and redeploy frontend

## Alternative: Railway

1. Go to https://railway.app and sign up/login
2. Click "New Project" → "GitHub Repo"
3. Select your repository
4. Railway will detect Node.js and deploy automatically
5. Copy the URL
6. Update frontend `.env` and redeploy

