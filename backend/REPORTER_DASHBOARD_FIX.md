# Fix: Reporter Dashboard "Read Full Article" Error

## Problem
When clicking "Read Full Article" on news cards in the Reporter Dashboard, the page redirected to the homepage and showed "Failed to fetch news details" error.

## Root Cause
The **NewsCard component always linked to `/news/:id`**, but:
- Trending news items have different IDs and need `/trending/:id` endpoint
- Video items have different IDs and need `/videos/:id` endpoint
- The NewsDetailPage only fetched from `/api/news/:id`, which returned 404 for trending and video content

When a reporter had **trending news or videos** in their dashboard, clicking "Read Full Article" tried to fetch from the wrong endpoint, causing the error.

## Solution

### 1. Updated NewsCard Component
**File:** `/frontend/src/components/NewsCard.jsx`

- Added `type` prop with default value 'news'
- Created `getDetailRoute()` helper function to generate correct route based on type:
  - `type='news'` → `/news/:id`
  - `type='trending'` → `/trending/:id`
  - `type='video'` → `/video/:id`

```javascript
const NewsCard = ({ news, showStatus = false, type = 'news' }) => {
  // Helper function to get the correct detail page route
  const getDetailRoute = () => {
    if (type === 'trending') {
      return `/trending/${news._id}`;
    } else if (type === 'video') {
      return `/video/${news._id}`;
    }
    return `/news/${news._id}`;
  };
  
  // ... in the Link component
  <Link to={getDetailRoute()}>
    Read Full Article
  </Link>
}
```

### 2. Created TrendingDetailPage
**File:** `/frontend/src/pages/TrendingDetailPage.jsx`

- Fetches trending news using `trendingService.getTrendingById(id)`
- Displays trending badge (🔥 Trending)
- Shows trending score if available
- Professional layout matching NewsDetailPage
- Error handling with navigation to previous page

### 3. Created VideoDetailPage
**File:** `/frontend/src/pages/VideoDetailPage.jsx`

- Fetches video using `videoService.getVideoById(id)`
- Displays video badge (🎥 Video) and duration
- **YouTube video player** with embedded iframe
- Converts various YouTube URL formats to embed URLs
- Shows video description
- Professional layout with error handling

### 4. Updated Reporter Dashboard
**File:** `/frontend/src/pages/ReporterDashboard.jsx`

- Added `type="news"` to news cards
- Added `type="trending"` to trending cards
- Added `type="video"` to video cards

```javascript
{myNews.map((item) => (
  <NewsCard key={item._id} news={item} showStatus={true} type="news" />
))}

{myTrending.map((item) => (
  <NewsCard key={item._id} news={item} showStatus={true} type="trending" />
))}

{myVideos.map((item) => (
  <NewsCard key={item._id} news={item} showStatus={true} type="video" />
))}
```

### 5. Updated Admin Dashboard
**File:** `/frontend/src/pages/AdminDashboard.jsx`

- Added `type="news"` to pending news cards
- Added `type="trending"` to pending trending cards
- Added `type="video"` to pending video cards

### 6. Updated User Dashboard
**File:** `/frontend/src/pages/UserDashboard.jsx`

- Dynamically sets type based on active tab:
  - `activeTab === 'news'` → `type="news"`
  - `activeTab === 'trending'` → `type="trending"`
  - `activeTab === 'videos'` → `type="video"`

### 7. Updated App Router
**File:** `/frontend/src/App.jsx`

- Added route: `/trending/:id` → `<TrendingDetailPage />`
- Added route: `/video/:id` → `<VideoDetailPage />`
- Imported both new components

## How It Works Now

### Complete Flow:

1. **Reporter Dashboard:**
   - Reporter sees their news, trending, and videos
   - Each card type has the correct `type` prop
   - "Read Full Article" button links to appropriate route

2. **Click "Read Full Article":**
   - **News card** → Navigates to `/news/:id` → NewsDetailPage
   - **Trending card** → Navigates to `/trending/:id` → TrendingDetailPage
   - **Video card** → Navigates to `/video/:id` → VideoDetailPage

3. **Detail Pages:**
   - Fetch data from correct API endpoint
   - Display content with professional layout
   - Show approval status if pending/rejected
   - Include back button to return to dashboard
   - Handle errors gracefully (navigate back on failure)

## Features Added

### TrendingDetailPage Features:
- 🔥 Trending badge with red styling
- Trending score display (if available)
- Category badge
- Large hero image
- Full HTML content rendering
- Meta information (location, reporter, date)
- Social sharing buttons
- Approval status display
- Error handling

### VideoDetailPage Features:
- 🎥 Video badge with purple styling
- ⏱️ Duration display (if available)
- **YouTube video player** (full-width, responsive)
- Automatic YouTube URL conversion:
  - `youtube.com/watch?v=ID` → Embed URL
  - `youtu.be/ID` → Embed URL
  - `youtube.com/embed/ID` → Already embed
- Video description with HTML rendering
- Meta information
- Social sharing buttons
- Approval status display
- Error handling

## Testing the Fix

### Test 1: News Items
1. Login as Reporter
2. Go to "My News" tab
3. Click "Read Full Article" on any news
4. ✅ Should navigate to NewsDetailPage
5. ✅ Should display full article with image

### Test 2: Trending Items
1. Login as Reporter
2. Go to "My Trending" tab
3. Click "Read Full Article" on any trending news
4. ✅ Should navigate to TrendingDetailPage
5. ✅ Should display with 🔥 Trending badge
6. ✅ Should show trending score

### Test 3: Video Items
1. Login as Reporter
2. Go to "My Videos" tab
3. Click "Read Full Article" on any video
4. ✅ Should navigate to VideoDetailPage
5. ✅ Should display YouTube video player
6. ✅ Should show video description

### Test 4: Admin Dashboard
1. Login as Admin
2. Go to "Pending Approvals" tab
3. Click "Read Full Article" on any item
4. ✅ Should navigate to correct detail page based on type
5. ✅ Should show approval status

### Test 5: User Dashboard
1. Login as User
2. Switch between tabs (Latest News, Trending, Videos)
3. Click "Read Full Article" on any item
4. ✅ Should navigate to correct detail page
5. ✅ Should display approved content only

## Error Handling

All detail pages now include:
- ✅ **Loading state** with spinner animation
- ✅ **404 handling** - "Not Found" message with back button
- ✅ **Error handling** - Toast notification + navigate back
- ✅ **Image error handling** - Hide broken images
- ✅ **Video URL validation** - Handle invalid YouTube URLs
- ✅ **Console logging** - Debug information for troubleshooting

## Technical Details

### Route Structure:
```
/news/:id        → NewsDetailPage      (News items)
/trending/:id    → TrendingDetailPage  (Trending news)
/video/:id       → VideoDetailPage     (Video content)
```

### API Endpoints Used:
```
GET /api/news/:id        → Returns news by ID
GET /api/trending/:id    → Returns trending by ID
GET /api/videos/:id      → Returns video by ID
```

### Type Prop Values:
- `type="news"` - Regular news articles
- `type="trending"` - Trending news items
- `type="video"` - Video content

## Files Modified

✅ `/frontend/src/components/NewsCard.jsx` - Added type prop and routing logic
✅ `/frontend/src/pages/ReporterDashboard.jsx` - Added type props to cards
✅ `/frontend/src/pages/AdminDashboard.jsx` - Added type props to cards
✅ `/frontend/src/pages/UserDashboard.jsx` - Added dynamic type based on tab
✅ `/frontend/src/App.jsx` - Added new routes

## Files Created

✅ `/frontend/src/pages/TrendingDetailPage.jsx` - New detail page for trending
✅ `/frontend/src/pages/VideoDetailPage.jsx` - New detail page for videos

## Summary

The fix ensures that:
1. **Each content type** (news, trending, video) has its own detail page
2. **NewsCard component** intelligently routes to the correct page
3. **All dashboards** pass the correct type information
4. **Error handling** prevents crashes and provides user feedback
5. **Video player** works with YouTube URLs automatically
6. **Professional UI** maintained across all detail pages

**Result:** "Read Full Article" now works correctly for all content types in Reporter Dashboard, Admin Dashboard, and User Dashboard! 🎉
