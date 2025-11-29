# 🔐 Environment Variables for Render Deployment

Copy these environment variables to your Render dashboard under "Environment" section.

---

## Required Environment Variables

### 1. NODE_ENV
```
NODE_ENV=production
```
**Description:** Sets Node.js environment to production mode

---

### 2. PORT
```
PORT=10000
```
**Description:** Render's default port (automatically set, but include for safety)

---

### 3. MONGODB_URI
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/prathinityam_news_portal?retryWrites=true&w=majority
```
**Description:** MongoDB Atlas connection string
**How to get:**
1. MongoDB Atlas Dashboard → Connect → Connect your application
2. Copy connection string
3. Replace USERNAME and PASSWORD
4. Add database name: `prathinityam_news_portal`

---

### 4. JWT_SECRET
```
JWT_SECRET=your_generated_secret_here
```
**Description:** Secret key for JWT token encryption
**How to generate:**
```bash
openssl rand -base64 32
```
**Example output:** `Xk7hGfJ9pL3mN2qR8sT4vW6xY1zA5bC7dE9fH0iJ3kL=`

---

### 5. ADMIN_EMAIL
```
ADMIN_EMAIL=admin@prathinityam.com
```
**Description:** Default admin email for login
**Note:** Change to your preferred admin email

---

### 6. ADMIN_PASSWORD
```
ADMIN_PASSWORD=YourStrongPassword123!
```
**Description:** Default admin password
**Important:** Use a strong, unique password!
**Requirements:**
- At least 8 characters
- Mix of uppercase, lowercase, numbers, and special characters

---

### 7. CLOUDINARY_CLOUD_NAME
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
```
**Description:** Your Cloudinary cloud name
**How to get:** Cloudinary Dashboard → Account Details → Cloud name

---

### 8. CLOUDINARY_API_KEY
```
CLOUDINARY_API_KEY=123456789012345
```
**Description:** Your Cloudinary API key
**How to get:** Cloudinary Dashboard → Account Details → API Key

---

### 9. CLOUDINARY_API_SECRET
```
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```
**Description:** Your Cloudinary API secret
**How to get:** Cloudinary Dashboard → Account Details → API Secret

---

## Quick Copy Template

Copy this template and fill in your values:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prathinityam_news_portal?retryWrites=true&w=majority
JWT_SECRET=YOUR_GENERATED_SECRET
ADMIN_EMAIL=admin@prathinityam.com
ADMIN_PASSWORD=YOUR_STRONG_PASSWORD
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
```

---

## ⚠️ Security Notes

1. **Never share these values publicly**
2. **Never commit them to Git** (already protected by `.gitignore`)
3. **Use different passwords** for admin and database
4. **Generate a unique JWT_SECRET** - don't use examples
5. **Store credentials securely** - use a password manager

---

## 🔄 Updating Environment Variables

If you need to change any environment variable after deployment:

1. Go to Render Dashboard
2. Select your service
3. Click **"Environment"** in the left sidebar
4. Edit the variable
5. Click **"Save Changes"**
6. Render will automatically redeploy with new values

---

## ✅ Verification

After adding all environment variables, verify:

- [ ] All 9 variables are set
- [ ] No typos in variable names
- [ ] MongoDB URI includes database name
- [ ] JWT_SECRET is at least 32 characters
- [ ] ADMIN_PASSWORD is strong
- [ ] Cloudinary credentials are correct

---

## 🆘 Common Issues

### "Cannot connect to database"
- Check MONGODB_URI format
- Verify username/password are correct
- Ensure IP whitelist includes 0.0.0.0/0

### "JWT token invalid"
- Make sure JWT_SECRET is set
- Check for extra spaces in the secret

### "Cannot upload images"
- Verify all three Cloudinary variables are set
- Check Cloudinary dashboard for API access

---

**Last Updated:** November 27, 2025
