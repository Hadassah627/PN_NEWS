import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../services/apiService';
import NewsCard from '../components/NewsCard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState({ news: [], trending: [], videos: [] });
  const [reporters, setReporters] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, reportersRes, logsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingApprovals(),
        adminService.getReporters(),
        adminService.getActivityLogs({ limit: 10 })
      ]);

      setStats(statsRes.data);
      setPending(pendingRes.data);
      setReporters(reportersRes.data.reporters);
      setActivityLogs(logsRes.data.logs);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (type, id) => {
    try {
      if (type === 'news') await adminService.approveNews(id);
      else if (type === 'trending') await adminService.approveTrending(id);
      else await adminService.approveVideo(id);
      
      toast.success('Content approved successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve content');
    }
  };

  const handleReject = async (type, id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      if (type === 'news') await adminService.rejectNews(id, reason);
      else if (type === 'trending') await adminService.rejectTrending(id, reason);
      else await adminService.rejectVideo(id, reason);
      
      toast.success('Content rejected');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to reject content');
    }
  };

  const toggleReporterStatus = async (id) => {
    try {
      await adminService.toggleReporterStatus(id);
      toast.success('Reporter status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update reporter status');
    }
  };

  if (loading && !stats) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Professional Dashboard Header */}
      <div className="flex items-center mb-8">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mr-4">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 portal-title-static">
            Administrator Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage content, reporters, and monitor platform activities</p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-600">Total News</h3>
            <p className="text-4xl font-bold text-primary">{stats.news.total}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.news.pending} pending approval
            </p>
          </div>
          <div className="card bg-purple-50">
            <h3 className="text-lg font-semibold text-gray-600">Total Trending</h3>
            <p className="text-4xl font-bold text-purple-600">{stats.trending.total}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.trending.pending} pending
            </p>
          </div>
          <div className="card bg-green-50">
            <h3 className="text-lg font-semibold text-gray-600">Total Videos</h3>
            <p className="text-4xl font-bold text-green-600">{stats.videos.total}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.videos.pending} pending
            </p>
          </div>
          <div className="card bg-orange-50">
            <h3 className="text-lg font-semibold text-gray-600">Reporters</h3>
            <p className="text-4xl font-bold text-orange-600">{stats.reporters.active}</p>
            <p className="text-sm text-gray-500 mt-2">
              {stats.reporters.inactive} inactive
            </p>
          </div>
        </div>
      )}

      {/* Modern Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2 mb-8 flex gap-2 w-full overflow-x-auto">
        <button
          className={`group relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-indigo-50'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <span>Overview</span>
          {activeTab === 'stats' && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></span>
          )}
        </button>
        
        <button
          className={`group relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-yellow-50'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Pending Approvals</span>
          {stats?.pendingApprovals > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'pending' ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {stats.pendingApprovals}
            </span>
          )}
          {activeTab === 'pending' && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></span>
          )}
        </button>
        
        <button
          className={`group relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'reporters'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-green-50'
          }`}
          onClick={() => setActiveTab('reporters')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span>Manage Reporters</span>
          {activeTab === 'reporters' && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></span>
          )}
        </button>
        
        <button
          className={`group relative flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'logs'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-blue-50'
          }`}
          onClick={() => setActiveTab('logs')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Activity Logs</span>
          {activeTab === 'logs' && (
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-full"></span>
          )}
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'stats' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">System Overview</h2>
            <p className="text-gray-600">Welcome to the Admin Dashboard. Use the tabs above to manage content, reporters, and view activity logs.</p>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-8">
            {pending.news.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Pending News</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pending.news.map((item) => (
                    <div key={item._id}>
                      <NewsCard news={item} showStatus={true} type="news" />
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleApprove('news', item._id)}
                          className="btn-success flex-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject('news', item._id)}
                          className="btn-danger flex-1"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pending.trending.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Pending Trending</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pending.trending.map((item) => (
                    <div key={item._id}>
                      <NewsCard news={item} showStatus={true} type="trending" />
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleApprove('trending', item._id)}
                          className="btn-success flex-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject('trending', item._id)}
                          className="btn-danger flex-1"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pending.videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Pending Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pending.videos.map((item) => (
                    <div key={item._id}>
                      <NewsCard news={item} showStatus={true} type="video" />
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleApprove('video', item._id)}
                          className="btn-success flex-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject('video', item._id)}
                          className="btn-danger flex-1"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pending.news.length === 0 && pending.trending.length === 0 && pending.videos.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No pending approvals
              </div>
            )}
          </div>
        )}

        {activeTab === 'reporters' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Manage Reporters</h2>
                    <p className="text-green-100 text-sm">Control reporter access and status</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <span className="text-white font-semibold text-lg">{reporters.length}</span>
                  <span className="text-green-100 text-sm ml-1">Total</span>
                </div>
              </div>
            </div>

            {/* Modern Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                        </svg>
                        Reporter ID
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        Name
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        Email
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Place
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                        </svg>
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reporters.map((reporter, index) => (
                    <tr 
                      key={reporter._id} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold">
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-bold text-gray-900">{reporter.reporterId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{reporter.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                          </svg>
                          {reporter.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          {reporter.placeName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {reporter.isActive ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleReporterStatus(reporter._id)}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
                            reporter.isActive 
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                          }`}
                        >
                          {reporter.isActive ? (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                              </svg>
                              Deactivate
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Activate
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {reporters.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reporters found</h3>
                <p className="mt-1 text-sm text-gray-500">No reporters have been registered yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Activity Logs</h2>
                    <p className="text-blue-100 text-sm">Monitor all platform activities and user actions</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  <span className="text-white font-semibold text-lg">{activityLogs.length}</span>
                  <span className="text-blue-100 text-sm ml-1">Logs</span>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="p-6">
              <div className="space-y-4">
                {activityLogs.map((log, index) => {
                  // Determine action type for color coding
                  const getActionStyle = (action) => {
                    if (action.includes('Login')) return { bg: 'bg-blue-50', border: 'border-blue-400', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' };
                    if (action.includes('Approve')) return { bg: 'bg-green-50', border: 'border-green-400', icon: 'text-green-600', badge: 'bg-green-100 text-green-800' };
                    if (action.includes('Reject')) return { bg: 'bg-red-50', border: 'border-red-400', icon: 'text-red-600', badge: 'bg-red-100 text-red-800' };
                    if (action.includes('Create') || action.includes('Upload')) return { bg: 'bg-purple-50', border: 'border-purple-400', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-800' };
                    if (action.includes('Update')) return { bg: 'bg-yellow-50', border: 'border-yellow-400', icon: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-800' };
                    if (action.includes('Delete')) return { bg: 'bg-orange-50', border: 'border-orange-400', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-800' };
                    return { bg: 'bg-gray-50', border: 'border-gray-400', icon: 'text-gray-600', badge: 'bg-gray-100 text-gray-800' };
                  };

                  const getActionIcon = (action) => {
                    if (action.includes('Login')) {
                      return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                      );
                    }
                    if (action.includes('Approve')) {
                      return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      );
                    }
                    if (action.includes('Reject')) {
                      return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      );
                    }
                    if (action.includes('Create') || action.includes('Upload')) {
                      return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                      );
                    }
                    if (action.includes('Update')) {
                      return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      );
                    }
                    if (action.includes('Delete')) {
                      return (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      );
                    }
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    );
                  };

                  const style = getActionStyle(log.action);

                  return (
                    <div 
                      key={log._id} 
                      className={`relative ${style.bg} border-l-4 ${style.border} rounded-r-lg p-4 hover:shadow-md transition-all duration-200 transform hover:-translate-x-1`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center ${style.icon}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {getActionIcon(log.action)}
                          </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-base font-bold text-gray-900">{log.action}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.badge} whitespace-nowrap`}>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                              </svg>
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2 leading-relaxed">{log.details}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                            {log.performedBy && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                {log.performedBy.name || log.performedBy.userType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Timeline connector */}
                      {index < activityLogs.length - 1 && (
                        <div className="absolute left-[2.4rem] top-full w-0.5 h-4 bg-gray-300"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {activityLogs.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No activity logs</h3>
                  <p className="mt-1 text-sm text-gray-500">No activities have been recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
