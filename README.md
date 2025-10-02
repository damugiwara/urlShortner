# URL Shortener with Custom Domain & Database

A full-stack URL shortener application with MongoDB database storage and custom domain support.

## Features

✅ **Database Storage**: MongoDB for persistent URL storage
✅ **Custom Domains**: Support for custom domain configuration
✅ **Custom Short Codes**: Create personalized short URLs
✅ **Expiration Dates**: Set URLs to expire after a certain time
✅ **Click Tracking**: Track clicks and analytics for each URL
✅ **RESTful API**: Complete backend API for URL management
✅ **Modern UI**: Beautiful React interface with Material-UI

## Tech Stack

### Frontend
- React 19 + TypeScript
- Material-UI (MUI) v7
- Redux Toolkit + RTK Query
- React Router v7
- Vite

### Backend
- Node.js + Express
- MongoDB + Mongoose
- TypeScript
- nanoid for short code generation

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 2. Configure Environment Variables

**Frontend (.env):**
```bash
cp .env.example .env
```
Edit `.env`:
```
VITE_API_URL=http://localhost:3001/api
```

**Backend (server/.env):**
```bash
cd server
cp .env.example .env
```
Edit `server/.env`:
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/url-shortener
CUSTOM_DOMAIN=yourdomain.com
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas:**
Update `MONGODB_URI` in `server/.env` with your Atlas connection string.

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:3001`

## API Endpoints

### Create Short URL
```
POST /api/shorten
Body: {
  "originalUrl": "https://example.com/long-url",
  "customCode": "my-link",  // optional
  "customDomain": "short.io",  // optional
  "expiresIn": 30  // optional, days
}
```

### Get All URLs
```
GET /api/urls?page=1&limit=20
```

### Get URL by Short Code
```
GET /api/urls/:shortCode
```

### Delete URL
```
DELETE /api/urls/:shortCode
```

### Redirect (Short URL)
```
GET /:shortCode
```

### Get Analytics
```
GET /api/analytics/:shortCode
```

## Custom Domain Setup

### 1. Configure DNS
Point your custom domain to your server's IP address:
```
A Record: @ -> YOUR_SERVER_IP
A Record: www -> YOUR_SERVER_IP
```

### 2. Update Environment Variables
Set `CUSTOM_DOMAIN` in `server/.env`:
```
CUSTOM_DOMAIN=yourdomain.com
```

### 3. Configure Reverse Proxy (Production)

**Nginx example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Certificate (Recommended)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Production Deployment

### 1. Build Frontend
```bash
npm run build
```

### 2. Build Backend
```bash
cd server
npm run build
```

### 3. Start Production Server
```bash
cd server
NODE_ENV=production npm start
```

### 4. Serve Frontend
Use a static file server (nginx, Apache) or serve from Express.

## Database Schema

### URL Document
```typescript
{
  shortCode: string;        // Unique short code
  originalUrl: string;      // Original long URL
  customDomain?: string;    // Custom domain if specified
  createdAt: Date;          // Creation timestamp
  clicks: number;           // Click count
  lastClickedAt?: Date;     // Last click timestamp
  expiresAt?: Date;         // Expiration date
  userId?: string;          // User ID (for future auth)
}
```

## Advanced Features

### Custom Short Codes
Users can specify their own short codes (3-20 characters, alphanumeric + hyphens/underscores).

### URL Expiration
Set URLs to automatically expire after a specified number of days.

### Analytics
Track clicks, creation date, and last accessed time for each URL.

### Pagination
Efficiently browse through large numbers of URLs with pagination support.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `server/.env`
- For Atlas, ensure IP whitelist is configured

### CORS Errors
- Update `CORS_ORIGINS` in `server/.env`
- Include your frontend URL in the list

### Port Already in Use
- Change `PORT` in `server/.env`
- Update `VITE_API_URL` in frontend `.env`

## License

MIT