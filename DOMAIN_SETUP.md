# Connect Your Personal Domain

## Step 1: Get a Server with Public IP

You need a server that's accessible from the internet. Options:
- **DigitalOcean** ($4-6/month) - https://www.digitalocean.com/
- **AWS EC2** (Free tier available) - https://aws.amazon.com/
- **Heroku** (Free tier) - https://www.heroku.com/
- **Railway** (Free tier) - https://railway.app/
- **Render** (Free tier) - https://render.com/

Get your server's public IP address (e.g., `123.45.67.89`)

## Step 2: Configure DNS Records

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)

Add these DNS records:

### A Records
```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600
```

```
Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600
```

**Example:**
- If your domain is `myshort.link`
- And server IP is `123.45.67.89`
- Then both `myshort.link` and `www.myshort.link` will point to your server

**Wait 5-30 minutes** for DNS to propagate.

## Step 3: Update server/.env

Edit `server/.env`:
```env
CUSTOM_DOMAIN=myshort.link
```

Replace `myshort.link` with your actual domain.

## Step 4: Install Nginx on Server

SSH into your server:
```bash
ssh root@YOUR_SERVER_IP
```

Install Nginx:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 5: Configure Nginx

Create config file:
```bash
sudo nano /etc/nginx/sites-available/url-shortener
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name myshort.link www.myshort.link;

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

Replace `myshort.link` with your domain.

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/url-shortener /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Install SSL Certificate (HTTPS)

Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

Get SSL certificate:
```bash
sudo certbot --nginx -d myshort.link -d www.myshort.link
```

Follow the prompts. Certbot will automatically configure HTTPS.

## Step 7: Deploy Your Application

On your server:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Clone your code
git clone YOUR_REPO_URL
cd url-shortener

# Install dependencies
npm install
cd server && npm install && cd ..

# Setup environment
cp server/.env.example server/.env
nano server/.env
```

Edit `server/.env`:
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/url-shortener
CUSTOM_DOMAIN=myshort.link
CORS_ORIGINS=https://myshort.link,https://www.myshort.link
```

## Step 8: Run with PM2 (Process Manager)

Install PM2:
```bash
sudo npm install -g pm2
```

Start the server:
```bash
cd server
pm2 start npm --name "url-shortener" -- run dev
pm2 save
pm2 startup
```

## Step 9: Test Your Domain

Open browser and go to:
```
https://myshort.link
```

You should see your URL shortener!

Create a short URL and test:
```
https://myshort.link/abc123
```

## Quick Commands Reference

**Check if domain resolves:**
```bash
nslookup myshort.link
ping myshort.link
```

**Check Nginx status:**
```bash
sudo systemctl status nginx
sudo nginx -t
```

**Check PM2 status:**
```bash
pm2 status
pm2 logs url-shortener
```

**Restart application:**
```bash
pm2 restart url-shortener
```

**View logs:**
```bash
pm2 logs url-shortener
```

## Troubleshooting

**Domain not resolving?**
- Wait 30 minutes for DNS propagation
- Check DNS records in your registrar
- Use `nslookup yourdomain.com`

**502 Bad Gateway?**
- Check if backend is running: `pm2 status`
- Check backend logs: `pm2 logs url-shortener`
- Restart: `pm2 restart url-shortener`

**SSL not working?**
- Run certbot again: `sudo certbot --nginx -d yourdomain.com`
- Check Nginx config: `sudo nginx -t`

**Can't connect to MongoDB?**
- Check if running: `sudo systemctl status mongod`
- Start it: `sudo systemctl start mongod`

## Alternative: Use Cloudflare

If you use Cloudflare for DNS:

1. Add your domain to Cloudflare
2. Point A records to your server IP
3. Enable "Proxied" (orange cloud)
4. SSL/TLS mode: "Full"
5. Cloudflare will handle SSL automatically

## Cost Estimate

- **Domain**: $10-15/year
- **Server**: $4-6/month (DigitalOcean/Linode)
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$60-90/year

## Free Alternatives

**For testing/personal use:**
- Use **Railway.app** or **Render.com** (free tier)
- They provide free subdomains like `yourapp.railway.app`
- Can connect custom domain on paid plans ($5/month)