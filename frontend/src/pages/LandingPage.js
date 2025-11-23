import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/food-hero.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'user') {
      navigate('/user/menu');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />

        {/* your text */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-white">
            Shawarma Hub
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-6">
            Delicious shawarma, delivered fast. Pickup and delivery from your favorite local spot.
          </p>

          {/* Fake address bar */}
          <div className="mx-auto mb-6 max-w-xl">
            <div className="flex gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg">
              <input
                type="text"
                placeholder="Enter your address to see what's cooking..."
                className="flex-1 rounded-full border-0 bg-transparent px-3 py-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleGetStarted}
                className="rounded-full bg-orange-500 px-4 py-1 text-sm font-semibold text-white hover:bg-orange-600 transition"
              >
                {user ? 'Go to app' : 'Get started'}
              </button>
            </div>
          </div>

          <p className="text-xs text-white/80">
            Sign in to order for delivery or pickup from Shawarma Hub.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-12 bg-white">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
            Your favorites, in just a few clicks
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Shawarma, wraps, salads, and more. Choose delivery to your door or pickup on your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 text-3xl">🌯</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Fresh & Tasty</h3>
            <p className="text-sm text-gray-600">
              Handcrafted shawarma made with quality ingredients and authentic flavors.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 text-3xl">🚚</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Hot and fresh to your doorstep, right when you need it.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 text-3xl">⭐</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Local Favorite</h3>
            <p className="text-sm text-gray-600">
              Loved by customers all over town for flavor and service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
