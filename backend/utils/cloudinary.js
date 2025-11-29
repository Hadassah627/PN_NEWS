const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath, resourceType = 'auto') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      folder: 'prathinityam-news'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Failed to upload to Cloudinary: ' + error.message);
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Failed to delete from Cloudinary:', error);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};
