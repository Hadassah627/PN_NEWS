import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('user'); // user, reporter, admin
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    reporterId: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      
      if (activeTab === 'user') {
        response = await authService.loginUser({
          email: formData.email,
          password: formData.password
        });
      } else if (activeTab === 'reporter') {
        response = await authService.loginReporter({
          reporterId: formData.reporterId,
          password: formData.password
        });
      } else if (activeTab === 'admin') {
        response = await authService.loginAdmin({
          email: formData.email,
          password: formData.password
        });
      }

      const { token, user, reporter, admin } = response.data;
      const userData = user || reporter || admin;
      
      login(token, userData);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (activeTab === 'admin') {
        navigate('/admin/dashboard');
      } else if (activeTab === 'reporter') {
        navigate('/reporter/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card border-2 border-primary shadow-xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-6 font-medium shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </button>

          {/* Login Icon and Heading */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-10 w-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-primary portal-title-static">Login</h2>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button
              className={`flex-1 py-2 text-center ${activeTab === 'user' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('user')}
            >
              User
            </button>
            <button
              className={`flex-1 py-2 text-center ${activeTab === 'reporter' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('reporter')}
            >
              Reporter
            </button>
            <button
              className={`flex-1 py-2 text-center ${activeTab === 'admin' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'reporter' ? (
              <div>
                <label className="flex items-center text-sm font-semibold mb-2 text-gray-700">
                  <svg className="h-5 w-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/>
                  </svg>
                  Reporter ID
                </label>
                <input
                  type="text"
                  name="reporterId"
                  value={formData.reporterId}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., HydPN101"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Format: PlaceNamePN + Number</p>
              </div>
            ) : (
              <div>
                <label className="flex items-center text-sm font-semibold mb-2 text-gray-700">
                  <svg className="h-5 w-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            <div>
              <label className="flex items-center text-sm font-semibold mb-2 text-gray-700">
                <svg className="h-5 w-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {activeTab !== 'admin' && (
            <p className="text-center mt-4 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
