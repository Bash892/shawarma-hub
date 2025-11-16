import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CART_KEY = 'tasty_cart';

const UserMenuPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
        const data = await apiFetch('/api/menu'); // no auth required
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

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const categories = useMemo(() => {
    const set = new Set();
    menu.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'All') return menu;
    return menu.filter((item) => item.category === selectedCategory);
  }, [menu, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-300">
        Loading menu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-900/40 border border-red-700 text-red-100 px-4 py-3 rounded-lg max-w-md text-center">
          <p className="font-semibold mb-1">Unable to load menu</p>
          <p className="text-sm mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs border border-red-500 px-3 py-1 rounded-full hover:bg-red-500/20"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Cart summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Menu</h1>
          <p className="text-sm text-slate-400">
            Choose from our curated list of Tasty Bites favorites.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/user/cart')}
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
          >
            <span>View Cart</span>
            <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white/15 px-2 text-xs">
              {cartCount}
            </span>
            <span className="text-xs text-red-100">
              (${cartTotal.toFixed(2)})
            </span>
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={[
              'px-3 py-1 rounded-full border text-xs md:text-sm transition',
              selectedCategory === cat
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-red-500/70',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      {filteredMenu.length === 0 ? (
        <p className="text-sm text-slate-400">
          No items available in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMenu.map((item) => (
            <div
              key={item._id}
              className="flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-red-500/60 transition"
            >
              <div className="relative h-40 w-full bg-slate-800">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
                    No image
                  </div>
                )}
                {item.category && (
                  <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-100">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex-1 mb-3">
                  <h3 className="text-sm font-semibold mb-1">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-400 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-100">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMenuPage;
