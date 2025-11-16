import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold">
            TB
          </span>
          <span className="text-lg font-semibold tracking-tight">Tasty Bites</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {!user && (
            <>
              <Link to="/login" className="hover:text-red-400">
                User Login
              </Link>
              <Link to="/register" className="hover:text-red-400">
                User Signup
              </Link>
              <Link to="/admin/login" className="hover:text-red-400">
                Admin Login
              </Link>
            </>
          )}

          {user && user.role === 'user' && (
            <>
              <Link to="/user/menu" className="hover:text-red-400">
                Menu
              </Link>
              <Link to="/user/cart" className="hover:text-red-400">
                Cart
              </Link>
              <Link to="/user/orders" className="hover:text-red-400">
                Orders
              </Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="hover:text-red-400">
                Dashboard
              </Link>
              <Link to="/admin/menu" className="hover:text-red-400">
                Menu
              </Link>
              <Link to="/admin/orders" className="hover:text-red-400">
                Orders
              </Link>
              <Link to="/admin/workers" className="hover:text-red-400">
                Workers
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={logout}
              className="ml-2 rounded-full border border-slate-700 px-3 py-1 text-xs hover:border-red-500 hover:text-red-300"
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
