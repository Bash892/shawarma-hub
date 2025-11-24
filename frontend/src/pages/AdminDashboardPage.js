import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import DashboardOverview from '../components/DashboardOverview';

const AdminDashboardPage = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
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
        setRecentOrders(orders);
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-gray-400">
              Operations Command
            </p>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Control Dashboard
            </h1>
          </div>
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-full">
            Data synced {new Date().toLocaleTimeString()}
          </span>
        </div>

        <DashboardOverview
          stats={stats}
          loading={loading}
          recentOrders={recentOrders}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
