import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const statusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-300';
    case 'preparing':
      return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const statusOptions = ['pending', 'preparing', 'delivered', 'completed', 'cancelled'];

const AdminOrdersPage = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // load all orders + workers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersData, workersData] = await Promise.all([
          apiFetch('/api/orders', {}, token),
          apiFetch('/api/workers', {}, token),
        ]);
        setOrders(ordersData);
        setWorkers(workersData);
      } catch (err) {
        console.error('Failed to fetch admin orders/workers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // change order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await apiFetch(
        `/api/orders/${orderId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
        },
        token
      );

      // update in state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
    } catch (err) {
      console.error('Failed to update order status', err);
      // Optional: show toast/error
    }
  };

  // assign / unassign worker
  const handleAssignWorker = async (orderId, workerId) => {
    try {
      const body =
        workerId && workerId !== ''
          ? { workerId }
          : { workerId: null }; // allow unassign

      const updated = await apiFetch(
        `/api/orders/${orderId}/assign`,
        {
          method: 'PATCH',
          body: JSON.stringify(body),
        },
        token
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
    } catch (err) {
      console.error('Failed to assign worker to order', err);
    }
  };

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return orders;
    return orders.filter(
      (order) => (order.status || 'pending').toLowerCase() === filterStatus
    );
  }, [orders, filterStatus]);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 w-full space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F2933] via-[#FF5A2D] to-[#FF2D20] text-white p-8 shadow-xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70 mb-3">
                Fulfillment Center
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Live Orders Command Deck
              </h1>
              <p className="mt-2 text-white/80 max-w-3xl">
                Monitor order lifecycle, reassign couriers, and update kitchen
                stages with real-time data pulled from the order service.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 min-w-[220px] backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide mb-1 text-white/70">
                Orders in queue
              </p>
              <p className="text-4xl font-semibold">
                {loading ? '...' : orders.length}
              </p>
              <p className="text-sm text-white/70">
                {orders.filter((o) => o.status === 'pending').length} awaiting
                prep
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Order Streams
              </h2>
              <p className="text-sm text-gray-500">
                Filter by status to focus on the most critical queue.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', ...statusOptions].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    filterStatus === status
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-orange-400'
                  }`}
                >
                  {status === 'all'
                    ? 'All Orders'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center text-gray-500">
              Loading live orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center text-gray-500">
              No orders match this filter yet.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <article
                key={order._id}
                className="rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${statusColor(
                          order.status
                        )}`}
                      >
                        {order.status || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {order.user?.name || 'Unknown customer'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.email || 'No email provided'}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📞 {order.deliveryDetails?.phone || 'No phone on file'}</p>
                      <p>
                        📍{' '}
                        {order.deliveryDetails?.address ||
                          (order.type === 'pickup'
                            ? 'Pickup'
                            : 'No address on file')}
                      </p>
                      <p>
                        🕒{' '}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Order Summary
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.type === 'pickup' ? 'Pickup' : 'Delivery'} ·{' '}
                            {order.items?.length || 0} items
                          </p>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">
                          ${order.totalAmount?.toFixed(2) ?? '0.00'}
                        </p>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm text-gray-700">
                        {order.items?.map((item) => (
                          <li
                            key={item._id}
                            className="flex justify-between text-gray-600"
                          >
                            <span>
                              {item.foodItem?.name || 'Item'} x {item.quantity}
                            </span>
                            <span>
                              ${(
                                (item.foodItem?.price || 0) * item.quantity
                              ).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-gray-100 p-3 flex flex-col gap-2">
                        <p className="text-xs font-semibold text-gray-500">
                          Update Status
                        </p>
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="rounded-2xl border border-gray-100 p-3 flex flex-col gap-2">
                        <p className="text-xs font-semibold text-gray-500">
                          Assign Worker
                        </p>
                        <select
                          value={order.assignedWorker?._id || ''}
                          onChange={(e) =>
                            handleAssignWorker(order._id, e.target.value)
                          }
                          className="rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-orange-500"
                        >
                          <option value="">Unassigned</option>
                          {workers.map((w) => (
                            <option key={w._id} value={w._id}>
                              {w.name} ({w.role})
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500">
                          Currently:{' '}
                          <span className="font-semibold text-gray-900">
                            {order.assignedWorker?.name || 'Unassigned'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
