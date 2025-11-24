import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CART_KEY = 'tasty_cart';

const CartPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('delivery');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState(null);

  const [deliveryDetails, setDeliveryDetails] = useState({
    phone: '',
    address: '',
    notes: '',
    allergies: '',
  });

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

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const updateQuantity = (foodItemId, newQty) => {
    if (newQty < 1) return;
    const nextCart = cart.map((item) =>
      item.foodItemId === foodItemId
        ? { ...item, quantity: newQty }
        : item
    );
    setCart(nextCart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
  };

  const increment = (foodItemId) => {
    const item = cart.find((i) => i.foodItemId === foodItemId);
    if (!item) return;
    updateQuantity(foodItemId, item.quantity + 1);
  };

  const decrement = (foodItemId) => {
    const item = cart.find((i) => i.foodItemId === foodItemId);
    if (!item) return;
    if (item.quantity === 1) return;
    updateQuantity(foodItemId, item.quantity - 1);
  };

  const removeItem = (foodItemId) => {
    const nextCart = cart.filter((item) => item.foodItemId !== foodItemId);
    setCart(nextCart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  const handleChangeDeliveryField = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async () => {
    if (!cart.length) return;
    if (!token) {
      setError('You must be logged in to checkout.');
      return;
    }

    setError(null);

    if (orderType === 'delivery') {
      if (!deliveryDetails.phone.trim() || !deliveryDetails.address.trim()) {
        setError('Please enter your phone number and delivery address.');
        return;
      }
    }

    setLoadingCheckout(true);

    try {
      const items = cart.map((item) => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
      }));

      const payload = {
        items,
        type: orderType,
      };

      if (orderType === 'delivery') {
        payload.deliveryDetails = {
          phone: deliveryDetails.phone.trim(),
          address: deliveryDetails.address.trim(),
          notes: deliveryDetails.notes.trim(),
          allergies: deliveryDetails.allergies.trim(),
        };
      }

      const data = await apiFetch(
        '/api/payments/create-checkout-session',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        },
        token
      );

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server.');
      }
    } catch (err) {
      setError(err.message || 'Failed to start checkout.');
      setLoadingCheckout(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </p>
        <p className="text-gray-600 mb-6">
          Browse the menu and add something delicious.
        </p>
        <button
          onClick={() => navigate('/user/menu')}
          className="px-6 py-3 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition shadow-sm hover:shadow-md"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 w-full">
      <div className="max-w-7xl mx-auto px-4 w-full space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF8A05] via-[#FF632B] to-[#111827] text-white p-8 shadow-xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                Checkout hub
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold">
                Ready to feast?
              </h1>
              <p className="mt-2 text-white/80 max-w-2xl">
                Review your cart, choose delivery or pickup, and head to secure
                checkout in seconds.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 min-w-[240px] text-right">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Items
              </p>
              <p className="text-3xl font-semibold">{cart.length}</p>
              <p className="text-sm text-white/70">
                Subtotal ${total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article
                key={item.foodItemId}
                className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col sm:flex-row gap-4"
              >
                <div className="h-28 w-28 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl">
                      🌯
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <span className="text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} each ·{' '}
                      <span className="font-medium text-gray-700">
                        {item.quantity} serving
                        {item.quantity > 1 ? 's' : ''}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 p-1">
                      <button
                        onClick={() => decrement(item.foodItemId)}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                      >
                        −
                      </button>
                      <span className="px-2 font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increment(item.foodItemId)}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.foodItemId)}
                      className="text-sm font-semibold text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="xl:sticky xl:top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order summary
                </h2>
                <p className="text-sm text-gray-500">
                  Taxes calculated at Stripe checkout.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Delivery fee</span>
                  <span className="font-semibold">$0.99</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Estimated total
                  </span>
                  <span className="text-2xl font-semibold text-gray-900">
                    ${(total + 0.99).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Choose fulfillment
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Delivery', value: 'delivery', icon: '🚚' },
                    { label: 'Pickup', value: 'pickup', icon: '🏃' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setOrderType(option.value)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        orderType === option.value
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        {option.icon} {option.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {option.value === 'delivery'
                          ? 'Doorstep in ~30 min'
                          : 'Ready for lobby pickup'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {orderType === 'delivery' ? (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-gray-700">
                    Delivery details
                  </p>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryDetails.phone}
                    onChange={handleChangeDeliveryField}
                    placeholder="Phone number"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <textarea
                    name="address"
                    value={deliveryDetails.address}
                    onChange={handleChangeDeliveryField}
                    rows={2}
                    placeholder="Delivery address"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                  <input
                    type="text"
                    name="notes"
                    value={deliveryDetails.notes}
                    onChange={handleChangeDeliveryField}
                    placeholder="Delivery notes (optional)"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    name="allergies"
                    value={deliveryDetails.allergies}
                    onChange={handleChangeDeliveryField}
                    placeholder="Allergies (optional)"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 mb-6">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    Pickup instructions
                  </p>
                  <p className="text-sm text-gray-600">
                    Shawarma Hub · 403 Main St, Grambling, LA 71245
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Head to the pickup counter and show your order number. We’ll
                    keep it hot.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loadingCheckout || !cart.length}
                className="w-full rounded-full bg-black text-white py-3 text-base font-semibold hover:bg-gray-900 transition disabled:opacity-50"
              >
                {loadingCheckout ? 'Processing...' : 'Proceed to checkout'}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="mt-3 w-full text-sm font-semibold text-gray-500 hover:text-red-500"
              >
                Clear cart
              </button>
            </div>

            <button
              onClick={() => navigate('/user/menu')}
              className="w-full py-3 border-2 border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition"
            >
              Keep browsing menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
