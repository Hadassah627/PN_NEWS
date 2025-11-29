import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { newsService, trendingService, videoService } from '../services/apiService';
import { CATEGORIES } from '../utils/helpers';

const NewsForm = ({ type = 'news', onClose, editData = null }) => {
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    content: editData?.content || '',
    description: editData?.description || '',
    category: editData?.category || '',
    location: editData?.location || '',
    duration: editData?.duration || ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      if (type === 'video') {
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('location', formData.location);
        data.append('duration', formData.duration);
        if (video) data.append('video', video);
        if (thumbnail) data.append('thumbnail', thumbnail);
        
        console.log('Uploading video...', {
          videoSize: video ? `${(video.size / 1024 / 1024).toFixed(2)} MB` : 'No video',
          thumbnailSize: thumbnail ? `${(thumbnail.size / 1024 / 1024).toFixed(2)} MB` : 'No thumbnail'
        });
        
        if (editData) {
          await videoService.updateVideo(editData._id, data);
        } else {
          await videoService.createVideo(data);
        }
      } else {
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('category', formData.category);
        data.append('location', formData.location);
        if (thumbnail) data.append('thumbnail', thumbnail);
        
        if (type === 'trending') {
          if (editData) {
            await trendingService.updateTrending(editData._id, data);
          } else {
            await trendingService.createTrending(data);
          }
        } else {
          if (editData) {
            await newsService.updateNews(editData._id, data);
          } else {
            await newsService.createNews(data);
          }
        }
      }

      toast.success(`${type} ${editData ? 'updated' : 'created'} successfully!`);
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = () => {
    switch(type) {
      case 'trending': return 'from-orange-500 to-red-600';
      case 'video': return 'from-purple-500 to-indigo-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getTypeIcon = () => {
    switch(type) {
      case 'trending':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
        );
      case 'video':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        );
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
        {/* Professional Header with Gradient */}
        <div className={`bg-gradient-to-r ${getTypeColor()} p-6 text-white`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getTypeIcon()}
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {editData ? 'Edit' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1)}
                </h2>
                <p className="text-sm opacity-90 mt-1">
                  {type === 'video' ? 'Upload video content' : type === 'trending' ? 'Share trending news' : 'Write your story'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-10 h-10 flex items-center justify-center transition-all transform hover:rotate-90 duration-300"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="form-group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                Title <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter an engaging title..."
                required
              />
            </div>

            {/* Content/Description Field */}
            {type === 'video' ? (
              <div className="form-group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
                  </svg>
                  Description <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
                  rows="4"
                  placeholder="Describe your video content..."
                  required
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Content <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <ReactQuill
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    className="bg-white"
                    theme="snow"
                    placeholder="Write your content here..."
                  />
                </div>
              </div>
            )}

            {/* Category and Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  Category <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none appearance-none bg-white"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Location <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                  placeholder="Enter location..."
                  required
                />
              </div>
            </div>

            {/* Video-specific fields */}
            {type === 'video' && (
              <>
                <div className="form-group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Duration (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="e.g., 5:30"
                  />
                </div>

                <div className="form-group">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    Video File {!editData && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-all bg-gradient-to-br from-purple-50 to-indigo-50">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const sizeMB = file.size / 1024 / 1024;
                          if (sizeMB > 50) {
                            toast.warning(`Video file is ${sizeMB.toFixed(2)}MB. Large files may take longer to upload.`);
                          }
                          setVideo(file);
                        }
                      }}
                      className="w-full cursor-pointer"
                      required={!editData}
                    />
                    {video && (
                      <div className="mt-3 p-3 bg-purple-100 border border-purple-300 rounded-lg flex items-center">
                        <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-purple-900">{video.name}</p>
                          <p className="text-xs text-purple-600">Size: {(video.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    )}
                    <div className="mt-3 flex items-start text-xs text-gray-600">
                      <svg className="w-4 h-4 mr-1 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>Supported formats: MP4, AVI, MOV, WMV • Max size: 100MB</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Thumbnail Image Upload */}
            <div className="form-group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Thumbnail Image {type !== 'video' && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-all bg-gradient-to-br from-orange-50 to-yellow-50">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  className="w-full cursor-pointer"
                  required={type !== 'video' && !editData}
                />
                {thumbnail && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">Image selected: {thumbnail.name}</p>
                      <p className="text-xs text-green-600">Ready to upload</p>
                    </div>
                  </div>
                )}
                {editData?.thumbnailUrl && !thumbnail && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Current Thumbnail:</p>
                    <img src={editData.thumbnailUrl} alt="Current thumbnail" className="h-24 w-auto rounded-lg shadow-md" />
                    <p className="text-xs text-blue-600 mt-2">Upload a new image to replace</p>
                  </div>
                )}
                <div className="mt-3 flex items-start text-xs text-gray-600">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>
                    {type !== 'video' && <strong>Required: </strong>}
                    Upload JPG, PNG, or GIF • Recommended size: 1200x630px for best quality
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-gradient-to-r ${getTypeColor()} text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {editData ? 'Update' : 'Create'} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg shadow hover:shadow-md transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;
