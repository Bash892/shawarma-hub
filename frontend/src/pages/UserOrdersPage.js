import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const statusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const UserOrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await apiFetch('/api/orders/my', {}, token);
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 w-full">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600 mb-6">View your order history</p>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">No orders yet</p>
            <p className="text-sm text-gray-600">
              You haven't placed any orders yet. Add something to your cart to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 font-medium">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {order.type === 'pickup' ? '🏃 Pickup' : '🚚 Delivery'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status || 'Unknown'}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ${order.totalAmount?.toFixed(2) ?? '0.00'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
                  <ul className="space-y-2">
                    {order.items?.map((item) => (
                      <li key={item._id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.foodItem?.name || 'Item'} x {item.quantity}
                        </span>
                        <span className="text-gray-900 font-semibold">
                          ${(
                            (item.foodItem?.price || 0) * item.quantity
                          ).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery vs Pickup info */}
                {order.type === 'delivery' ? (
                  <div className="border-t border-gray-200 pt-4 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Delivery Details
                    </p>
                    <p className="text-sm text-gray-700">
                      📞 {order.deliveryDetails?.phone || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-700">
                      📍 {order.deliveryDetails?.address || 'No address provided'}
                    </p>
                    {order.deliveryDetails?.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">Notes:</span> {order.deliveryDetails.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Driver: {order.assignedWorker?.name || 'Unassigned'}
                    </p>
                    {order.deliveryDetails?.allergies && (
                      <p className="text-xs text-amber-700 mt-2 font-medium">
                        ⚠️ Allergies: {order.deliveryDetails.allergies}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Pickup Location
                    </p>
                    <p className="text-base font-bold text-gray-900">Shawarma Hub</p>
                    <p className="text-sm text-gray-600">
                      403 Main St, Grambling, LA 71245
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Please arrive on time and have your order number ready.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;
