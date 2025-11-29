import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b-2 border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Professional Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Logo Icon */}
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H16"/>
                  <circle cx="12" cy="10" r="1" fill="currentColor"/>
                  <circle cx="8" cy="14" r="1" fill="currentColor"/>
                </svg>
                {/* Pulse effect */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
            </div>
            
            {/* Title */}
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                PRATHINITYAM
              </span>
              <span className="text-xs font-semibold text-indigo-600 tracking-widest uppercase">
                News Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-gray-700 font-semibold hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    Login
                  </span>
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    </svg>
                    Register
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="px-4 py-2.5 text-gray-700 font-medium hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  Home
                </Link>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    className="px-4 py-2.5 bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 rounded-lg transition-all duration-200 flex items-center gap-2 border border-purple-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    Admin Panel
                  </Link>
                )}
                
                {user.role === 'reporter' && (
                  <Link 
                    to="/reporter/dashboard" 
                    className="px-4 py-2.5 bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 rounded-lg transition-all duration-200 flex items-center gap-2 border border-blue-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                    Reporter Panel
                  </Link>
                )}
                
                {user.role === 'user' && (
                  <Link 
                    to="/user/dashboard" 
                    className="px-4 py-2.5 bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 rounded-lg transition-all duration-200 flex items-center gap-2 border border-indigo-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Dashboard
                  </Link>
                )}
                
                <div className="h-8 w-px bg-gray-300 mx-2"></div>
                
                <button
                  onClick={logout}
                  className="px-4 py-2.5 bg-red-50 text-red-600 font-semibold hover:bg-red-100 rounded-lg transition-all duration-200 flex items-center gap-2 border border-red-200 hover:border-red-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
