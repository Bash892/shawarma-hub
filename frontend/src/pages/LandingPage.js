import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero-food.jpg'; // put an image here

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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section
        className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />

        {/* your text */}
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Tasty Bites
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-6">
            Delicious food, delivered fast. Pickup and delivery from your favorite local spot.
          </p>

          {/* Fake address bar */}
          <div className="mx-auto mb-6 max-w-xl">
            <div className="flex gap-2 rounded-full bg-white/95 px-3 py-2 shadow-lg">
              <input
                type="text"
                placeholder="Enter your address to see what’s cooking..."
                className="flex-1 rounded-full border-0 bg-transparent px-3 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleGetStarted}
                className="rounded-full bg-red-500 px-4 py-1 text-sm font-semibold text-white hover:bg-red-600 transition"
              >
                {user ? 'Go to app' : 'Get started'}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Sign in to order for delivery or pickup from Tasty Bites.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Your favorites, in just a few clicks
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            Burgers, pasta, salads, and more. Choose delivery to your door or pickup on your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <div className="mb-4 text-3xl">🍔</div>
            <h3 className="text-lg font-semibold mb-2">Fresh & Tasty</h3>
            <p className="text-sm text-slate-300">
              Handcrafted meals made with quality ingredients and local flavors.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <div className="mb-4 text-3xl">🚚</div>
            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-slate-300">
              Hot and fresh to your doorstep, right when you need it.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <div className="mb-4 text-3xl">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Local Favorite</h3>
            <p className="text-sm text-slate-300">
              Loved by customers all over town for flavor and service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
