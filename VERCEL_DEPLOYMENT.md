# 🚀 Deploy PN_NEWS to Vercel

This guide shows you how to deploy your Prathinityam News Portal to Vercel.

**Important:** Vercel works differently from Render. We'll deploy:
- **Backend API** → Separate Vercel project
- **Frontend** → Separate Vercel project

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account** - Code must be on GitHub
3. **MongoDB Atlas Account** - Database (already set up ✅)
4. **Cloudinary Account** - Image/video hosting (already set up ✅)

---

## 🎯 Deployment Strategy

Unlike Render (which hosts both together), Vercel deploys them separately:

```
Frontend (Vercel)  →  Backend API (Vercel)  →  MongoDB Atlas
```

---

## 🔙 PART 1: Deploy Backend API

### **Step 1: Push Code to GitHub**

```bash
cd /home/rguktvalley/Documents/PN_NEWS
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### **Step 2: Create New Vercel Project for Backend**

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repository: `Hadassah627/PN_NEWS`
5. Click **"Import"**

### **Step 3: Configure Backend Project**

**Framework Preset:** Other

**Root Directory:** Click **"Edit"** → Enter: `backend`

**Build Command:** Leave empty (no build needed for API)

**Output Directory:** Leave empty

**Install Command:** `npm install`

### **Step 4: Add Environment Variables**

Click **"Environment Variables"** and add these **9 variables**:

| Variable Name | Value |
|---------------|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://pn_news_admin:PNNews2024@cluster0.z8clrr8.mongodb.net/prathinityam_news_portal?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `KmRkAffAP1qQWDWtHWgbaqqzwpGxsepPHHt6bc+SaI0=` |
| `ADMIN_EMAIL` | `admin@prathinityam.com` |
| `ADMIN_PASSWORD` | `Admin@123` |
| `CLOUDINARY_CLOUD_NAME` | `dftrc4wbs` |
| `CLOUDINARY_API_KEY` | `648943885131437` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `PORT` | `3000` (Vercel uses this) |

### **Step 5: Deploy Backend**

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://pn-news-backend.vercel.app`

**Save this URL!** You'll need it for the frontend.

---

## 🎨 PART 2: Deploy Frontend

### **Step 1: Update Frontend API Configuration**

Before deploying frontend, we need to point it to the backend URL.

Create a new file `.env.production` in the `frontend` folder:

```bash
VITE_API_URL=https://your-backend-url.vercel.app
```

Replace `your-backend-url.vercel.app` with your actual backend Vercel URL from Part 1.

### **Step 2: Update API Service**

The frontend needs to use the backend URL. Check `frontend/src/services/api.js`:

```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});
```

This is already configured to use the environment variable!

### **Step 3: Create New Vercel Project for Frontend**

1. Go back to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **SAME repository**: `Hadassah627/PN_NEWS`
4. Click **"Import"**

### **Step 4: Configure Frontend Project**

**Framework Preset:** Vite

**Root Directory:** Click **"Edit"** → Enter: `frontend`

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

### **Step 5: Add Frontend Environment Variable**

Click **"Environment Variables"** and add:

| Variable Name | Value |
|---------------|-------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app` (from Part 1) |

### **Step 6: Deploy Frontend**

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://pn-news-frontend.vercel.app`

---

## ✅ Post-Deployment Setup

### **1. Seed Admin Account**

Visit this URL in your browser (replace with your backend URL):

```
https://your-backend-url.vercel.app/api/seed-admin-emergency
```

You should see:
```json
{"message":"Admin created successfully!","email":"admin@prathinityam.com"}
```

### **2. Test Your App**

Visit your frontend URL:
```
https://your-frontend-url.vercel.app
```

Try logging in:
- Email: `admin@prathinityam.com`
- Password: `Admin@123`

---

## 🔄 Updating Your Deployment

Vercel auto-deploys when you push to GitHub!

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main
```

Both frontend and backend will redeploy automatically!

---

## 🐛 Troubleshooting

### **Frontend can't connect to backend**

**Problem:** CORS errors or "Network Error"

**Solution:**
1. Make sure `VITE_API_URL` is set correctly in frontend
2. Check backend CORS settings allow your frontend domain
3. Both URLs must use HTTPS

### **Backend API not working**

**Problem:** 404 or 500 errors

**Solution:**
1. Check backend environment variables are set
2. Check MongoDB connection string is correct
3. View logs: Vercel Dashboard → Your Backend Project → "Deployments" → Click latest → "Logs"

### **Admin login fails**

**Problem:** "Invalid credentials"

**Solution:**
1. Visit: `https://your-backend-url.vercel.app/api/seed-admin-emergency`
2. Check MongoDB Atlas network access allows `0.0.0.0/0`

### **Images not uploading**

**Problem:** Upload fails or images don't show

**Solution:**
1. Verify all 3 Cloudinary environment variables are set
2. Check Cloudinary dashboard for quota limits

---

## 🔐 CORS Configuration

Your backend needs to allow your frontend domain. Update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

Replace with your actual frontend Vercel URL.

---

## 📊 Important URLs

After deployment, save these:

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | `https://your-backend.vercel.app` | API endpoints |
| **Frontend** | `https://your-frontend.vercel.app` | User interface |
| **MongoDB** | MongoDB Atlas dashboard | Database |
| **Cloudinary** | Cloudinary dashboard | Media storage |
| **Vercel Dashboard** | https://vercel.com/dashboard | Manage deployments |

---

## 💰 Vercel Free Tier Limits

| Resource | Limit |
|----------|-------|
| **Bandwidth** | 100 GB/month |
| **Build Time** | 100 hours/month |
| **Serverless Functions** | 100 GB-hours |
| **Deployments** | Unlimited |

---

## 🎯 Deployment Checklist

### **Backend Deployment:**
- [ ] Root directory set to `backend`
- [ ] All 9 environment variables added
- [ ] Deployed successfully
- [ ] API health check works: `/api/health`
- [ ] Admin seeded via emergency endpoint

### **Frontend Deployment:**
- [ ] Root directory set to `frontend`
- [ ] `VITE_API_URL` environment variable set
- [ ] Deployed successfully
- [ ] Site loads correctly
- [ ] Can navigate to different pages
- [ ] Can log in successfully

---

## 🆚 Vercel vs Render Comparison

| Feature | Render | Vercel |
|---------|--------|--------|
| **Deployment** | Single deployment (monorepo) | Separate deployments |
| **Auto-deploy** | ✅ Yes | ✅ Yes |
| **Free tier sleep** | ✅ Yes (after 15 min) | ❌ No sleep |
| **Cold start** | ~30-60 seconds | ~1-2 seconds |
| **Bandwidth** | Unknown | 100 GB/month |
| **Edge network** | ❌ No | ✅ Yes (faster globally) |
| **Setup complexity** | Easier (1 project) | More complex (2 projects) |

---

## 🚀 Next Steps

1. **Custom Domain** - Add your own domain in Vercel settings
2. **Environment Variables** - Add staging/production environments
3. **Analytics** - Enable Vercel Analytics
4. **Monitoring** - Set up error tracking

---

## 🆘 Need Help?

1. Check deployment logs in Vercel dashboard
2. Review this guide again
3. Check MongoDB Atlas and Cloudinary dashboards
4. Test API endpoints with Postman or curl

---

**Congratulations!** Your PN_NEWS portal is now live on Vercel! 🎉

Both backend and frontend are deployed separately but work together seamlessly.
