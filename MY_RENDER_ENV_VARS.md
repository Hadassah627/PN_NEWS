# 🔐 YOUR RENDER ENVIRONMENT VARIABLES
# Copy each variable below to your Render dashboard

---

## ✅ READY TO USE - Copy these to Render:

### 1. NODE_ENV
production

### 2. PORT
10000

### 3. MONGODB_URI
mongodb+srv://kiranhadassah2_db_user:Admin%40123@cluster0.z8clrr8.mongodb.net/prathinityam_news_portal?retryWrites=true&w=majority&appName=Cluster0

### 4. JWT_SECRET (✨ FRESHLY GENERATED - SECURE!)
KmRkAffAP1qQWDWtHWgbaqqzwpGxsepPHHt6bc+SaI0=

### 5. ADMIN_EMAIL
admin@prathinityam.com

### 6. ADMIN_PASSWORD
Admin@123

⚠️ RECOMMENDATION: Change to a stronger password like: Admin@Prathinityam2024!Secure

---

## 📸 CLOUDINARY SETUP (HIGHLY RECOMMENDED!)

Without Cloudinary, your uploaded files will be DELETED when Render redeploys!

### Option 1: Set up Cloudinary (Recommended)
1. Go to https://cloudinary.com and sign up (FREE)
2. Get your credentials from dashboard
3. Add these 3 variables to Render:

### 7. CLOUDINARY_CLOUD_NAME
[Get from Cloudinary Dashboard]

### 8. CLOUDINARY_API_KEY
[Get from Cloudinary Dashboard]

### 9. CLOUDINARY_API_SECRET
[Get from Cloudinary Dashboard]

### Option 2: Skip Cloudinary (Not Recommended)
- You can deploy without these 3 variables
- But files will be lost on each redeploy
- Users won't be able to upload images/videos reliably

---

## 📋 QUICK COPY FORMAT (For Render Dashboard)

Add these in Render's Environment section:

NODE_ENV = production
PORT = 10000
MONGODB_URI = mongodb+srv://kiranhadassah2_db_user:Admin%40123@cluster0.z8clrr8.mongodb.net/prathinityam_news_portal?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = KmRkAffAP1qQWDWtHWgbaqqzwpGxsepPHHt6bc+SaI0=
ADMIN_EMAIL = admin@prathinityam.com
ADMIN_PASSWORD = Admin@123
CLOUDINARY_CLOUD_NAME = [your_value_here]
CLOUDINARY_API_KEY = [your_value_here]
CLOUDINARY_API_SECRET = [your_value_here]

---

## 🚀 NEXT STEPS:

### Step 1: Push to GitHub (if not done yet)
```bash
git push origin main
```

### Step 2: Go to Render
1. Visit https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: Hadassah627/first_repo

### Step 3: Configure Service
- Name: prathinityam-news-portal
- Region: Choose closest to you
- Branch: main
- Root Directory: backend
- Runtime: Node
- Build Command: npm install && cd ../frontend && npm install && npm run build && cd ../backend
- Start Command: node server.js

### Step 4: Add Environment Variables
- Click "Advanced" → "Add Environment Variable"
- Add each variable from above (at least the first 6)
- Click "Create Web Service"

### Step 5: Wait for Deployment
- Watch the logs (takes ~10 minutes)
- Once deployed, you'll get a URL like: https://prathinityam-news-portal.onrender.com

### Step 6: Seed Admin Account
1. Go to Render dashboard → Your Service → "Shell" tab
2. Run: npm run seed-admin
3. Wait for "Admin created successfully"

### Step 7: Test Your App!
- Visit your Render URL
- Login with:
  - Email: admin@prathinityam.com
  - Password: Admin@123

---

## ⚠️ IMPORTANT REMINDERS:

1. ✅ Your MongoDB is already set up and working!
2. ✅ Your JWT secret is now SECURE (generated randomly)
3. ⚠️ Consider setting up Cloudinary for file uploads
4. ⚠️ Consider changing admin password to something stronger
5. 🆓 Free tier sleeps after 15 minutes of inactivity (first request takes 30-60 seconds)

---

## 🆘 NEED HELP?

### Get Cloudinary Credentials:
1. Go to https://cloudinary.com
2. Sign up (free)
3. Dashboard shows:
   - Cloud name
   - API Key
   - API Secret

### Troubleshooting:
- Can't connect? Check MongoDB Atlas allows IP 0.0.0.0/0
- App won't start? Check Render logs for errors
- Can't login? Run seed-admin script again

---

📚 For detailed instructions, see: DEPLOY_CHECKLIST.md

Good luck with your deployment! 🎉
