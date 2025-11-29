# 🚀 Deploy PN_NEWS to Render

This guide will help you deploy your Prathinityam News Portal to Render with MongoDB Atlas.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Cloudinary Account** (Optional but recommended) - Sign up at [cloudinary.com](https://cloudinary.com)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create a MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in or create a free account
3. Click **"Build a Database"**
4. Choose **"M0 FREE"** tier
5. Select a cloud provider and region (choose one close to your Render region)
6. Click **"Create"**

### 1.2 Configure Network Access

1. In Atlas dashboard, click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Render to connect
4. Click **"Confirm"**

### 1.3 Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username (e.g., `prathinityam_admin`)
5. Click **"Autogenerate Secure Password"** and **SAVE IT**
6. Set user privileges to **"Read and write to any database"**
7. Click **"Add User"**

### 1.4 Get Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database password
7. Add database name before the `?` - final string should look like:
   ```
   mongodb+srv://prathinityam_admin:YourPassword@cluster0.xxxxx.mongodb.net/prathinityam_news_portal?retryWrites=true&w=majority
   ```

**IMPORTANT:** Save this connection string - you'll need it for Render!

---

## ☁️ Step 2: Set Up Cloudinary (Optional but Recommended)

### 2.1 Create Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account

### 2.2 Get API Credentials

1. In your Cloudinary dashboard, you'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
2. **SAVE THESE** - you'll need them for Render

---

## 🚢 Step 3: Push Code to GitHub

Make sure your code is pushed to GitHub:

```bash
cd /home/rguktvalley/Documents/PN_NEWS

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/Hadassah627/first_repo.git

# Push to GitHub
git push -u origin main
```

---

## 🌐 Step 4: Deploy to Render

### 4.1 Create New Web Service

1. Log in to [Render](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your `first_repo` repository

### 4.2 Configure the Service

**Basic Settings:**
- **Name:** `prathinityam-news-portal`
- **Region:** Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:**
  ```bash
  npm install && cd ../frontend && npm install && npm run build && cd ../backend
  ```
- **Start Command:**
  ```bash
  node server.js
  ```

### 4.3 Configure Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `10000` | Render default |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate a random string | Use: `openssl rand -base64 32` |
| `ADMIN_EMAIL` | `admin@prathinityam.com` | Your admin email |
| `ADMIN_PASSWORD` | Strong password | Create a strong password |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Your API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Your API secret | From Cloudinary dashboard |

**To generate JWT_SECRET on your computer:**
```bash
openssl rand -base64 32
```

### 4.4 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your app
3. Wait for deployment (usually 5-10 minutes)
4. You'll get a URL like: `https://prathinityam-news-portal.onrender.com`

---

## 🔧 Step 5: Post-Deployment Setup

### 5.1 Seed Admin Account

After the first successful deployment:

1. Go to your Render dashboard
2. Click on your service
3. Click **"Shell"** tab (opens a terminal)
4. Run:
   ```bash
   npm run seed-admin
   ```
5. This creates your admin account

### 5.2 Test Your Deployment

1. Visit your Render URL: `https://prathinityam-news-portal.onrender.com`
2. Try logging in with:
   - Email: `admin@prathinityam.com` (or your configured email)
   - Password: (your configured password)

---

## 🐛 Troubleshooting

### Issue: "Application failed to respond"

**Solution:**
- Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct

### Issue: "Database connection failed"

**Solution:**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check database user credentials
- Ensure connection string format is correct

### Issue: "Cannot upload images/videos"

**Solution:**
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for usage limits
- Review Render logs for specific upload errors

### Issue: "App is slow to respond"

**Solution:**
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid plan for always-on service

### Check Logs

To view logs in Render:
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Look for error messages

---

## 📊 Monitoring & Maintenance

### View Application Logs
- Render Dashboard → Your Service → **Logs** tab

### Monitor Database Usage
- MongoDB Atlas → Clusters → **Metrics** tab

### Monitor File Uploads
- Cloudinary → Dashboard → **Usage**

### Redeploy
- Render automatically redeploys when you push to GitHub
- Manual redeploy: Service Dashboard → **Manual Deploy** → **Deploy latest commit**

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong passwords** for admin and database
3. **Rotate JWT_SECRET** periodically
4. **Monitor logs** for suspicious activity
5. **Keep dependencies updated**:
   ```bash
   npm audit
   npm update
   ```

---

## 💰 Cost Breakdown (Free Tier)

| Service | Free Tier Limits |
|---------|------------------|
| **Render** | 750 hours/month, sleeps after 15 min inactivity |
| **MongoDB Atlas** | 512 MB storage, shared RAM |
| **Cloudinary** | 25 GB storage, 25 GB bandwidth/month |

---

## 🚀 Upgrade Options

### To prevent app sleeping:
- Upgrade to Render **Starter Plan** ($7/month)
- Keeps your app always running

### For more database storage:
- Upgrade MongoDB Atlas to **M10 Shared** ($0.08/hour ≈ $57/month)

### For more media storage:
- Upgrade Cloudinary **Plus Plan** ($89/month)

---

## 📝 Important URLs

After deployment, save these URLs:

- **Your App:** `https://prathinityam-news-portal.onrender.com`
- **API Health Check:** `https://prathinityam-news-portal.onrender.com/api/health`
- **Render Dashboard:** `https://dashboard.render.com`
- **MongoDB Atlas:** `https://cloud.mongodb.com`
- **Cloudinary:** `https://cloudinary.com/console`

---

## 🆘 Need Help?

1. Check Render logs first
2. Review this guide again
3. Check [Render Documentation](https://render.com/docs)
4. Check [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
5. Contact support through respective platforms

---

## ✅ Deployment Checklist

Before going live:

- [ ] MongoDB Atlas cluster created and configured
- [ ] Network access allows 0.0.0.0/0
- [ ] Database user created with credentials saved
- [ ] Cloudinary account created (if using media uploads)
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] All environment variables configured
- [ ] Deployment successful (check logs)
- [ ] Admin account seeded
- [ ] Login tested successfully
- [ ] Image/video upload tested (if using Cloudinary)
- [ ] All main features tested

---

🎉 **Congratulations!** Your PN_NEWS portal is now live on Render!

For updates, just push to GitHub and Render will automatically redeploy.
