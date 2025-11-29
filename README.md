# Prathinityam News Portal

A full-stack MERN (MongoDB, Express, React, Node.js) news portal application with role-based authentication and content management system.

## 🚀 Features

### Three User Roles

1. **Administrator**
   - Single fixed admin account
   - Approve/reject reporter content
   - Direct post without approval
   - Manage reporter accounts (activate/deactivate)
   - View activity logs
   - Dashboard with statistics

2. **Reporter**
   - Register with unique Reporter ID (format: `{PlaceName}PN{Number}`, e.g., `HydPN101`)
   - Upload news articles, trending news, and videos
   - Content requires admin approval
   - Track submission status (Pending/Approved/Rejected)
   - Edit pending or rejected content

3. **User**
   - Register and login
   - Browse approved news, trending content, and videos
   - Search by category, location, and keywords
   - View all public content

### Content Management
- **News Articles**: Rich text editor support, image uploads
- **Trending News**: Priority-based content display
- **Video News**: Video uploads with thumbnails
- **Categories**: Politics, Sports, Technology, Entertainment, Business, Health, Education, Other
- **Approval Workflow**: All reporter content requires admin approval

### Technical Features
- JWT-based authentication
- Role-based access control
- Reporter ID validation
- File uploads (Cloudinary or local storage)
- Activity logging
- Responsive design with Tailwind CSS
- Toast notifications
- Protected routes

## 📁 Project Structure

```
prathinityam-news-portal/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   ├── reporterValidator.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Reporter.js
│   │   ├── User.js
│   │   ├── News.js
│   │   ├── TrendingNews.js
│   │   ├── Video.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── news.js
│   │   ├── trending.js
│   │   ├── videos.js
│   │   └── admin.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── logger.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── NewsCard.jsx
    │   │   ├── NewsForm.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── UserDashboard.jsx
    │   │   ├── ReporterDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── apiService.js
    │   ├── utils/
    │   │   ├── auth.js
    │   │   └── helpers.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/prathinityam_news_portal
JWT_SECRET=your_strong_jwt_secret_key
ADMIN_EMAIL=admin@prathinityam.com
ADMIN_PASSWORD=Admin@123

# Optional: Cloudinary for file uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Start MongoDB (if not running):
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

6. Seed admin account:
```bash
npm run seed-admin
```

7. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔑 Default Credentials

### Admin Account
- **Email**: `admin@prathinityam.com`
- **Password**: `Admin@123`

### Testing Reporter Account
You can register a new reporter with:
- **Reporter ID**: `HydPN101` (format: PlaceNamePN + Number)
- **Name**: Your name
- **Email**: Your email
- **Password**: Your password
- **Place Name**: Hyderabad (or any place)

### Testing User Account
Register through the user registration page with your email and password.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register/user` - Register user
- `POST /api/auth/register/reporter` - Register reporter
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/reporter` - Reporter login
- `POST /api/auth/login/admin` - Admin login

### News
- `GET /api/news` - Get all approved news (public)
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create news (auth required)
- `PUT /api/news/:id` - Update news (auth required)
- `DELETE /api/news/:id` - Delete news (auth required)
- `GET /api/news/reporter/my-news` - Get reporter's news

### Trending News
- `GET /api/trending` - Get all trending news
- `POST /api/trending` - Create trending news
- `PUT /api/trending/:id` - Update trending news
- `DELETE /api/trending/:id` - Delete trending news

### Videos
- `GET /api/videos` - Get all approved videos
- `POST /api/videos` - Upload video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Admin
- `GET /api/admin/pending-approvals` - Get pending content
- `PUT /api/admin/approve/news/:id` - Approve news
- `PUT /api/admin/reject/news/:id` - Reject news
- `PUT /api/admin/approve/trending/:id` - Approve trending
- `PUT /api/admin/reject/trending/:id` - Reject trending
- `PUT /api/admin/approve/video/:id` - Approve video
- `PUT /api/admin/reject/video/:id` - Reject video
- `GET /api/admin/reporters` - Get all reporters
- `PUT /api/admin/reporter/:id/toggle-status` - Toggle reporter status
- `GET /api/admin/activity-logs` - Get activity logs
- `GET /api/admin/stats` - Get dashboard statistics

## 🎨 UI Features

- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Rich Text Editor**: React Quill for content creation
- **Toast Notifications**: Real-time feedback for user actions
- **Protected Routes**: Role-based route protection
- **File Uploads**: Support for images and videos
- **Search & Filters**: Category, location, and keyword search
- **Status Badges**: Visual indicators for approval status

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API routes
- Input validation
- XSS protection
- File type validation

## 📊 Database Schema

### User Schema
- name, email, password, role, isActive, createdAt

### Reporter Schema
- reporterId, name, email, password, placeName, role, isActive, createdAt

### Admin Schema
- email, password, role, createdAt

### News Schema
- title, content, category, location, thumbnailUrl, uploadedBy, approvalStatus, rejectionReason, createdAt, updatedAt

### TrendingNews Schema
- Same as News + trendingScore

### Video Schema
- title, description, category, location, videoUrl, thumbnailUrl, duration, uploadedBy, approvalStatus, rejectionReason, createdAt, updatedAt

### ActivityLog Schema
- action, performedBy, targetResource, details, ipAddress, createdAt

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Update MongoDB URI to production database
3. Deploy using Git or platform CLI

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform
3. Update API base URL if needed

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Email: support@prathinityam.com

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Comment system
- [ ] Social media sharing
- [ ] Analytics dashboard
- [ ] Mobile apps (React Native)
- [ ] Real-time notifications with WebSockets
- [ ] Advanced search with Elasticsearch
- [ ] Multi-language support

---

**Built with ❤️ using MERN Stack**
