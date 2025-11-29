import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncateText } from '../utils/helpers';

const NewsCard = ({ news, showStatus = false, type = 'news' }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-approved';
      case 'Pending':
        return 'badge-pending';
      case 'Rejected':
        return 'badge-rejected';
      default:
        return '';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Politics': 'bg-red-100 text-red-700 border-red-200',
      'Sports': 'bg-green-100 text-green-700 border-green-200',
      'Entertainment': 'bg-pink-100 text-pink-700 border-pink-200',
      'Technology': 'bg-blue-100 text-blue-700 border-blue-200',
      'Business': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Health': 'bg-teal-100 text-teal-700 border-teal-200',
      'Education': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Other': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Helper function to get the correct image URL
  const getImageUrl = (url) => {
    if (!url) return null;
    // If it's already a full URL (Cloudinary), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's a local path, it will be proxied by Vite
    return url;
  };

  // Helper function to get the correct detail page route
  const getDetailRoute = () => {
    if (type === 'trending') {
      return `/trending/${news._id}`;
    } else if (type === 'video') {
      return `/video/${news._id}`;
    }
    return `/news/${news._id}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Thumbnail with overlay effect */}
      {news.thumbnailUrl && (
        <div className="relative overflow-hidden h-56">
          <img
            src={getImageUrl(news.thumbnailUrl)}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              console.error('Image failed to load:', news.thumbnailUrl);
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      <div className="p-6">
        {/* Category and Status Row */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getCategoryColor(news.category)}`}>
            {news.category}
          </span>
          {showStatus && (
            <span className={getBadgeClass(news.approvalStatus)}>
              {news.approvalStatus}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        
        {/* Content Preview */}
        <div 
          className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: truncateText(news.content || news.description || '', 120) }}
        />

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4 mb-4"></div>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="font-medium">{news.location}</span>
          </div>

          {/* Reporter ID */}
          {news.uploadedBy?.reporterId && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              <span>{news.uploadedBy.reporterId}</span>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>{formatDate(news.createdAt)}</span>
          </div>
        </div>

        {/* Rejection Reason */}
        {news.rejectionReason && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
            <p className="text-sm text-red-700">
              <strong className="font-semibold">Rejection Reason:</strong> {news.rejectionReason}
            </p>
          </div>
        )}

        {/* Read More Button */}
        <Link
          to={getDetailRoute()}
          className="flex items-center justify-center w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg group"
        >
          <span>Read Full Article</span>
          <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
