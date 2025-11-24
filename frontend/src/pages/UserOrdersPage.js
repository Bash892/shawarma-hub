import React, { useEffect, useMemo, useState } from 'react';
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
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(
      (order) => (order.status || 'pending').toLowerCase() === statusFilter
    );
  }, [orders, statusFilter]);

  return (
    <div className="bg-gray-50 min-h-screen py-8 w-full">
      <div className="max-w-7xl mx-auto px-4 w-full space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141E30] via-[#4B2D52] to-[#FF6B2C] text-white p-8 shadow-xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_55%)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                Order history
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Track every shawarma journey
              </h1>
              <p className="mt-2 text-white/80 max-w-2xl">
                See status, delivery details, and receipts across pickup and
                delivery orders.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 text-right">
              <p className="text-xs uppercase tracking-wide text-white/70">
                Lifetime spend
              </p>
              <p className="text-3xl font-semibold">
                $
                {orders
                  .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-white/70">
                {orders.length} orders placed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Order feed
              </h2>
              <p className="text-sm text-gray-500">
                Filter by status and revisit details anytime.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'preparing', 'delivered', 'completed'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                      statusFilter === status
                        ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                  >
                    {status === 'all'
                      ? 'All'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4" />
            <p className="text-gray-600 font-medium">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              No orders match this view
            </p>
            <p className="text-sm text-gray-600">
              Try changing the status filter or place your first order.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <article
                key={order._id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>
                        {order.type === 'pickup' ? '🏃 Pickup' : '🚚 Delivery'}
                      </span>
                      <span>•</span>
                      <span>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status || 'Unknown'}
                    </span>
                    <span className="text-2xl font-semibold text-gray-900">
                      ${order.totalAmount?.toFixed(2) ?? '0.00'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Items
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {order.items?.map((item) => (
                        <li
                          key={item._id}
                          className="flex items-center justify-between"
                        >
                          <span>
                            {item.foodItem?.name || 'Item'} × {item.quantity}
                          </span>
                          <span className="font-semibold">
                            ${(
                              (item.foodItem?.price || 0) * item.quantity
                            ).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-gray-100 p-4">
                    {order.type === 'delivery' ? (
                      <>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Delivery details
                        </p>
                        <p className="text-sm text-gray-700">
                          📞 {order.deliveryDetails?.phone || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-700">
                          📍{' '}
                          {order.deliveryDetails?.address ||
                            'No address provided'}
                        </p>
                        {order.deliveryDetails?.notes && (
                          <p className="text-xs text-gray-500 mt-2">
                            Notes: {order.deliveryDetails.notes}
                          </p>
                        )}
                        {order.deliveryDetails?.allergies && (
                          <p className="text-xs text-amber-700 mt-1">
                            Allergies: {order.deliveryDetails.allergies}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-3">
                          Driver:{' '}
                          <span className="font-semibold text-gray-700">
                            {order.assignedWorker?.name || 'Unassigned'}
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Pickup info
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          Shawarma Hub
                        </p>
                        <p className="text-sm text-gray-600">
                          403 Main St, Grambling, LA 71245
                        </p>
                        <p className="text-xs text-gray-500 mt-3">
                          Have your order number ready at arrival.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;
