# 🔐 Environment Variables for Vercel

Quick reference for setting up environment variables in Vercel.

---

## 🔙 Backend Environment Variables (9 Required)

Add these when deploying your **backend** project:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://pn_news_admin:PNNews2024@cluster0.z8clrr8.mongodb.net/prathinityam_news_portal?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=KmRkAffAP1qQWDWtHWgbaqqzwpGxsepPHHt6bc+SaI0=
ADMIN_EMAIL=admin@prathinityam.com
ADMIN_PASSWORD=Admin@123
CLOUDINARY_CLOUD_NAME=dftrc4wbs
CLOUDINARY_API_KEY=648943885131437
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
PORT=3000
```

---

## 🎨 Frontend Environment Variables (1 Required)

Add this when deploying your **frontend** project:

```bash
VITE_API_URL=https://your-backend-url.vercel.app
```

**Important:** Replace `your-backend-url.vercel.app` with your actual backend Vercel URL!

---

## 📝 How to Add in Vercel

### **During Initial Deployment:**

1. In the deployment configuration screen
2. Scroll to **"Environment Variables"**
3. For each variable:
   - **Key:** Variable name (e.g., `NODE_ENV`)
   - **Value:** Variable value (e.g., `production`)
   - Click **"Add"**

### **After Deployment:**

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar
5. Click **"Add"** button
6. Enter variable name and value
7. Click **"Save"**

---

## ⚙️ Variable Details

### **NODE_ENV**
- **Purpose:** Sets runtime environment
- **Value:** `production`
- **Required for:** Backend

### **MONGODB_URI**
- **Purpose:** Database connection string
- **Value:** Your MongoDB Atlas connection string
- **Required for:** Backend
- **Get it from:** MongoDB Atlas → Connect → Connection String

### **JWT_SECRET**
- **Purpose:** Token encryption key
- **Value:** Strong random string (already generated)
- **Required for:** Backend
- **Security:** Keep this secret!

### **ADMIN_EMAIL**
- **Purpose:** Default admin login email
- **Value:** `admin@prathinityam.com` (or your choice)
- **Required for:** Backend

### **ADMIN_PASSWORD**
- **Purpose:** Default admin password
- **Value:** `Admin@123` (recommended: use stronger password)
- **Required for:** Backend

### **CLOUDINARY_CLOUD_NAME**
- **Purpose:** Cloudinary account identifier
- **Value:** Your cloud name from Cloudinary dashboard
- **Required for:** Backend
- **Get it from:** Cloudinary → Dashboard → Account Details

### **CLOUDINARY_API_KEY**
- **Purpose:** Cloudinary API authentication
- **Value:** Your API key from Cloudinary
- **Required for:** Backend
- **Get it from:** Cloudinary → Dashboard → API Keys

### **CLOUDINARY_API_SECRET**
- **Purpose:** Cloudinary API secret key
- **Value:** Your API secret (click eye icon to reveal)
- **Required for:** Backend
- **Get it from:** Cloudinary → Dashboard → API Keys
- **Security:** Keep this secret!

### **PORT**
- **Purpose:** Server port for Vercel
- **Value:** `3000` (Vercel standard)
- **Required for:** Backend

### **VITE_API_URL**
- **Purpose:** Backend API URL for frontend
- **Value:** Your backend Vercel URL
- **Required for:** Frontend
- **Example:** `https://pn-news-backend.vercel.app`
- **Note:** Get this AFTER deploying backend

---

## 🔄 Deployment Order

**Important:** Deploy in this order:

1. **Deploy Backend First**
   - Add all 9 backend environment variables
   - Deploy and get backend URL
   
2. **Deploy Frontend Second**
   - Use backend URL for `VITE_API_URL`
   - Deploy frontend

---

## ✅ Verification Checklist

### **Backend Variables:**
- [ ] NODE_ENV = production
- [ ] MONGODB_URI (valid MongoDB Atlas connection)
- [ ] JWT_SECRET (strong random string)
- [ ] ADMIN_EMAIL (valid email)
- [ ] ADMIN_PASSWORD (strong password)
- [ ] CLOUDINARY_CLOUD_NAME (from Cloudinary)
- [ ] CLOUDINARY_API_KEY (from Cloudinary)
- [ ] CLOUDINARY_API_SECRET (from Cloudinary)
- [ ] PORT = 3000

### **Frontend Variables:**
- [ ] VITE_API_URL (your backend Vercel URL)

---

## 🐛 Common Issues

### **Backend can't connect to MongoDB**
- Check `MONGODB_URI` is correct
- Ensure MongoDB Atlas allows `0.0.0.0/0` in Network Access

### **Frontend can't reach backend**
- Verify `VITE_API_URL` matches your backend URL
- Must include `https://`
- No trailing slash

### **Cloudinary uploads fail**
- Check all 3 Cloudinary variables are set
- Verify values are correct in Cloudinary dashboard

### **Admin login fails**
- Visit `/api/seed-admin-emergency` to create admin
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set

---

## 🔒 Security Best Practices

1. **Never commit `.env` files to Git** ✅ Already in `.gitignore`
2. **Use strong passwords** - Change `Admin@123` to something stronger
3. **Rotate secrets periodically** - Change JWT_SECRET every few months
4. **Different values per environment** - Use different secrets for dev/prod
5. **Limit MongoDB access** - Only allow necessary IPs

---

## 📋 Copy-Paste Template

### **Backend:**
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_generated_jwt_secret
ADMIN_EMAIL=admin@prathinityam.com
ADMIN_PASSWORD=your_strong_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
```

### **Frontend:**
```
VITE_API_URL=https://your-backend-url.vercel.app
```

---

**Pro Tip:** Save these values in a password manager for easy access! 🔐
