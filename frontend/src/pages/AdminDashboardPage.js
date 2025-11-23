import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    ordersCount: 0,
    todayOrdersCount: 0,
    menuCount: 0,
    workersCount: 0,
    dailyRevenue: 0,
    dailyCount: 0,
    weeklyRevenue: 0,
    weeklyCount: 0,
    monthlyRevenue: 0,
    monthlyCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const [orders, menu, workers, sales] = await Promise.all([
          apiFetch('/api/orders', {}, token),
          apiFetch('/api/menu'),
          apiFetch('/api/workers', {}, token),
          apiFetch('/api/orders/stats', {}, token),
        ]);

        const today = new Date();
        const todayOrders = orders.filter((o) => {
          if (!o.createdAt) return false;
          const d = new Date(o.createdAt);
          return (
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          );
        });

        setStats({
          ordersCount: orders.length,
          todayOrdersCount: todayOrders.length,
          menuCount: menu.length,
          workersCount: workers.length,
          dailyRevenue: sales.daily.total,
          dailyCount: sales.daily.count,
          weeklyRevenue: sales.weekly.total,
          weeklyCount: sales.weekly.count,
          monthlyRevenue: sales.monthly.total,
          monthlyCount: sales.monthly.count,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen py-8 w-full">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Overview of Shawarma Hub activity.
          </p>
        </div>

        {/* Basic Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : stats.ordersCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Today's Orders</p>
            <p className="text-3xl font-bold text-orange-500">
              {loading ? '...' : stats.todayOrdersCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Menu Items</p>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : stats.menuCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Workers</p>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : stats.workersCount}
            </p>
          </div>
        </div>

        {/* Sales Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Daily Sales</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {loading ? '...' : `$${stats.dailyRevenue.toFixed(2)}`}
            </p>
            <p className="text-sm text-gray-500">
              {loading ? '' : `${stats.dailyCount} orders`}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Weekly Sales</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {loading ? '...' : `$${stats.weeklyRevenue.toFixed(2)}`}
            </p>
            <p className="text-sm text-gray-500">
              {loading ? '' : `${stats.weeklyCount} orders`}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Monthly Sales</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {loading ? '...' : `$${stats.monthlyRevenue.toFixed(2)}`}
            </p>
            <p className="text-sm text-gray-500">
              {loading ? '' : `${stats.monthlyCount} orders`}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/menu"
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-orange-500 hover:shadow-md transition"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Manage Menu</h2>
            <p className="text-sm text-gray-600">
              Add new dishes or remove existing items.
            </p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-orange-500 hover:shadow-md transition"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">View Orders</h2>
            <p className="text-sm text-gray-600">
              Monitor all customer orders and statuses.
            </p>
          </Link>

          <Link
            to="/admin/workers"
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-orange-500 hover:shadow-md transition"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-2">Workers</h2>
            <p className="text-sm text-gray-600">
              View and manage your restaurant staff list.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
