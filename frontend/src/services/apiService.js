import API from './api';

// Auth Services
export const authService = {
  registerUser: (data) => API.post('/auth/register/user', data),
  registerReporter: (data) => API.post('/auth/register/reporter', data),
  loginUser: (data) => API.post('/auth/login/user', data),
  loginReporter: (data) => API.post('/auth/login/reporter', data),
  loginAdmin: (data) => API.post('/auth/login/admin', data),
};

// News Services
export const newsService = {
  getAllNews: (params) => API.get('/news', { params }),
  getNewsById: (id) => API.get(`/news/${id}`),
  createNews: (data) => API.post('/news', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateNews: (id, data) => API.put(`/news/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteNews: (id) => API.delete(`/news/${id}`),
  getMyNews: () => API.get('/news/reporter/my-news'),
};

// Trending Services
export const trendingService = {
  getAllTrending: (params) => API.get('/trending', { params }),
  getTrendingById: (id) => API.get(`/trending/${id}`),
  createTrending: (data) => API.post('/trending', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateTrending: (id, data) => API.put(`/trending/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteTrending: (id) => API.delete(`/trending/${id}`),
  getMyTrending: () => API.get('/trending/reporter/my-trending'),
};

// Video Services
export const videoService = {
  getAllVideos: (params) => API.get('/videos', { params }),
  getVideoById: (id) => API.get(`/videos/${id}`),
  createVideo: (data) => API.post('/videos', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateVideo: (id, data) => API.put(`/videos/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteVideo: (id) => API.delete(`/videos/${id}`),
  getMyVideos: () => API.get('/videos/reporter/my-videos'),
};

// Admin Services
export const adminService = {
  getPendingApprovals: () => API.get('/admin/pending-approvals'),
  approveNews: (id) => API.put(`/admin/approve/news/${id}`),
  rejectNews: (id, reason) => API.put(`/admin/reject/news/${id}`, { reason }),
  approveTrending: (id) => API.put(`/admin/approve/trending/${id}`),
  rejectTrending: (id, reason) => API.put(`/admin/reject/trending/${id}`, { reason }),
  approveVideo: (id) => API.put(`/admin/approve/video/${id}`),
  rejectVideo: (id, reason) => API.put(`/admin/reject/video/${id}`, { reason }),
  getReporters: () => API.get('/admin/reporters'),
  toggleReporterStatus: (id) => API.put(`/admin/reporter/${id}/toggle-status`),
  getActivityLogs: (params) => API.get('/admin/activity-logs', { params }),
  getStats: () => API.get('/admin/stats'),
};
