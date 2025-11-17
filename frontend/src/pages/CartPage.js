import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CART_KEY = 'tasty_cart';

const CartPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState(null);

  // ✅ new: delivery details state
  const [deliveryDetails, setDeliveryDetails] = useState({
    phone: '',
    address: '',
    notes: '',
    allergies: '',
  });

  // Load cart from localStorage
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

  // ✅ new: handle delivery form changes
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

    // reset error
    setError(null);

    // ✅ validate delivery details if delivery
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

      // ✅ include deliveryDetails for delivery orders
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
        // don't clear cart here; we clear it on success page
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold mb-2">Your cart is empty.</p>
        <p className="text-sm text-slate-400 mb-4">
          Browse the menu and add something delicious.
        </p>
        <button
          onClick={() => navigate('/user/menu')}
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      {/* Cart items */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold mb-2">Your Cart</h1>
        {cart.map((item) => (
          <div
            key={item.foodItemId}
            className="flex gap-3 rounded-2xl bg-slate-900/70 border border-slate-800 p-3"
          >
            <div className="h-20 w-20 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-500">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold">{item.name}</h3>
                <p className="text-xs text-slate-400">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-2 py-1 text-xs">
                  <button
                    onClick={() => decrement(item.foodItemId)}
                    className="h-5 w-5 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
                  >
                    -
                  </button>
                  <span className="min-w-[1.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increment(item.foodItemId)}
                    className="h-5 w-5 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.foodItemId)}
                  className="text-[11px] text-slate-400 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <span className="text-sm font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary / checkout */}
      <div className="space-y-4">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

          <div className="flex items-center justify-between mb-2 text-sm">
            <span>Items total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Order type toggle */}
          <div className="mt-4 mb-3">
            <p className="text-xs text-slate-400 mb-1">Order type</p>
            <div className="inline-flex rounded-full bg-slate-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={[
                  'px-3 py-1 rounded-full',
                  orderType === 'delivery'
                    ? 'bg-red-500 text-white'
                    : 'text-slate-300',
                ].join(' ')}
              >
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={[
                  'px-3 py-1 rounded-full',
                  orderType === 'pickup'
                    ? 'bg-red-500 text-white'
                    : 'text-slate-300',
                ].join(' ')}
              >
                Pickup
              </button>
            </div>
          </div>

          {/* ✅ Delivery form vs Pickup info */}
          {orderType === 'delivery' ? (
            <div className="space-y-2 mb-4">
              <p className="text-xs text-slate-400 mb-1">Delivery details</p>

              <input
                type="text"
                name="phone"
                value={deliveryDetails.phone}
                onChange={handleChangeDeliveryField}
                className="w-full mb-2 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                placeholder="Phone number"
              />

              <textarea
                name="address"
                value={deliveryDetails.address}
                onChange={handleChangeDeliveryField}
                rows={2}
                className="w-full mb-2 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                placeholder="Delivery address"
              />

              <input
                type="text"
                name="notes"
                value={deliveryDetails.notes}
                onChange={handleChangeDeliveryField}
                className="w-full mb-2 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                placeholder="Delivery notes (optional)"
              />

              <input
                type="text"
                name="allergies"
                value={deliveryDetails.allergies}
                onChange={handleChangeDeliveryField}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
                placeholder="Allergies (optional)"
              />
            </div>
          ) : (
            <div className="mb-4 rounded-xl bg-slate-950 border border-slate-800 p-3">
              <p className="text-xs text-slate-400 mb-1">Pickup location</p>
              <p className="text-sm text-slate-100 font-medium">Tasty Bites</p>
              <p className="text-xs text-slate-300">
                403 Main St, Grambling, LA 71245
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Show this address at pickup. Have your order number ready.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-lg bg-red-900/40 border border-red-700 px-3 py-2 text-xs text-red-100">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loadingCheckout || !cart.length}
            className="w-full rounded-full bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loadingCheckout ? 'Redirecting to payment...' : 'Checkout with Stripe'}
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="mt-3 w-full text-[11px] text-slate-400 hover:text-red-400"
          >
            Clear cart
          </button>
        </div>

        <button
          onClick={() => navigate('/user/menu')}
          className="w-full rounded-full border border-slate-700 py-2 text-xs text-slate-300 hover:border-red-500 hover:text-red-300 transition"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default CartPage;
