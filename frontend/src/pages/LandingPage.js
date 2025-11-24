import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroFood from '../assets/hero-food.jpg';

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
      <section className="relative overflow-hidden bg-[#FAF4EB]">
        <div className="absolute -top-20 -right-32 w-[520px] h-[520px] bg-orange-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-amber-100 rounded-full blur-3xl opacity-40" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
              Shawarma Hub Delivery
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Order shawarma near you in minutes.
            </h1>
            <p className="text-lg text-gray-600">
              Pickup or delivery from your favorite neighborhood shawarma spot.
              Real ingredients, blazing fast fulfillment, every time.
            </p>

            <div className="bg-white rounded-3xl shadow-2xl shadow-orange-100 p-4 space-y-4 w-full max-w-xl">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3">
                  <span className="text-gray-400 text-lg">📍</span>
                  <input
                    type="text"
                    placeholder="Enter delivery address"
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3">
                  <span className="text-gray-400 text-lg">🕒</span>
                  <select className="bg-transparent text-sm text-gray-900 focus:outline-none">
                    <option>Deliver now</option>
                    <option>Schedule later</option>
                    <option>Pickup</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="flex-1 rounded-2xl bg-black text-white font-semibold py-3 text-sm hover:bg-gray-900 transition"
                >
                  {user ? 'Open app' : 'Search nearby'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="rounded-2xl border border-gray-300 text-sm font-semibold text-gray-700 py-3 hover:border-gray-400 transition"
                >
                  Sign in
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Or{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-orange-600 font-semibold underline-offset-2 hover:underline"
                >
                  create an account
                </button>
                .
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] bg-white shadow-2xl p-4">
              <div className="rounded-[28px] overflow-hidden">
                <img
                  src={heroFood}
                  alt="Shawarma spread"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Featured</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Family Shawarma Feast
                  </p>
                </div>
                <span className="text-sm font-semibold text-orange-500">
                  Ready in 20 min
                </span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 text-sm">
              ⭐ Rated 4.9 • Thousands of local fans
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Avg delivery time', value: '28 min' },
            { label: 'Restaurants onboarded', value: '25+' },
            { label: 'Cities covered', value: '8 neighborhoods' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Go from craving to delivery in a few taps.
          </h2>
          <p className="text-base text-gray-600">
            Shawarma, wraps, salads, and desserts — curated for fast pickup or
            delivery, inspired by the Uber Eats experience but crafted for
            Shawarma Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Fresh & Tasty',
              description:
                'Handcrafted shawarma made with authentic spices, grilled to order.',
              emoji: '🌯',
            },
            {
              title: 'Lightning Fast',
              description:
                'Route-optimized delivery gets your order to you while it is still sizzling.',
              emoji: '⚡',
            },
            {
              title: 'Local Favorite',
              description:
                'Loved by thousands of regulars for flavor, hospitality, and reliability.',
              emoji: '⭐',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
