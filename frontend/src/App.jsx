import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import ReporterDashboard from './pages/ReporterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NewsDetailPage from './pages/NewsDetailPage';
import TrendingDetailPage from './pages/TrendingDetailPage';
import VideoDetailPage from './pages/VideoDetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/news/:id" element={<NewsDetailPage />} />
            <Route path="/trending/:id" element={<TrendingDetailPage />} />
            <Route path="/video/:id" element={<VideoDetailPage />} />

            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <PrivateRoute allowedRoles={['user']}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            {/* Reporter Routes */}
            <Route
              path="/reporter/dashboard"
              element={
                <PrivateRoute allowedRoles={['reporter']}>
                  <ReporterDashboard />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Unauthorized */}
            <Route
              path="/unauthorized"
              element={
                <div className="container mx-auto px-4 py-12 text-center">
                  <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
                  <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="container mx-auto px-4 py-12 text-center">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              }
            />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
