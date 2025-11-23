import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

const CART_KEY = 'tasty_cart';

// Category icons mapping
const categoryIcons = {
  'All': '🍽️',
  'Shawarma': '🌯',
  'Desserts': '🍰',
  'Salads': '🥗',
  'Sides': '🍽️',
  'Drinks': '🥤',
  'Fast Food': '🍟',
  'Burgers': '🍔',
  'Pizza': '🍕',
  'Chicken': '🍗',
  'Mexican': '🌮',
  'Indian': '🍛',
  'Breakfast': '🥓',
  'Seafood': '🦐',
  'Comfort Food': '🍲',
  'Steak': '🥩',
  'Bubble Tea': '🧋',
  'Barbecue': '🍖',
  'Mediterranean': '🥙',
  'Smoothies': '🥤',
};

const UserMenuPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Load existing cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
  }, []);

  // Fetch menu from backend
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch('/api/menu');
        setMenu(data);
      } catch (err) {
        setError(err.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [token]);

  const saveCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddToCart = (item) => {
    const existing = cart.find((c) => c.foodItemId === item._id);
    let nextCart;
    if (existing) {
      nextCart = cart.map((c) =>
        c.foodItemId === item._id
          ? { ...c, quantity: c.quantity + 1 }
          : c
      );
    } else {
      nextCart = [
        ...cart,
        {
          foodItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          imageUrl: item.imageUrl,
        },
      ];
    }
    saveCart(nextCart);
  };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const categories = useMemo(() => {
    const set = new Set();
    menu.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    
    // Define category order: Shawarma, Desserts, Salads, Sides, Drinks
    const categoryOrder = {
      'Shawarma': 1,
      'Desserts': 2,
      'Salads': 3,
      'Sides': 4,
      'Drinks': 5,
    };
    
    // Sort categories by the defined order, then alphabetically for any others
    const sortedCategories = Array.from(set).sort((a, b) => {
      const orderA = categoryOrder[a] || 999;
      const orderB = categoryOrder[b] || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      return a.localeCompare(b);
    });
    
    return ['All', ...sortedCategories];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    let filtered = menu;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.description && item.description.toLowerCase().includes(term)) ||
          (item.category && item.category.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [menu, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 ml-64">
          <TopHeader onSearch={setSearchTerm} />
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading menu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-white">
        <Sidebar />
        <div className="flex-1 ml-64">
          <TopHeader onSearch={setSearchTerm} />
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl max-w-md text-center">
              <p className="font-semibold mb-1">Unable to load menu</p>
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <TopHeader onSearch={setSearchTerm} />
        
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Category Filters */}
            <div className="mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      flex flex-col items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-200 min-w-[80px]
                      ${
                        selectedCategory === cat
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }
                    `}
                  >
                    <span className="text-2xl">{categoryIcons[cat] || '🍽️'}</span>
                    <span className="text-xs font-semibold">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredMenu.length} {filteredMenu.length === 1 ? 'result' : 'results'}
              </p>
            </div>

            {/* Menu Grid */}
            {filteredMenu.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg font-medium mb-2">
                  {searchTerm
                    ? `No items found matching "${searchTerm}"`
                    : 'No items available in this category.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="text-orange-500 hover:text-orange-600 font-semibold text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenu.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-100 cursor-pointer"
                    onClick={() => handleAddToCart(item)}
                  >
                    {/* Image */}
                    <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <span className="text-5xl">{categoryIcons[item.category] || '🍽️'}</span>
                        </div>
                      )}
                      <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.category && (
                            <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenuPage;
