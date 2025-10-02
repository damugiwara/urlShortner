# Setup for vanshtripathi.tech

## Quick Steps for Your Domain

### 1. Configure DNS at get.tech

Go to your get.tech dashboard and add these DNS records:

**A Record 1:**
```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600
```

**A Record 2:**
```
Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600
```

Replace `YOUR_SERVER_IP` with your actual server IP address.

### 2. Your Nginx Configuration

```nginx
server {
    listen 80;
    server_name vanshtripathi.tech www.vanshtripathi.tech;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL Certificate Command

```bash
sudo certbot --nginx -d vanshtripathi.tech -d www.vanshtripathi.tech
```

### 4. Production server/.env

```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/url-shortener
CUSTOM_DOMAIN=vanshtripathi.tech
CORS_ORIGINS=https://vanshtripathi.tech,https://www.vanshtripathi.tech
```

### 5. Your Short URLs Will Look Like

```
https://vanshtripathi.tech/abc123
https://vanshtripathi.tech/my-link
```

## Testing Locally First

Before deploying, test locally:

1. Start MongoDB
2. Start backend: `cd server && npm run dev`
3. Start frontend: `npm run dev`
4. Open: `http://localhost:5173`

## Deploy to Server

See `DOMAIN_SETUP.md` for complete deployment instructions.

Quick deploy commands:
```bash
# On your server
git clone YOUR_REPO
cd url-shortener
npm install
cd server && npm install && cd ..

# Setup environment
cp server/.env.example server/.env
nano server/.env
# (paste the production config above)

# Start with PM2
cd server
pm2 start npm --name "url-shortener" -- run dev
pm2 save
pm2 startup
```

## Check DNS Propagation

```bash
nslookup vanshtripathi.tech
ping vanshtripathi.tech
```

Wait 5-30 minutes after adding DNS records.

## Your URLs

- **Main site**: https://vanshtripathi.tech
- **Short URLs**: https://vanshtripathi.tech/[code]
- **API**: https://vanshtripathi.tech/api/

## Need Help?

Check `DOMAIN_SETUP.md` for detailed instructions and troubleshooting.