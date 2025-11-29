# 🔧 Troubleshooting Guide

## Common Issues and Solutions

---

## Backend Issues

### Issue 1: MongoDB Connection Failed
**Error**: `MongoServerError: connect ECONNREFUSED`

**Causes**:
- MongoDB is not running
- Wrong connection string
- MongoDB not installed

**Solutions**:
```bash
# Check if MongoDB is running
mongo --version

# Start MongoDB service
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/prathinityam_news_portal
```

---

### Issue 2: Port 5000 Already in Use
**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
```

---

### Issue 3: JWT Secret Not Defined
**Error**: `TypeError: Cannot read property 'JWT_SECRET' of undefined`

**Solution**:
1. Ensure `.env` file exists in backend folder
2. Check `.env` has:
   ```
   JWT_SECRET=your_secret_key
   ```
3. Restart backend server

---

### Issue 4: Admin Account Not Found
**Error**: `Invalid credentials` when logging in as admin

**Solution**:
```bash
cd backend
npm run seed-admin
```

---

### Issue 5: File Upload Fails
**Error**: `MulterError: File too large`

**Solutions**:
1. Check file size (max 10MB by default)
2. Increase limit in `.env`:
   ```
   MAX_FILE_SIZE=20971520  # 20MB
   ```
3. Ensure `uploads` folder exists:
   ```bash
   mkdir uploads
   ```

---

### Issue 6: Module Not Found
**Error**: `Error: Cannot find module 'express'`

**Solution**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## Frontend Issues

### Issue 7: Port 3000 Already in Use
**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- --port 3001
```

---

### Issue 8: API Calls Failing (CORS Error)
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
1. Ensure backend is running
2. Check Vite proxy in `vite.config.js`:
   ```javascript
   server: {
     proxy: {
       '/api': 'http://localhost:5000'
     }
   }
   ```
3. Check CORS in backend `server.js`:
   ```javascript
   app.use(cors());
   ```

---

### Issue 9: White Screen / App Not Loading
**Possible Causes**:
- Build errors
- Missing dependencies
- Route configuration issues

**Solutions**:
```bash
# Clear cache
rm -rf node_modules .vite
npm install

# Check browser console for errors
# Fix any import errors

# Ensure index.html has root div
<div id="root"></div>
```

---

### Issue 10: Login Not Working
**Symptoms**: Login button does nothing or errors

**Debug Steps**:
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify backend is running:
   ```bash
   curl http://localhost:5000/api/health
   ```

**Solutions**:
- Clear localStorage: `localStorage.clear()`
- Check credentials are correct
- Ensure backend is running
- Check JWT_SECRET matches

---

### Issue 11: Rich Text Editor Not Showing
**Error**: Component not rendering

**Solution**:
```bash
# Ensure react-quill is installed
npm install react-quill

# Import styles in component
import 'react-quill/dist/quill.snow.css';
```

---

## Authentication Issues

### Issue 12: Token Expired Error
**Error**: `401 Unauthorized - Invalid token`

**Cause**: JWT token expired (default 7 days)

**Solution**:
1. Logout and login again
2. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```

---

### Issue 13: Unauthorized Access
**Error**: `403 Access denied. Insufficient permissions`

**Cause**: Trying to access route without proper role

**Solution**:
- Ensure you're logged in with correct role
- Check role in token:
  ```javascript
  console.log(getUserFromToken())
  ```

---

### Issue 14: Reporter ID Validation Fails
**Error**: `Invalid Reporter ID format`

**Cause**: Wrong format used

**Solution**:
- Use format: `PlaceNamePN + Number`
- Examples: `HydPN101`, `VizagPN202`, `DelhiPN303`
- Only letters before PN, only numbers after

---

## Database Issues

### Issue 15: Duplicate Key Error
**Error**: `MongoServerError: E11000 duplicate key error`

**Cause**: Trying to insert duplicate email/reporterId

**Solution**:
- Use different email/reporterId
- Check if account already exists
- Clear database if testing:
  ```javascript
  mongo
  use prathinityam_news_portal
  db.dropDatabase()
  ```

---

### Issue 16: Cannot Find Document
**Error**: `null` returned for queries

**Possible Causes**:
- Document doesn't exist
- Wrong collection
- Wrong query

**Debug**:
```javascript
// Check in MongoDB
mongo prathinityam_news_portal
db.news.find().pretty()
db.users.find().pretty()
```

---

## File Upload Issues

### Issue 17: Cloudinary Upload Fails
**Error**: `Failed to upload to Cloudinary`

**Solutions**:
1. Check Cloudinary credentials in `.env`
2. Ensure credentials are valid
3. Test with local storage first (remove Cloudinary env vars)

---

### Issue 18: Image Not Displaying
**Symptoms**: Broken image icon

**Solutions**:
1. Check image URL in database
2. If local storage, ensure Express serves static files:
   ```javascript
   app.use('/uploads', express.static('uploads'))
   ```
3. If Cloudinary, check URL is valid
4. Check browser console for 404 errors

---

## Development Issues

### Issue 19: Hot Reload Not Working
**Frontend (Vite)**:
```bash
# Clear cache
rm -rf node_modules/.vite
npm run dev
```

**Backend (Nodemon)**:
```bash
# Check nodemon is installed
npm install --save-dev nodemon

# Run with nodemon
npm run dev
```

---

### Issue 20: Environment Variables Not Loading
**Symptoms**: `undefined` for `process.env` variables

**Solutions**:
1. Ensure `.env` file exists in correct folder
2. Restart server after changing `.env`
3. Check for typos in variable names
4. Don't commit `.env` to git

---

## Production Issues

### Issue 21: App Works Locally but Not in Production
**Common Causes**:
- Environment variables not set
- Build not generated
- API URL hardcoded

**Solutions**:
1. Set all env vars in hosting platform
2. Build frontend:
   ```bash
   npm run build
   ```
3. Use environment-based API URLs

---

### Issue 22: Database Connection Timeout
**In Production**:

**Solutions**:
1. Use MongoDB Atlas
2. Whitelist IP addresses
3. Check connection string format
4. Enable network access

---

## Performance Issues

### Issue 23: Slow Page Load
**Solutions**:
1. Optimize images (compress before upload)
2. Use pagination for large datasets
3. Add indexes to MongoDB:
   ```javascript
   newsSchema.index({ category: 1, createdAt: -1 });
   ```
4. Enable caching

---

### Issue 24: Backend Slow Response
**Solutions**:
1. Add database indexes
2. Limit query results
3. Use select() to limit fields:
   ```javascript
   .select('title content category')
   ```

---

## Testing Issues

### Issue 25: Cannot Create Test Data
**Solution**:
Use Postman or create seed scripts:

```javascript
// backend/scripts/seedTestData.js
const mongoose = require('mongoose');
const News = require('../models/News');

async function seedData() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Create test news
  await News.create({
    title: 'Test News',
    content: 'Test content',
    category: 'Technology',
    location: 'Test City',
    uploadedBy: { /* ... */ },
    approvalStatus: 'Approved'
  });
  
  console.log('Seed complete');
  process.exit(0);
}

seedData();
```

---

## Debugging Tips

### Enable Debug Mode

**Backend**:
```javascript
// Add to server.js
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}
```

**Frontend**:
```javascript
// In component
console.log('State:', state);
console.log('User:', user);
```

### Check API Responses
```bash
# Use curl to test endpoints
curl -X GET http://localhost:5000/api/news
curl -X POST http://localhost:5000/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### MongoDB Debugging
```bash
# Connect to MongoDB
mongo prathinityam_news_portal

# Show all collections
show collections

# Count documents
db.news.countDocuments()

# Find all
db.news.find().pretty()

# Find specific
db.news.find({ approvalStatus: 'Pending' }).pretty()
```

---

## Quick Diagnostic Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongo --version
mongod --version

# Check if ports are in use
lsof -i :3000
lsof -i :5000
lsof -i :27017

# Check running processes
ps aux | grep node
ps aux | grep mongod

# Network test
curl http://localhost:5000/api/health
curl http://localhost:3000

# Check disk space
df -h

# Check memory
free -m  # Linux
top  # macOS/Linux
```

---

## Still Having Issues?

1. **Check Logs**:
   - Backend console output
   - Browser DevTools console
   - MongoDB logs

2. **Verify Installation**:
   ```bash
   npm list  # Check installed packages
   ```

3. **Clean Install**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Check Documentation**:
   - README.md
   - QUICKSTART.md
   - ARCHITECTURE.md

5. **Ask for Help**:
   - Include error messages
   - Include what you've tried
   - Include relevant code snippets

---

## Error Code Reference

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | No token or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (email/reporterId) |
| 500 | Internal Server Error | Backend bug or database issue |

---

**Remember**: Most issues can be solved by:
1. Checking console logs
2. Verifying environment variables
3. Ensuring all services are running
4. Clearing cache and reinstalling dependencies
