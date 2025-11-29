# Image Upload Feature Guide

## Overview
The image upload feature allows reporters and administrators to add thumbnail images when creating news articles. These images will be displayed in the news cards on the User Dashboard.

## How It Works

### 1. **For Reporters and Administrators**

#### Creating News with Image:
1. Navigate to your dashboard (Reporter Dashboard or Admin Dashboard)
2. Click on "Add News" or open the news form
3. Fill in all required fields:
   - Title
   - Content
   - Category
   - Location
4. **Upload Thumbnail Image** (Required):
   - Click on the file input in the "Thumbnail Image" section
   - Select an image file (JPG, PNG, or GIF)
   - Recommended size: 1200x630px for best quality
   - A green confirmation message will appear showing the selected file name
5. Click "Create" to submit

#### Updating News with New Image:
1. Edit existing news
2. The current thumbnail will be displayed
3. Upload a new image to replace the old one
4. Click "Update"

### 2. **Image Display in User Dashboard**

When users view the news in their dashboard:
- The thumbnail image appears at the top of each news card
- Image has a zoom effect on hover
- Gradient overlay appears on hover for better visual appeal
- If no image is uploaded, the card will display without a thumbnail

## Technical Details

### Frontend Components Updated:

1. **NewsForm.jsx** (`/frontend/src/components/NewsForm.jsx`)
   - Enhanced thumbnail upload section
   - Made thumbnail required for news and trending (not for videos)
   - Shows selected file name confirmation
   - Displays current image when editing
   - Improved UI with dashed border and instructions

2. **NewsCard.jsx** (`/frontend/src/components/NewsCard.jsx`)
   - Professional card design with image at the top
   - Image zoom effect on hover (scale-110)
   - Fixed height for images (h-56 / 224px)
   - Gradient overlay on hover
   - Responsive image display

### Backend Configuration:

1. **News Route** (`/backend/routes/news.js`)
   - Already configured with multer for file uploads
   - Uses `upload.single('thumbnail')` middleware
   - Supports Cloudinary or local storage
   - Stores thumbnail URL in database

2. **News Model** (`/backend/models/News.js`)
   - Has `thumbnailUrl` field to store image URL
   - Field is optional (default: empty string)

### Upload Flow:

1. User selects image in form
2. Frontend creates FormData with image file
3. Backend receives file via multer
4. Image is uploaded to:
   - Cloudinary (if configured with environment variables)
   - OR local `/uploads` folder
5. Image URL is saved in `thumbnailUrl` field
6. News is created/updated with the image URL
7. User Dashboard fetches news with thumbnailUrl
8. NewsCard displays the image

## Image Specifications

- **Supported Formats**: JPG, PNG, GIF
- **Recommended Size**: 1200x630px (16:9 aspect ratio)
- **Display Size**: 
  - Card: 224px height (auto width)
  - Detail Page: 384px height (full width)
- **Maximum File Size**: Depends on server configuration (check multer settings)

## Features

### Professional Card Display:
✅ Large, eye-catching thumbnail at the top
✅ Smooth zoom animation on hover
✅ Gradient overlay for better text readability
✅ Rounded corners and shadows
✅ Category-colored badges
✅ Icons for meta information
✅ Full-width "Read Full Article" button

### Image Upload UI:
✅ Dashed border for drag-and-drop feel
✅ Hover effect (border changes to primary color)
✅ File selection confirmation message
✅ Current image preview when editing
✅ Clear instructions and recommended size
✅ Required field validation

## Testing the Feature

1. **As Administrator:**
   - Login as admin
   - Go to Admin Dashboard
   - Click "Add News" tab
   - Fill form and upload an image
   - Submit and verify auto-approval
   - Check User Dashboard to see the image in the card

2. **As Reporter:**
   - Login as reporter
   - Go to Reporter Dashboard
   - Create new news with image
   - Submit for approval
   - After admin approval, check User Dashboard

3. **As User:**
   - Login as user
   - Go to User Dashboard
   - View news cards with images
   - Hover over cards to see zoom effect
   - Click "Read Full Article" to see full-size image

## Troubleshooting

### Image Not Displaying:
- Check if `thumbnailUrl` field is populated in database
- Verify image upload was successful (check uploads folder or Cloudinary)
- Ensure image URL is accessible
- Check browser console for errors

### Upload Fails:
- Verify multer middleware is properly configured
- Check file size limits
- Ensure uploads directory has write permissions
- Verify Cloudinary credentials if using cloud storage

### Image Quality Issues:
- Use recommended size (1200x630px)
- Use high-quality source images
- Avoid heavily compressed images
- Consider using PNG for graphics with text

## Future Enhancements (Optional)

- Image cropping tool before upload
- Multiple images per news article
- Image optimization/compression
- Drag-and-drop file upload
- Image preview before submission
- Image gallery for news articles
- Support for WebP format
