# Exact Values for Render Frontend Deployment

## Copy these exact values into Render form:

### Name
```
url-shortener-frontend
```

### Project
```
(Leave empty or create new project called "url-shortener")
```

### Branch
```
main
```

### Root Directory
```
(Leave empty - no value)
```

### Build Command
```
npm install && npm run build
```

### Publish Directory
```
dist
```

### Environment Variables

Click "Add Environment Variable" and add:

**Variable 1:**
```
Key: VITE_API_URL
Value: https://url-shortener-backend.onrender.com/api
```

(Replace `url-shortener-backend` with your actual backend service name if different)

---

## After Filling Form

1. Click "Create Static Site"
2. Wait 3-5 minutes for build
3. Check logs for success
4. Get your frontend URL
5. Test it!

---

## If Build Fails

Check these:
- ✅ Branch is `main`
- ✅ Build command is correct
- ✅ Publish directory is `dist`
- ✅ Root directory is empty
- ✅ Environment variable name is `VITE_API_URL` (not `VITE_API_URL=`)

---

## Your Backend URL

If you haven't deployed backend yet, use this temporarily:
```
http://localhost:3001/api
```

Then update after backend is deployed.