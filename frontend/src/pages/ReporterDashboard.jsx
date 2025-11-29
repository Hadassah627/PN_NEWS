import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { newsService, trendingService, videoService } from '../services/apiService';
import NewsCard from '../components/NewsCard';
import NewsForm from '../components/NewsForm';

const ReporterDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [myNews, setMyNews] = useState([]);
  const [myTrending, setMyTrending] = useState([]);
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('news');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyContent();
  }, []);

  const fetchMyContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const [newsRes, trendingRes, videosRes] = await Promise.all([
        newsService.getMyNews(),
        trendingService.getMyTrending(),
        videoService.getMyVideos()
      ]);

      console.log('News Response:', newsRes);
      console.log('Trending Response:', trendingRes);
      console.log('Videos Response:', videosRes);

      setMyNews(newsRes.data.news || []);
      setMyTrending(trendingRes.data.trending || []);
      setMyVideos(videosRes.data.videos || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch content');
      toast.error('Failed to fetch content: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const allContent = [...myNews, ...myTrending, ...myVideos];
    return {
      total: allContent.length,
      pending: allContent.filter(c => c.approvalStatus === 'Pending').length,
      approved: allContent.filter(c => c.approvalStatus === 'Approved').length,
      rejected: allContent.filter(c => c.approvalStatus === 'Rejected').length
    };
  };

  const stats = getStats();

  const openCreateForm = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  // Helper function to determine content type
  const getContentType = (item) => {
    if (myNews.find(n => n._id === item._id)) return 'news';
    if (myTrending.find(t => t._id === item._id)) return 'trending';
    if (myVideos.find(v => v._id === item._id)) return 'video';
    return 'news'; // default
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Professional Dashboard Header */}
      <div className="flex items-center mb-8">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg mr-4">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 portal-title-static">
            Reporter Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Create and manage your news content</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
              <button 
                onClick={fetchMyContent}
                className="mt-2 text-sm text-red-600 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-600">Total Content</h3>
          <p className="text-4xl font-bold text-primary">{stats.total}</p>
        </div>
        <div className="card bg-yellow-50">
          <h3 className="text-lg font-semibold text-gray-600">Pending</h3>
          <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="card bg-green-50">
          <h3 className="text-lg font-semibold text-gray-600">Approved</h3>
          <p className="text-4xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="card bg-red-50">
          <h3 className="text-lg font-semibold text-gray-600">Rejected</h3>
          <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 inline-flex items-center justify-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Quick Actions
          </h2>
          <p className="text-gray-600 mt-2 text-sm">Create and publish your content in seconds</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => openCreateForm('news')} 
            className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 text-gray-800 hover:text-white font-semibold py-6 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-blue-200 hover:border-blue-600"
          >
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 mb-3 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
              <span className="text-lg">Create News</span>
              <span className="text-xs mt-1 opacity-75 group-hover:opacity-100">Write breaking stories</span>
            </div>
          </button>
          <button 
            onClick={() => openCreateForm('trending')} 
            className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-600 text-gray-800 hover:text-white font-semibold py-6 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-orange-200 hover:border-orange-600"
          >
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 mb-3 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
              </svg>
              <span className="text-lg">Create Trending</span>
              <span className="text-xs mt-1 opacity-75 group-hover:opacity-100">Share hot topics</span>
            </div>
          </button>
          <button 
            onClick={() => openCreateForm('video')} 
            className="group relative overflow-hidden bg-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-indigo-600 text-gray-800 hover:text-white font-semibold py-6 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-purple-200 hover:border-purple-600"
          >
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 mb-3 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span className="text-lg">Upload Video</span>
              <span className="text-xs mt-1 opacity-75 group-hover:opacity-100">Share video content</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'news' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('news')}
        >
          My News ({myNews.length})
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'trending' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('trending')}
        >
          My Trending ({myTrending.length})
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'videos' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('videos')}
        >
          My Videos ({myVideos.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...myNews.slice(0, 3), ...myTrending.slice(0, 3), ...myVideos.slice(0, 3)]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6)
                .map((item) => (
                  <NewsCard 
                    key={item._id} 
                    news={item} 
                    showStatus={true} 
                    type={getContentType(item)}
                  />
                ))}
            </div>
          )}

          {activeTab === 'news' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myNews.map((item) => (
                <NewsCard key={item._id} news={item} showStatus={true} type="news" />
              ))}
            </div>
          )}

          {activeTab === 'trending' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myTrending.map((item) => (
                <NewsCard key={item._id} news={item} showStatus={true} type="trending" />
              ))}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myVideos.map((item) => (
                <NewsCard key={item._id} news={item} showStatus={true} type="video" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <NewsForm
          type={formType}
          onClose={() => {
            setShowForm(false);
            fetchMyContent();
          }}
        />
      )}
    </div>
  );
};

export default ReporterDashboard;
