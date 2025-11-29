# Testing Guide - Prathinityam News Portal

## 🧪 Complete Testing Workflow

### Prerequisites
- Application is running (backend on :5000, frontend on :3000)
- MongoDB is running
- Admin account is seeded

---

## Test 1: User Registration & Login

### 1.1 Register as User
1. Navigate to http://localhost:3000/register
2. Click "User" tab
3. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Register"
5. **Expected**: Success message, redirect to login

### 1.2 Login as User
1. Navigate to http://localhost:3000/login
2. Click "User" tab
3. Fill in:
   - Email: `john@example.com`
   - Password: `password123`
4. Click "Login"
5. **Expected**: Redirect to User Dashboard

### 1.3 Browse Content as User
1. From User Dashboard, browse news
2. Use category filter
3. Use location search
4. Switch between News/Trending/Videos tabs
5. **Expected**: See only approved content

---

## Test 2: Reporter Registration & Content Creation

### 2.1 Register as Reporter
1. Navigate to http://localhost:3000/register
2. Click "Reporter" tab
3. Fill in:
   - Reporter ID: `HydPN101`
   - Place Name: `Hyderabad`
   - Name: `Jane Reporter`
   - Email: `jane@reporter.com`
   - Password: `reporter123`
   - Confirm Password: `reporter123`
4. Click "Register"
5. **Expected**: Success message, redirect to login

### 2.2 Login as Reporter
1. Navigate to http://localhost:3000/login
2. Click "Reporter" tab
3. Fill in:
   - Reporter ID: `HydPN101`
   - Password: `reporter123`
4. Click "Login"
5. **Expected**: Redirect to Reporter Dashboard

### 2.3 Create News Article
1. From Reporter Dashboard, click "+ Create News"
2. Fill in:
   - Title: `Breaking: New Technology Unveiled`
   - Content: `This is a test news article...` (use rich text editor)
   - Category: `Technology`
   - Location: `Hyderabad`
   - Upload thumbnail (optional)
3. Click "Create"
4. **Expected**: Success message, status shows "Pending"

### 2.4 Create Trending News
1. Click "+ Create Trending"
2. Fill in similar details
3. **Expected**: Created with "Pending" status

### 2.5 Upload Video
1. Click "+ Upload Video"
2. Fill in:
   - Title: `Video News Test`
   - Description: `Test video description`
   - Category: `Entertainment`
   - Location: `Mumbai`
   - Video File: Upload a small video
   - Thumbnail: Upload image
3. Click "Create"
4. **Expected**: Created with "Pending" status

### 2.6 View My Content
1. Check "My News" tab
2. Check "My Trending" tab
3. Check "My Videos" tab
4. **Expected**: See all created content with status badges

---

## Test 3: Admin Approval Workflow

### 3.1 Login as Admin
1. Navigate to http://localhost:3000/login
2. Click "Admin" tab
3. Fill in:
   - Email: `admin@prathinityam.com`
   - Password: `Admin@123`
4. Click "Login"
5. **Expected**: Redirect to Admin Dashboard

### 3.2 View Dashboard Stats
1. Check statistics cards
2. **Expected**: See counts for:
   - Total News
   - Total Trending
   - Total Videos
   - Active Reporters

### 3.3 Review Pending Content
1. Click "Pending Approvals" tab
2. **Expected**: See all pending content from reporters

### 3.4 Approve News
1. Find the news created by reporter
2. Click "Approve" button
3. **Expected**: Success message, content disappears from pending

### 3.5 Reject Content with Reason
1. Find another pending item
2. Click "Reject" button
3. Enter rejection reason: `Content needs more details`
4. **Expected**: Content marked as rejected

### 3.6 Manage Reporters
1. Click "Manage Reporters" tab
2. View list of all reporters
3. **Expected**: See reporter details and status

### 3.7 Deactivate Reporter
1. Find a reporter
2. Click "Deactivate" button
3. **Expected**: Status changes to "Inactive"

### 3.8 Reactivate Reporter
1. Click "Activate" button
2. **Expected**: Status changes to "Active"

### 3.9 View Activity Logs
1. Click "Activity Logs" tab
2. **Expected**: See chronological log of all actions

---

## Test 4: Reporter - Handle Rejected Content

### 4.1 Login as Reporter (if logged out)
1. Login as reporter
2. Go to "My News" or relevant tab

### 4.2 View Rejected Content
1. Find rejected item
2. **Expected**: Red "Rejected" badge with reason shown

### 4.3 Edit Rejected Content
1. Click on rejected item
2. Make changes
3. Save
4. **Expected**: Status changes back to "Pending"

---

## Test 5: Admin Direct Posting

### 5.1 Admin Creates News Directly
1. Login as admin
2. Create news article (similar to reporter)
3. **Expected**: Status is automatically "Approved"

### 5.2 Verify Public Visibility
1. Logout
2. Visit homepage
3. **Expected**: Admin's content is immediately visible

---

## Test 6: User Content Browsing

### 6.1 Login as User
1. Login with user credentials

### 6.2 Search Functionality
1. Use search bar: `Technology`
2. **Expected**: Only technology news shown

### 6.3 Category Filter
1. Select category: `Sports`
2. **Expected**: Only sports content shown

### 6.4 Location Filter
1. Enter location: `Hyderabad`
2. **Expected**: Only Hyderabad content shown

### 6.5 Clear Filters
1. Click "Clear Filters"
2. **Expected**: All approved content shown

---

## Test 7: Authentication & Authorization

### 7.1 Test Protected Routes
1. Logout completely
2. Try accessing: http://localhost:3000/admin/dashboard
3. **Expected**: Redirect to login

### 7.2 Test Role-Based Access
1. Login as User
2. Try accessing: http://localhost:3000/admin/dashboard
3. **Expected**: "Access Denied" message

### 7.3 Test Token Expiration
1. Login
2. Wait 7 days (or modify JWT expiry in code to 1 minute for testing)
3. Make any request
4. **Expected**: Auto-logout and redirect to login

---

## Test 8: Reporter ID Validation

### 8.1 Invalid Format Test
1. Try registering reporter with ID: `InvalidID`
2. **Expected**: Error message about format

### 8.2 Valid Format Test
1. Try: `VizagPN202`
2. **Expected**: Registration succeeds

### 8.3 Duplicate ID Test
1. Try registering with existing ID
2. **Expected**: Error message

---

## Test 9: File Upload

### 9.1 Image Upload
1. Upload news with image
2. **Expected**: Image preview shows

### 9.2 Video Upload
1. Upload video news
2. **Expected**: Video processes and saves

### 9.3 File Size Limit
1. Try uploading file > 10MB
2. **Expected**: Error message

---

## Test 10: UI/UX Features

### 10.1 Responsive Design
1. Resize browser window
2. Test on mobile size (DevTools)
3. **Expected**: Layout adapts properly

### 10.2 Toast Notifications
1. Perform any action
2. **Expected**: Success/error toast appears

### 10.3 Loading States
1. Submit form
2. **Expected**: Button shows "Loading..." or similar

### 10.4 Status Badges
1. View reporter content
2. **Expected**: Color-coded badges:
   - Yellow for Pending
   - Green for Approved
   - Red for Rejected

---

## Test 11: Edge Cases

### 11.1 Empty Content List
1. Create new reporter account
2. View "My News"
3. **Expected**: "No content" message

### 11.2 Long Content
1. Create news with very long title/content
2. **Expected**: Text truncates properly

### 11.3 Special Characters
1. Use special characters in title: `Test & News "Special" <Tags>`
2. **Expected**: Handled safely

### 11.4 Multiple Rapid Clicks
1. Click submit button multiple times quickly
2. **Expected**: Only one request sent

---

## Test 12: API Testing (Optional)

### 12.1 Health Check
```bash
curl http://localhost:5000/api/health
```
**Expected**: `{"status":"OK","message":"Server is running"}`

### 12.2 Public News Endpoint
```bash
curl http://localhost:5000/api/news
```
**Expected**: JSON array of approved news

### 12.3 Protected Endpoint Without Token
```bash
curl http://localhost:5000/api/admin/stats
```
**Expected**: 401 Unauthorized

---

## Test Results Checklist

Use this checklist to track testing progress:

- [ ] User registration works
- [ ] User login works
- [ ] User can browse content
- [ ] Reporter registration with valid ID
- [ ] Reporter can create news
- [ ] Reporter can create trending
- [ ] Reporter can upload video
- [ ] Content shows "Pending" status
- [ ] Admin can view pending approvals
- [ ] Admin can approve content
- [ ] Admin can reject content
- [ ] Admin can manage reporters
- [ ] Admin can view activity logs
- [ ] Admin direct posting works
- [ ] Reporter can edit rejected content
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Location filter works
- [ ] Protected routes redirect
- [ ] Role-based access control works
- [ ] File uploads work
- [ ] Toast notifications appear
- [ ] Responsive design works
- [ ] Status badges display correctly

---

## Common Issues & Solutions

### Issue: Cannot login after registration
**Solution**: Check if email/ID is correct, verify MongoDB connection

### Issue: Content not appearing after approval
**Solution**: Refresh page, check approval status in database

### Issue: File upload fails
**Solution**: Check file size, verify uploads folder exists

### Issue: Token expired error
**Solution**: Login again to get new token

### Issue: Admin account not found
**Solution**: Run `npm run seed-admin` in backend folder

---

## Performance Testing

### Load Test Checklist
- [ ] Create 10+ news articles
- [ ] Upload multiple videos
- [ ] Test with 100+ items in database
- [ ] Test search with large dataset
- [ ] Test pagination

---

## Security Testing

### Security Checklist
- [ ] Passwords are hashed
- [ ] JWT tokens expire
- [ ] Protected routes work
- [ ] XSS protection active
- [ ] SQL injection prevented (MongoDB)
- [ ] File upload restrictions work

---

## Browser Compatibility

Test on:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

**Testing Complete!** ✅

If all tests pass, your Prathinityam News Portal is ready for production!
