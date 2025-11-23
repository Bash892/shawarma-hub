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
        <p className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</p>
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
      <div className="max-w-7xl mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.foodItemId}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4"
              >
                <div className="h-24 w-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl">
                      🍽️
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrement(item.foodItemId)}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center font-semibold text-gray-900">
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
                      className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">$0.99</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${(total + 0.99).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Type Toggle */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Order Type</p>
                <div className="inline-flex rounded-full bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      orderType === 'delivery'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    🚚 Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      orderType === 'pickup'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    🏃 Pickup
                  </button>
                </div>
              </div>

              {/* Delivery Form */}
              {orderType === 'delivery' ? (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-gray-700">Delivery Details</p>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryDetails.phone}
                    onChange={handleChangeDeliveryField}
                    className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                  <textarea
                    name="address"
                    value={deliveryDetails.address}
                    onChange={handleChangeDeliveryField}
                    rows={2}
                    className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Delivery address"
                  />
                  <input
                    type="text"
                    name="notes"
                    value={deliveryDetails.notes}
                    onChange={handleChangeDeliveryField}
                    className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Delivery notes (optional)"
                  />
                  <input
                    type="text"
                    name="allergies"
                    value={deliveryDetails.allergies}
                    onChange={handleChangeDeliveryField}
                    className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Allergies (optional)"
                  />
                </div>
              ) : (
                <div className="mb-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Pickup Location</p>
                  <p className="text-base font-bold text-gray-900 mb-1">Shawarma Hub</p>
                  <p className="text-sm text-gray-600">
                    403 Main St, Grambling, LA 71245
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Show this address at pickup. Have your order number ready.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loadingCheckout || !cart.length}
                className="w-full py-3 bg-orange-500 text-white rounded-full text-base font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow-md mb-3"
              >
                {loadingCheckout ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full text-sm text-gray-600 hover:text-orange-500 font-medium transition"
              >
                Clear cart
              </button>
            </div>

            <button
              onClick={() => navigate('/user/menu')}
              className="mt-4 w-full py-2 border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:border-gray-300 hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
