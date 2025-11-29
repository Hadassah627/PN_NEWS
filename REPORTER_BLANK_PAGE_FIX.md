# Reporter Dashboard Blank Page Fix

## Problem
When logging into the Reporter Dashboard, the page appears completely blank/white with no content showing.

## Possible Causes & Solutions

### 1. **API Authentication Issues**
The reporter might not be properly authenticated or the token is invalid/expired.

**Solution:**
- Clear browser localStorage and login again
- Check browser console (F12) for 401 Unauthorized errors
- Verify the reporter account is active in the database

### 2. **Backend Not Running**
The backend server might not be running on port 5000.

**Solution:**
```bash
cd /home/rguktvalley/Documents/PN_NEWS/backend
npm start
```

Expected output: `🚀 Server running on port 5000`

### 3. **Frontend Port Mismatch**
The frontend switched to port 3001 because 3000 was in use.

**Solution:**
- Navigate to: `http://localhost:3001/reporter/dashboard`
- OR kill the process on port 3000 and restart:
```bash
# Find process on port 3000
lsof -ti:3000 | xargs kill -9

# Restart frontend
cd /home/rguktvalley/Documents/PN_NEWS/frontend
npm run dev
```

### 4. **CORS or Proxy Issues**
API requests might be failing due to CORS or proxy misconfiguration.

**Check:**
- Open browser console (F12 → Console tab)
- Look for CORS errors or Failed to fetch errors
- Verify Vite proxy is working

**Solution:**
Already configured in `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

### 5. **Missing Content/Empty Response**
The reporter might not have created any content yet, resulting in empty arrays.

**Check:**
- The dashboard should still show with stats showing "0"
- If completely blank, there's a different issue

### 6. **JavaScript Errors**
There might be JavaScript runtime errors breaking the component.

**Check:**
- Open browser console (F12 → Console tab)
- Look for any red error messages
- Check Network tab for failed API requests

## Fixed Issues in Latest Update

### 1. Added Error Handling
- Added error state to track issues
- Display error message with "Try Again" button
- Better console logging for debugging

### 2. Fixed Missing Type Prop
- Overview tab now passes correct `type` prop to NewsCard
- Added `getContentType()` helper function to determine content type

### 3. Enhanced Logging
- Console logs for API responses
- Detailed error messages with response data

## How to Debug

### Step 1: Check Browser Console
```
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for any red error messages
4. Look for these console logs:
   - "News Response:"
   - "Trending Response:"
   - "Videos Response:"
```

### Step 2: Check Network Requests
```
1. In Developer Tools, go to Network tab
2. Refresh the page
3. Look for failed API requests (red status)
4. Check these endpoints:
   - /api/news/reporter/my-news
   - /api/trending/reporter/my-trending
   - /api/videos/reporter/my-videos
```

### Step 3: Check Authentication
```
1. In Console tab, type:
   localStorage.getItem('token')

2. Should show a JWT token
3. If null or undefined, you're not logged in
4. Try logging in again
```

### Step 4: Verify Backend
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Expected: {"status":"OK","message":"Server is running"}
```

### Step 5: Check Reporter Endpoints
```bash
# Test with your actual token
TOKEN="your-token-here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/news/reporter/my-news
```

## Quick Fix Steps

### Method 1: Clear Cache and Reload
```
1. Press Ctrl+Shift+R (hard reload)
2. Or clear browser cache:
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Click "Clear data"
3. Navigate to http://localhost:3001 (or 3000)
4. Login again
```

### Method 2: Restart Everything
```bash
# Kill all processes
pkill -f node

# Start backend
cd /home/rguktvalley/Documents/PN_NEWS/backend
npm start &

# Start frontend
cd /home/rguktvalley/Documents/PN_NEWS/frontend
npm run dev
```

### Method 3: Check Database
```javascript
// In MongoDB or via backend
// Verify reporter exists and is active
db.reporters.find({ reporterId: "your-reporter-id" })

// Should show:
// { isActive: true, ... }
```

## Common Error Messages

### Error: "Failed to fetch content"
**Cause:** Backend not responding or authentication failed
**Solution:** 
- Check backend is running
- Verify token is valid
- Check browser console for specific error

### Error: "Network Error"
**Cause:** Backend not running or wrong port
**Solution:**
- Ensure backend is on port 5000
- Check `npm start` in backend folder

### Error: "401 Unauthorized"
**Cause:** Token expired or invalid
**Solution:**
- Logout and login again
- Check reporter is active in database

### Error: "403 Forbidden"
**Cause:** Wrong role (not a reporter)
**Solution:**
- Verify you're logging in as reporter, not user/admin
- Check user role in database

## Updated Code Features

### Enhanced Error Display
```jsx
{error && (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
    <p className="text-sm text-red-700">
      <strong>Error:</strong> {error}
    </p>
    <button onClick={fetchMyContent}>Try Again</button>
  </div>
)}
```

### Better Console Logging
```jsx
console.log('News Response:', newsRes);
console.log('Trending Response:', trendingRes);
console.log('Videos Response:', videosRes);
```

### Content Type Detection
```jsx
const getContentType = (item) => {
  if (myNews.find(n => n._id === item._id)) return 'news';
  if (myTrending.find(t => t._id === item._id)) return 'trending';
  if (myVideos.find(v => v._id === item._id)) return 'video';
  return 'news';
};
```

## Testing Steps

### 1. Login as Reporter
```
URL: http://localhost:3001/login
Select: "Reporter Login"
Enter: Reporter ID, Email, Password
```

### 2. Verify Dashboard Loads
```
✅ Should see "Reporter Dashboard" heading
✅ Should see 4 stat cards (Total, Pending, Approved, Rejected)
✅ Should see Quick Actions buttons
✅ Should see tabs (Overview, My News, My Trending, My Videos)
```

### 3. Check Console
```
✅ No red errors
✅ See "News Response:", "Trending Response:", "Videos Response:"
✅ API calls return 200 status
```

### 4. Test Creating Content
```
1. Click "+ Create News"
2. Fill form
3. Submit
4. Should see toast notification
5. Content appears in dashboard
```

## Files Modified

✅ `/frontend/src/pages/ReporterDashboard.jsx`
   - Added error state and display
   - Enhanced logging
   - Fixed missing type prop in Overview tab
   - Added getContentType() helper

## Summary

The blank page issue is most likely due to:
1. **Port mismatch** - Frontend on 3001 instead of 3000
2. **Authentication** - Token expired or invalid
3. **Backend** - Not running or not accessible

**Quick Solution:**
1. Open browser console (F12)
2. Check for errors
3. Navigate to correct port (http://localhost:3001)
4. If still blank, logout and login again
5. Check backend is running on port 5000

Now the dashboard includes:
- ✅ Error display with retry button
- ✅ Console logging for debugging
- ✅ Proper type props for all content
- ✅ Better error messages

**The dashboard should now work correctly!** If you still see a blank page, check the browser console for the specific error message.
