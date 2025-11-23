import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
            SH
          </span>
          <span className="text-lg font-semibold tracking-tight text-gray-900">Shawarma Hub</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {!user && (
            <>
              <Link to="/login" className="text-gray-700 hover:text-orange-600 transition">
                User Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-orange-600 transition">
                User Signup
              </Link>
              <Link to="/admin/login" className="text-gray-700 hover:text-orange-600 transition">
                Admin Login
              </Link>
            </>
          )}

          {user && user.role === 'user' && (
            <>
              <Link to="/user/menu" className="text-gray-700 hover:text-orange-600 transition">
                Menu
              </Link>
              <Link to="/user/cart" className="text-gray-700 hover:text-orange-600 transition">
                Cart
              </Link>
              <Link to="/user/orders" className="text-gray-700 hover:text-orange-600 transition">
                Orders
              </Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-orange-600 transition">
                Dashboard
              </Link>
              <Link to="/admin/menu" className="text-gray-700 hover:text-orange-600 transition">
                Menu
              </Link>
              <Link to="/admin/orders" className="text-gray-700 hover:text-orange-600 transition">
                Orders
              </Link>
              <Link to="/admin/workers" className="text-gray-700 hover:text-orange-600 transition">
                Workers
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={logout}
              className="ml-2 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-orange-500 hover:text-orange-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
