import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { newsService, trendingService, videoService } from '../services/apiService';
import NewsCard from '../components/NewsCard';
import { CATEGORIES } from '../utils/helpers';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [content, setContent] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ category: '', location: '', search: '' });

  useEffect(() => {
    fetchContent();
  }, [activeTab, filters]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'all') {
        // Fetch all content types
        const [newsRes, trendingRes, videosRes] = await Promise.all([
          newsService.getAllNews(filters),
          trendingService.getAllTrending(filters),
          videoService.getAllVideos(filters)
        ]);

        // Combine and sort by date
        const combined = [
          ...newsRes.data.news.map(item => ({ ...item, type: 'news' })),
          ...trendingRes.data.trending.map(item => ({ ...item, type: 'trending' })),
          ...videosRes.data.videos.map(item => ({ ...item, type: 'video' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setAllContent(combined);
        setContent(combined);
      } else {
        let response;
        
        if (activeTab === 'news') {
          response = await newsService.getAllNews(filters);
          setContent(response.data.news);
        } else if (activeTab === 'trending') {
          response = await trendingService.getAllTrending(filters);
          setContent(response.data.trending);
        } else {
          response = await videoService.getAllVideos(filters);
          setContent(response.data.videos);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 portal-title-static">User Dashboard</h1>
            <p className="text-gray-600 mt-1">Stay updated with the latest news and updates</p>
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2 mb-8 flex gap-2 w-full overflow-x-auto">
        <button
          className={`group relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-indigo-50'
          }`}
          onClick={() => setActiveTab('all')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span>All Content</span>
          {activeTab === 'all' && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></span>
          )}
        </button>
        
        <button
          className={`group relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'news'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50'
          }`}
          onClick={() => setActiveTab('news')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
          <span>Latest News</span>
          {activeTab === 'news' && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></span>
          )}
        </button>
        
        <button
          className={`group relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'trending'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-orange-50'
          }`}
          onClick={() => setActiveTab('trending')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
          </svg>
          <span>Trending</span>
          {activeTab === 'trending' && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></span>
          )}
        </button>
        
        <button
          className={`group relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-purple-50'
          }`}
          onClick={() => setActiveTab('videos')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <span>Videos</span>
          {activeTab === 'videos' && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search..."
          className="input-field"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="input-field"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          placeholder="Location..."
          className="input-field"
        />
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <NewsCard 
              key={item._id} 
              news={item} 
              type={activeTab === 'all' ? item.type : (activeTab === 'news' ? 'news' : activeTab === 'trending' ? 'trending' : 'video')} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
