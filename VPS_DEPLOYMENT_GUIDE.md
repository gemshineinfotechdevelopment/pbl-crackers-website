# 🚀 PBL Crackers Website - Complete VPS Deployment Guide

This guide gives you complete, step-by-step instructions to deploy the **PBL Crackers** e-commerce website (React Vite Frontend + Node.js Express Backend on **Port 5019** + **Local MongoDB Database** + Nginx Reverse Proxy + PM2 Process Manager + Free SSL Certificate) on your VPS (Ubuntu 22.04 / 24.04) for the subdomain **`pbl-crackers.gemshine.tech`**.

---

## 🏗️ Architecture Overview

```
                                  Internet (User Request)
                                             │
                                             ▼
                      [ Nginx Reverse Proxy (Port 80 / 443 HTTPS SSL) ]
                            Domain: pbl-crackers.gemshine.tech
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
            Frontend (/ & /assets/*)                     Backend API (/api/* & /uploads/*)
                       │                                           │
                       ▼                                           ▼
             Static React SPA Files                   Node.js Express Server (Port 5019)
          (/var/www/pbl-crackers/dist)                 Managed by PM2 (pbl-crackers-backend)
                                                                   │
                                                                   ▼
                                                       [ Local MongoDB Server ]
                                                      mongodb://127.0.0.1:27017/pbl_crackers_db
```

---

## 📋 Summary of Configured Settings

| Component | Setting / Value |
|---|---|
| **Subdomain** | `pbl-crackers.gemshine.tech` |
| **Backend API Port** | `5019` |
| **PM2 Process Name** | `pbl-crackers-backend` |
| **PM2 Ecosystem File** | `ecosystem.config.cjs` |
| **Nginx Site Config** | `/etc/nginx/sites-available/pbl-crackers.gemshine.tech.conf` |
| **Frontend Root** | `/var/www/pbl-crackers/dist` |
| **Database** | MongoDB (Local: `mongodb://127.0.0.1:27017/pbl_crackers_db`) |
| **Default Admin Email** | `cracker@PBL.com` |
| **Default Admin Password** | `PBL123` |

---

## ⚡ Step 1: VPS Base Setup & Dependencies

Connect to your VPS via SSH:
```bash
ssh root@YOUR_VPS_IP
```

### 1. Update system packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget gnupg ufw nginx
```

### 2. Install Node.js (v20 LTS) & npm
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation:
node -v   # Should show v20.x.x
npm -v    # Should show v10.x.x
```

### 3. Install PM2 globally
```bash
sudo npm install -g pm2
```

---

## 🍃 Step 2: Install & Setup Local MongoDB on VPS

### 1. Import MongoDB GPG Public Key
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
  --dearmor --yes
```

### 2. Add MongoDB Repository (Select based on your Ubuntu version)

- **For Ubuntu 24.04 (Noble)**:
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

- **For Ubuntu 22.04 (Jammy)**:
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

- **For Ubuntu 20.04 (Focal)**:
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

### 3. Install MongoDB Server
```bash
sudo apt update
sudo apt install -y mongodb-org
```

### 4. Start & Enable MongoDB on Boot
```bash
sudo systemctl daemon-reload
sudo systemctl enable mongod
sudo systemctl start mongod

# Check status (Must show active / running):
sudo systemctl status mongod --no-pager
```

### 5. (Optional but Recommended) Create Database User for Security
Open `mongosh` terminal:
```bash
mongosh
```
Run the following commands inside `mongosh`:
```javascript
use admin
db.createUser({
  user: "admin",
  pwd: "YourStrongAdminPasswordHere",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})

use pbl_crackers_db
db.createUser({
  user: "pbl_user",
  pwd: "YourPblDbPasswordHere",
  roles: [ { role: "readWrite", db: "pbl_crackers_db" } ]
})

exit
```

> **Note**: If you created credentials, your connection string in `server/.env` will be:  
> `MONGODB_URI=mongodb://pbl_user:YourPblDbPasswordHere@127.0.0.1:27017/pbl_crackers_db?authSource=admin`  
> If you didn't set a password, use the simple local URI:  
> `MONGODB_URI=mongodb://127.0.0.1:27017/pbl_crackers_db`

---

## 📁 Step 3: Clone & Setup Project on VPS

### 1. Create Web Directory
```bash
sudo mkdir -p /var/www/pbl-crackers
sudo chown -R $USER:$USER /var/www/pbl-crackers
```

### 2. Clone the Repository
```bash
cd /var/www/pbl-crackers
git clone <YOUR_GIT_REPO_URL> .
```

### 3. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

---

## ⚙️ Step 4: Configure Environment Variables

### 1. Backend `.env` (`/var/www/pbl-crackers/server/.env`)
Create or edit `server/.env`:
```bash
nano /var/www/pbl-crackers/server/.env
```
Paste the following production configuration:
```env
PORT=5019
NODE_ENV=production

# Frontend URL
CLIENT_URL=https://pbl-crackers.gemshine.tech,http://pbl-crackers.gemshine.tech,http://localhost:5019

# Local MongoDB on VPS:
MONGODB_URI=mongodb://127.0.0.1:27017/pbl_crackers_db
# Or if you configured MongoDB auth:
# MONGODB_URI=mongodb://pbl_user:YourPblDbPasswordHere@127.0.0.1:27017/pbl_crackers_db?authSource=admin

# JWT Authentication Secret
JWT_SECRET=pbl_crackers_super_secret_jwt_key_2026

# Admin Credentials (Auto-created on first run)
ADMIN_EMAIL=cracker@PBL.com
ADMIN_PASSWORD=PBL123

# Cloudinary Storage for Cracker Images & Banners
CLOUDINARY_CLOUD_NAME=daxl7y5um
CLOUDINARY_API_KEY=579937718567788
CLOUDINARY_API_SECRET=e2euCuyOQycviFSHMYhBK-miEKQ
```

### 2. Frontend `.env.production` (`/var/www/pbl-crackers/.env.production`)
Create or verify `.env.production`:
```bash
nano /var/www/pbl-crackers/.env.production
```
Content (empty value allows seamless `/api` proxy through Nginx without CORS errors):
```env
VITE_API_URL=
```

### 3. Initialize & Test MongoDB Database
Test database connection and seed initial products & admin user:
```bash
cd /var/www/pbl-crackers/server
npm run init-db
cd ..
```
*Expected output: `✅ MongoDB connected & initialized successfully!`*

---

## 🔨 Step 5: Build Frontend & Start Backend via PM2

### 1. Build the React Vite Application
```bash
cd /var/www/pbl-crackers
npm run build
```
*This outputs production files to `/var/www/pbl-crackers/dist`.*

### 2. Start PM2 Process (Port 5019)
```bash
# Start backend using ecosystem file
pm2 start ecosystem.config.cjs

# Save PM2 state so it restarts automatically on VPS reboot:
pm2 save
pm2 startup
# (Run the sudo env PATH=... command that pm2 outputs if prompted)
```

### 3. Verify Backend Status
```bash
# Check running status:
pm2 status

# Test local API response on Port 5019:
curl http://127.0.0.1:5019/api/health
# Expected output: {"status":"ok","message":"API is healthy", ...}
```

---

## 🌐 Step 6: Configure Nginx Reverse Proxy

### 1. Copy the Nginx Configuration File
```bash
sudo cp /var/www/pbl-crackers/nginx/pbl-crackers.gemshine.tech.conf /etc/nginx/sites-available/pbl-crackers.gemshine.tech.conf
```

### 2. Enable the Site (Create Symlink)
```bash
sudo ln -sf /etc/nginx/sites-available/pbl-crackers.gemshine.tech.conf /etc/nginx/sites-enabled/
```

### 3. Test & Reload Nginx
```bash
sudo nginx -t
# Should output: syntax is ok, test is successful

sudo systemctl restart nginx
```

---

## 🔒 Step 7: Setup Free SSL with Let's Encrypt (Certbot)

Make sure your DNS `A Record` is pointing to your VPS IP:
- Host: `pbl-crackers`
- Domain: `gemshine.tech`
- Points to: `YOUR_VPS_IP`

### 1. Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtain & Configure SSL Certificate
```bash
sudo certbot --nginx -d pbl-crackers.gemshine.tech
```
*Follow the on-screen prompts (enter your email and agree to terms). Certbot will automatically update the Nginx configuration to enable HTTPS on Port 443 with auto-renewal!*

---

## 🔥 Step 8: Configure Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

---

## ✅ Step 9: Verification & Testing

1. Open your browser and visit: **`https://pbl-crackers.gemshine.tech`**
2. Check that the homepage loads with product categories and crackers.
3. Open Admin Login: **`https://pbl-crackers.gemshine.tech/admin/login`**
   - **Email:** `cracker@PBL.com`
   - **Password:** `PBL123`
4. Test adding or editing a product, category, or banner.
5. Check backend logs at any time:
   ```bash
   pm2 logs pbl-crackers-backend
   ```

---

## 🔄 Routine Updates (One-Click Deploy)

Whenever you push new code to your Git repository, simply run this single command on your VPS:
```bash
cd /var/www/pbl-crackers
bash deploy.sh
```
The script will automatically:
1. Pull new changes from Git
2. Install any newly added npm packages
3. Rebuild the frontend (`npm run build`)
4. Reload the PM2 backend service with zero downtime (`pm2 reload ecosystem.config.cjs`)

---

## 🛠️ Helpful VPS Maintenance Commands

| Action | Command |
|---|---|
| View PM2 Real-time Logs | `pm2 logs pbl-crackers-backend` |
| Restart Backend API | `pm2 restart pbl-crackers-backend` |
| View Backend Memory / CPU | `pm2 monit` |
| Restart Nginx | `sudo systemctl restart nginx` |
| Test Nginx Configuration | `sudo nginx -t` |
| Check MongoDB Status | `sudo systemctl status mongod` |
| Backup MongoDB Database | `mongodump --db=pbl_crackers_db --out=/backup/$(date +%F)` |
| Restore MongoDB Database | `mongorestore --db=pbl_crackers_db /backup/2026-XX-XX/pbl_crackers_db` |
