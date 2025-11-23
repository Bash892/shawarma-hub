import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CART_KEY = 'tasty_cart';

const TopHeader = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [orderType, setOrderType] = useState('delivery');

  useEffect(() => {
    if (!user || user.role !== 'user') return;

    const updateCartCount = () => {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        try {
          const cart = JSON.parse(saved);
          const count = cart.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(count);
        } catch {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, [user]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search Shawarma Hub"
                className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Grambling, LA</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Delivery/Pickup Toggle */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setOrderType('delivery')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${
                orderType === 'delivery'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${
                orderType === 'pickup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pickup
            </button>
          </div>

          {/* Cart Icon */}
          <button
            onClick={() => navigate('/user/cart')}
            className="relative p-2 text-gray-700 hover:text-orange-600 transition"
            aria-label="Shopping cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;

