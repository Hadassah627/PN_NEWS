# 🚀 Quick Start Guide - Prathinityam News Portal

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### Step 2: Configure Backend

```bash
# In backend folder
cp .env.example .env
```

Edit `.env` and set:
```env
MONGODB_URI=mongodb://localhost:27017/prathinityam_news_portal
JWT_SECRET=mysecretkey123
ADMIN_EMAIL=admin@prathinityam.com
ADMIN_PASSWORD=Admin@123
```

### Step 3: Start MongoDB

```bash
# macOS/Linux
mongod

# Windows
net start MongoDB

# Or use MongoDB Compass/Atlas
```

### Step 4: Create Admin Account

```bash
# In backend folder
npm run seed-admin
```

### Step 5: Run the Application

```bash
# Terminal 1 - Backend (from backend folder)
npm run dev

# Terminal 2 - Frontend (from frontend folder)
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Test Accounts

### Admin Login
- Email: `admin@prathinityam.com`
- Password: `Admin@123`
- Access: http://localhost:3000/login → Admin tab

### Create Reporter Account
1. Go to http://localhost:3000/register
2. Click "Reporter" tab
3. Fill in:
   - Reporter ID: `HydPN101` (format: PlaceNamePN + Number)
   - Place Name: `Hyderabad`
   - Name, Email, Password

### Create User Account
1. Go to http://localhost:3000/register
2. Click "User" tab
3. Fill in Name, Email, Password

## 📝 Quick Test Workflow

### As Reporter:
1. Login as reporter
2. Click "Create News" button
3. Fill in title, content, category, location
4. Upload thumbnail (optional)
5. Submit → Status will be "Pending"

### As Admin:
1. Login as admin
2. Go to "Pending Approvals" tab
3. Review reporter's content
4. Click "Approve" or "Reject"

### As User:
1. Login as user
2. Browse approved news
3. Use filters to search by category/location
4. View trending news and videos

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongo --version

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Project Structure at a Glance

```
prathinityam-news-portal/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, validation
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── pages/    # Main pages
    │   ├── components/ # Reusable components
    │   └── services/ # API calls
    └── index.html
```

## 🎯 Key Features to Test

✅ **Authentication**
- User/Reporter registration
- Role-based login
- JWT token handling

✅ **Reporter Features**
- Create news/trending/videos
- View submission status
- Edit pending/rejected content

✅ **Admin Features**
- Approve/reject content
- Manage reporters
- View activity logs
- Dashboard statistics

✅ **User Features**
- Browse approved content
- Search and filter
- View by category/location

## 📚 API Testing (Optional)

Use Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Login as admin
curl -X POST http://localhost:5000/api/auth/login/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@prathinityam.com","password":"Admin@123"}'

# Get all news (public)
curl http://localhost:5000/api/news
```

## 🎨 Customization

### Change Admin Credentials
Edit `backend/.env`:
```env
ADMIN_EMAIL=youremail@example.com
ADMIN_PASSWORD=YourSecurePassword
```
Then run: `npm run seed-admin`

### Add Cloudinary for File Uploads
Edit `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Customize Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#your-color',
  secondary: '#your-color',
  accent: '#your-color',
}
```

## 🚢 Ready to Deploy?

See the main README.md for deployment instructions to:
- Heroku/Railway/Render (Backend)
- Vercel/Netlify (Frontend)
- MongoDB Atlas (Database)

## ❓ Need Help?

- Check the main README.md for detailed documentation
- Review the API endpoints section
- Check console for error messages
- Ensure all dependencies are installed

---

**Happy Coding! 🎉**
