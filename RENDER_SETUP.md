# Complete Render.com Setup Guide

## Prerequisites
- GitHub account
- Your code pushed to GitHub
- MongoDB Atlas account (free)

---

## Part 1: Setup MongoDB Atlas (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with Google or email
4. Choose "Free" tier (M0)

### Step 2: Create Cluster
1. After signup, click "Build a Database"
2. Choose "M0 Free" tier
3. Select region closest to you
4. Cluster Name: `url-shortener` (or any name)
5. Click "Create"
6. Wait 1-3 minutes for cluster creation

### Step 3: Create Database User
1. You'll see "Security Quickstart"
2. Create username: `urlshortener`
3. Create password: (save this!) or click "Autogenerate"
4. Click "Create User"

### Step 4: Setup Network Access
1. Click "Add IP Address"
2. Click "Allow Access from Anywhere"
3. This adds `0.0.0.0/0`
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string:
   ```
   mongodb+srv://urlshortener:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name before `?`:
   ```
   mongodb+srv://urlshortener:yourpassword@cluster0.xxxxx.mongodb.net/url-shortener?retryWrites=true&w=majority
   ```
7. **Save this string!** You'll need it for Render

---

## Part 2: Push Code to GitHub (5 minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `url-shortener`
4. Make it Public
5. Don't add README (we have code already)
6. Click "Create repository"

### Step 2: Push Your Code
Open terminal in your project folder:

```bash
cd /mnt/d/okok

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - URL Shortener"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/url-shortener.git

# Push
git branch -M main
git push -u origin main
```

**If you get authentication error:**
- Use GitHub Personal Access Token
- Settings → Developer settings → Personal access tokens → Generate new token
- Use token as password when pushing

---

## Part 3: Deploy Backend on Render (10 minutes)

### Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (easiest)
4. Authorize Render to access your repos

### Step 2: Create Web Service for Backend
1. Click "New +" (top right)
2. Select "Web Service"
3. Click "Connect" next to your `url-shortener` repo
4. If repo not visible, click "Configure account" and grant access

### Step 3: Configure Backend Service
Fill in these settings:

**Basic Settings:**
- **Name**: `url-shortener-backend`
- **Region**: Choose closest to you (e.g., Oregon USA)
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm run dev`

**Instance Type:**
- Select "Free" (should be selected by default)

### Step 4: Add Environment Variables
Scroll down to "Environment Variables" section.

Click "Add Environment Variable" for each:

```
Key: PORT
Value: 3001
```

```
Key: NODE_ENV
Value: production
```

```
Key: MONGODB_URI
Value: mongodb+srv://urlshortener:yourpassword@cluster0.xxxxx.mongodb.net/url-shortener?retryWrites=true&w=majority
```
(Use your actual MongoDB connection string from Part 1)

```
Key: CUSTOM_DOMAIN
Value: vanshtripathi.tech
```

```
Key: CORS_ORIGINS
Value: https://vanshtripathi.tech,https://url-shortener-frontend.onrender.com
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 2-5 minutes for deployment
3. Watch the logs - should see:
   ```
   ✅ MongoDB connected successfully
   🚀 Server running on port 3001
   ```

### Step 6: Get Backend URL
1. After deployment, you'll see your service URL:
   ```
   https://url-shortener-backend.onrender.com
   ```
2. **Copy this URL** - you'll need it for frontend

### Step 7: Test Backend
Open in browser:
```
https://url-shortener-backend.onrender.com/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-..."}
```

✅ Backend is live!

---

## Part 4: Deploy Frontend on Render (10 minutes)

### Step 1: Update Frontend Environment
Before deploying frontend, we need to update the API URL.

**Option A: Update in Render (Recommended)**
We'll add it as environment variable in Render.

**Option B: Update .env file**
Edit `.env`:
```
VITE_API_URL=https://url-shortener-backend.onrender.com/api
```
Commit and push:
```bash
git add .env
git commit -m "Update API URL for production"
git push
```

### Step 2: Create Static Site for Frontend
1. Go back to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect same `url-shortener` repo

### Step 3: Configure Frontend Service
Fill in these settings:

**Basic Settings:**
- **Name**: `url-shortener-frontend`
- **Branch**: `main`
- **Root Directory**: (leave empty)

**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Step 4: Add Environment Variable
Add this environment variable:

```
Key: VITE_API_URL
Value: https://url-shortener-backend.onrender.com/api
```
(Use your actual backend URL from Part 3)

### Step 5: Deploy
1. Click "Create Static Site"
2. Wait 3-5 minutes for build
3. Watch logs for successful build

### Step 6: Get Frontend URL
After deployment:
```
https://url-shortener-frontend.onrender.com
```

### Step 7: Update Backend CORS
1. Go to backend service
2. Environment → Edit `CORS_ORIGINS`
3. Update to:
   ```
   https://vanshtripathi.tech,https://url-shortener-frontend.onrender.com
   ```
4. Save changes (backend will redeploy)

### Step 8: Test Frontend
Open in browser:
```
https://url-shortener-frontend.onrender.com
```

You should see your URL shortener interface!

**Test it:**
1. Enter a URL: `https://google.com`
2. Click "Shorten URL"
3. You'll get: `https://url-shortener-backend.onrender.com/abc123`
4. Click it - should redirect to Google!

✅ Frontend is live!

---

## Part 5: Connect Your Domain (Optional, 15 minutes)

### Step 1: Setup Backend Custom Domain

**In Render:**
1. Go to backend service
2. Click "Settings"
3. Scroll to "Custom Domain"
4. Click "Add Custom Domain"
5. Enter: `api.vanshtripathi.tech`
6. Render will show DNS instructions

**In get.tech DNS:**
1. Go to your domain dashboard
2. Add CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: url-shortener-backend.onrender.com
   TTL: 3600
   ```
3. Save

Wait 5-30 minutes for DNS propagation.

### Step 2: Setup Frontend Custom Domain

**In Render:**
1. Go to frontend service
2. Settings → Custom Domain
3. Add: `vanshtripathi.tech`
4. Render provides instructions

**In get.tech DNS:**
Add A record:
```
Type: A
Name: @
Value: (IP provided by Render)
TTL: 3600
```

Add CNAME for www:
```
Type: CNAME
Name: www
Value: url-shortener-frontend.onrender.com
TTL: 3600
```

### Step 3: Update Environment Variables

**Backend:**
Update `CORS_ORIGINS`:
```
https://vanshtripathi.tech,https://www.vanshtripathi.tech
```

**Frontend:**
Update `VITE_API_URL`:
```
https://api.vanshtripathi.tech/api
```

Both services will auto-redeploy.

### Step 4: Test Your Domain
After DNS propagation (30 min):
```
https://vanshtripathi.tech
```

Create short URL - it will be:
```
https://api.vanshtripathi.tech/abc123
```

✅ Custom domain working!

---

## 🎉 You're Done!

Your URL shortener is now live at:
- **Frontend**: https://url-shortener-frontend.onrender.com
- **Backend**: https://url-shortener-backend.onrender.com
- **With domain**: https://vanshtripathi.tech

---

## 📊 What You Have Now

✅ Backend API running on Render
✅ Frontend hosted on Render
✅ MongoDB database on Atlas
✅ Automatic HTTPS
✅ Free forever (with limitations)

**Limitations:**
- Services sleep after 15 min inactivity
- Wake up in ~30 seconds on first request
- 750 hours/month free

---

## 🔧 Managing Your App

### View Logs
1. Go to Render Dashboard
2. Click on service
3. Click "Logs" tab

### Redeploy
1. Push changes to GitHub
2. Render auto-deploys

### Manual Deploy
1. Go to service
2. Click "Manual Deploy" → "Deploy latest commit"

### Environment Variables
1. Go to service
2. Click "Environment"
3. Edit variables
4. Service auto-redeploys

### Check Status
Backend health:
```
https://url-shortener-backend.onrender.com/health
```

### View Database
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. See your shortened URLs

---

## 🆘 Troubleshooting

### "Service Unavailable"
- Service is sleeping
- Wait 30 seconds and refresh
- Or use UptimeRobot to keep it awake

### "MongoDB connection failed"
- Check connection string in environment variables
- Verify IP whitelist in Atlas: `0.0.0.0/0`
- Check username/password

### "CORS Error"
- Update `CORS_ORIGINS` in backend
- Include your frontend URL
- Redeploy backend

### Build Failed
- Check logs in Render
- Verify `package.json` is correct
- Check build command

### Domain Not Working
- Wait 30 minutes for DNS
- Check DNS records
- Verify CNAME/A records

---

## 💡 Tips

**Keep Service Awake:**
Use UptimeRobot.com (free):
1. Sign up at https://uptimerobot.com
2. Add monitor
3. URL: `https://url-shortener-backend.onrender.com/health`
4. Interval: 5 minutes
5. Pings your service every 5 min

**Upgrade to Paid ($7/month):**
- No sleep time
- Better performance
- More resources

**Monitor Usage:**
- Render Dashboard shows usage
- 750 hours/month free
- Resets monthly

---

## 📝 Quick Reference

**Render Dashboard:**
https://dashboard.render.com

**MongoDB Atlas:**
https://cloud.mongodb.com

**Your Services:**
- Backend: https://url-shortener-backend.onrender.com
- Frontend: https://url-shortener-frontend.onrender.com

**Important URLs:**
- Health Check: `/health`
- API Base: `/api`
- Redirect: `/:shortCode`

---

Need help? Check Render docs or ask!