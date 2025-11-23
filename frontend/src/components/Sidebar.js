import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-30">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500">
              <span className="text-white font-bold text-lg">SH</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Shawarma Hub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/user/menu"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive('/user/menu')
                ? 'bg-orange-50 text-orange-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Menu</span>
          </Link>

          <Link
            to="/user/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive('/user/orders')
                ? 'bg-orange-50 text-orange-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Orders</span>
          </Link>

          <Link
            to="/user/cart"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive('/user/cart')
                ? 'bg-orange-50 text-orange-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Cart</span>
          </Link>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-semibold text-sm">
                {user.name?.[0] || user.email?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500">Account</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition text-left"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

