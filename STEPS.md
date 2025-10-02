# Setup Steps

## Step 1: Install Node.js
Download and install from: https://nodejs.org/
(Need version 18 or higher)

## Step 2: Install MongoDB
**Option A:** Download from https://www.mongodb.com/try/download/community
**Option B:** Create free account at https://www.mongodb.com/cloud/atlas and get connection string

## Step 3: Install dependencies
```bash
npm install
```

## Step 4: Install server dependencies
```bash
cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

If on Windows and rm doesn't work, manually delete the `node_modules` folder in server directory, then run `npm install`

## Step 5: Create .env file
```bash
cp .env.example .env
```

## Step 6: Create server/.env file
```bash
cp server/.env.example server/.env
```

## Step 7: Edit server/.env
Open `server/.env` and set:
- If using local MongoDB: `MONGODB_URI=mongodb://localhost:27017/url-shortener`
- If using Atlas: `MONGODB_URI=your_atlas_connection_string`

## Step 8: Start backend (keep this terminal open)
```bash
cd server
npm run dev
```
Wait for "MongoDB connected successfully"

**Note:** To stop the server, press Ctrl+C. To restart after code changes, run `npm run dev` again.

## Step 9: Start frontend (open NEW terminal)
```bash
npm run dev
```

## Step 10: Open browser
Go to: http://localhost:5173

Done!