# Free Server Options for Your URL Shortener

## ✅ Best Free Options (Recommended)

### 1. **Render.com** (EASIEST - Recommended)
- ✅ Free tier forever
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ MongoDB Atlas integration
- ✅ Auto-deploy from GitHub

**Steps:**
1. Go to https://render.com
2. Sign up with GitHub
3. Create new "Web Service"
4. Connect your GitHub repo
5. Settings:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm run dev`
   - Add environment variables from `server/.env`
6. Deploy!

**Free Tier Limits:**
- Sleeps after 15 min inactivity (wakes up in ~30 seconds)
- 750 hours/month
- Good for personal use

---

### 2. **Railway.app** (VERY EASY)
- ✅ $5 free credit/month
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ One-click MongoDB

**Steps:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repo
5. Railway auto-detects Node.js
6. Add environment variables
7. Deploy!

**Free Tier:**
- $5 credit/month (enough for small projects)
- No sleep time
- Better performance than Render

---

### 3. **Vercel** (For Frontend Only)
- ✅ Unlimited free deployments
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ❌ Backend needs separate hosting

**For Full Stack:**
- Deploy frontend on Vercel
- Deploy backend on Render/Railway
- Update `VITE_API_URL` in `.env`

---

### 4. **Heroku** (Classic Option)
- ✅ Free tier available
- ✅ Custom domain support
- ⚠️ Requires credit card verification

**Steps:**
1. Go to https://heroku.com
2. Create account
3. Install Heroku CLI
4. Deploy:
```bash
heroku login
heroku create your-app-name
git push heroku main
```

---

### 5. **Oracle Cloud** (Most Generous)
- ✅ Always free tier
- ✅ 2 VMs with 1GB RAM each
- ✅ Full control (like DigitalOcean)
- ⚠️ More complex setup

**Free Forever:**
- 2 AMD VMs
- 200GB storage
- 10TB bandwidth/month

---

## 🚀 Quick Deploy Guide (Render.com)

### Step 1: Setup MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (allow all)
6. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/url-shortener
   ```

### Step 2: Push Code to GitHub

```bash
cd /mnt/d/okok
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/url-shortener.git
git push -u origin main
```

### Step 3: Deploy Backend on Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Configure:
   - **Name**: `url-shortener-api`
   - **Region**: Choose closest
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run dev`

5. Add Environment Variables:
   ```
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   CUSTOM_DOMAIN=vanshtripathi.tech
   CORS_ORIGINS=https://vanshtripathi.tech,https://url-shortener-frontend.onrender.com
   ```

6. Click "Create Web Service"

### Step 4: Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect same GitHub repo
3. Configure:
   - **Name**: `url-shortener-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://url-shortener-api.onrender.com/api
   ```

5. Click "Create Static Site"

### Step 5: Connect Your Domain

**In Render:**
1. Go to your backend service
2. Settings → Custom Domain
3. Add: `api.vanshtripathi.tech`

**In get.tech DNS:**
```
Type: CNAME
Name: api
Value: url-shortener-api.onrender.com
```

**For main domain:**
```
Type: A
Name: @
Value: (Render will provide IP)
```

---

## 📊 Comparison Table

| Service | Free Tier | Sleep? | Custom Domain | MongoDB | Difficulty |
|---------|-----------|--------|---------------|---------|------------|
| **Render** | ✅ Forever | Yes (15min) | ✅ Free | Use Atlas | ⭐ Easy |
| **Railway** | $5/month | No | ✅ Free | ✅ Built-in | ⭐ Easy |
| **Vercel** | ✅ Forever | No | ✅ Free | Use Atlas | ⭐⭐ Medium |
| **Heroku** | ✅ Limited | Yes | ✅ Free | Use Atlas | ⭐⭐ Medium |
| **Oracle** | ✅ Forever | No | ✅ Free | Self-host | ⭐⭐⭐ Hard |

---

## 🎯 Recommended Setup (100% Free)

**Best combination:**
1. **Backend**: Render.com (free web service)
2. **Database**: MongoDB Atlas (free M0 cluster)
3. **Frontend**: Render.com (free static site)
4. **Domain**: Your vanshtripathi.tech

**Total Cost**: $0/month

**Limitations**:
- Backend sleeps after 15 min (wakes in ~30 sec)
- Good for personal use, demos, portfolios
- For production, upgrade to Railway ($5/month)

---

## 🔧 Alternative: Deploy Everything on Railway

**Simplest option:**
1. Push code to GitHub
2. Go to Railway.app
3. Click "New Project" → "Deploy from GitHub"
4. Railway auto-detects and deploys both frontend & backend
5. Add MongoDB from Railway marketplace (1-click)
6. Connect your domain
7. Done!

**Cost**: Uses $5 free credit (renews monthly)

---

## 📝 Quick Commands

**Check if your app is live:**
```bash
curl https://your-app.onrender.com/health
```

**View logs on Render:**
- Go to your service → Logs tab

**Redeploy:**
- Push to GitHub → Auto-deploys

---

## 🆘 Troubleshooting

**App sleeping?**
- Use UptimeRobot.com (free) to ping every 5 minutes
- Or upgrade to Railway ($5/month, no sleep)

**MongoDB connection failed?**
- Check connection string
- Verify IP whitelist: `0.0.0.0/0`
- Check username/password

**CORS errors?**
- Update `CORS_ORIGINS` in backend env
- Include your frontend URL

**Domain not working?**
- Wait 30 min for DNS propagation
- Check CNAME/A records
- Verify SSL certificate

---

## 🎉 You're All Set!

After deployment, your URLs will work:
- `https://vanshtripathi.tech/abc123`
- `https://vanshtripathi.tech/my-link`

**Next Steps:**
1. Choose a hosting platform (Render recommended)
2. Setup MongoDB Atlas
3. Push code to GitHub
4. Deploy!
5. Connect your domain

Need help? Check the platform-specific docs or ask!