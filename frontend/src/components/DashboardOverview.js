import React from 'react';
import { Link } from 'react-router-dom';

const formatCurrency = (value) =>
  typeof value === 'number' ? `$${value.toFixed(2)}` : '$0.00';

const DashboardOverview = ({ stats, loading, recentOrders = [] }) => {
  const sections = [
    {
      label: 'Total Orders',
      value: stats.ordersCount,
      accent: 'bg-orange-100 text-orange-600',
      chip: '+12% vs last week',
    },
    {
      label: "Today's Orders",
      value: stats.todayOrdersCount,
      accent: 'bg-green-100 text-green-600',
      chip: 'Live feed',
    },
    {
      label: 'Menu Items',
      value: stats.menuCount,
      accent: 'bg-blue-100 text-blue-600',
      chip: 'Updated menu',
    },
    {
      label: 'Active Workers',
      value: stats.workersCount,
      accent: 'bg-purple-100 text-purple-600',
      chip: 'Staff on duty',
    },
  ];

  const salesBreakdown = [
    {
      label: 'Daily Sales',
      value: stats.dailyRevenue,
      count: stats.dailyCount,
      trend: '+5%',
    },
    {
      label: 'Weekly Sales',
      value: stats.weeklyRevenue,
      count: stats.weeklyCount,
      trend: '+14%',
    },
    {
      label: 'Monthly Sales',
      value: stats.monthlyRevenue,
      count: stats.monthlyCount,
      trend: '+21%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF8A05] via-[#FF5000] to-[#FF2D20] text-white p-8 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_50%)]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="uppercase text-xs tracking-[0.25em] mb-3">HQ Overview</p>
            <h2 className="text-3xl lg:text-4xl font-semibold">
              Shawarma Hub Control Center
            </h2>
            <p className="mt-3 text-white/80 max-w-2xl">
              Monitor live orders, kitchen throughput, and revenue health in a
              single responsive command center. Everything refreshes with your
              real-time data pipeline.
            </p>
          </div>

          <div className="bg-white/15 rounded-2xl px-6 py-4 backdrop-blur-sm min-w-[220px]">
            <p className="text-xs uppercase tracking-wide mb-1 text-white/70">
              Live Revenue (monthly)
            </p>
            <p className="text-3xl font-semibold">
              {loading ? '...' : formatCurrency(stats.monthlyRevenue)}
            </p>
            <p className="text-sm text-white/70">
              {loading ? '' : `${stats.monthlyCount} orders processed`}
            </p>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {sections.map((section) => (
          <div
            key={section.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-6">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${section.accent}`}
              >
                {section.chip}
              </span>
            </div>
            <p className="text-4xl font-semibold text-gray-900 leading-tight">
              {loading ? '...' : section.value}
            </p>
            <p className="text-sm text-gray-500 mt-2">{section.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales */}
        <div className="col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Revenue Performance
              </h3>
              <p className="text-gray-500 text-sm">
                Pipeline view for daily, weekly, and monthly cadences.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Auto-synced every 30s
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salesBreakdown.map((bucket) => (
              <div
                key={bucket.label}
                className="rounded-2xl border border-gray-100 p-4 bg-gray-50"
              >
                <p className="text-sm text-gray-500 mb-1">{bucket.label}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : formatCurrency(bucket.value)}
                </p>
                <p className="text-xs text-gray-500">
                  {loading ? '' : `${bucket.count} orders`}
                </p>
                <p className="mt-3 text-xs font-semibold text-emerald-500">
                  {bucket.trend}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="w-full h-40 rounded-2xl bg-gradient-to-r from-gray-100 via-orange-100 to-gray-50 p-4 text-xs text-gray-500 flex items-end">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center text-gray-400">
                Analytics chart placeholder – connect to BI when ready
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500">
              Jump directly into operational workflows.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/admin/orders"
              className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 hover:border-orange-400 hover:bg-orange-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-900">Track Orders</p>
                <p className="text-xs text-gray-500">
                  View live kitchen queue + delivery routes
                </p>
              </div>
              <span className="text-orange-500 font-semibold text-sm">
                →
              </span>
            </Link>

            <Link
              to="/admin/menu"
              className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 hover:border-orange-400 hover:bg-orange-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-900">Curate Menu</p>
                <p className="text-xs text-gray-500">
                  Launch specials, adjust pricing, update inventory
                </p>
              </div>
              <span className="text-orange-500 font-semibold text-sm">
                →
              </span>
            </Link>

            <Link
              to="/admin/workers"
              className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 hover:border-orange-400 hover:bg-orange-50 transition"
            >
              <div>
                <p className="font-semibold text-gray-900">Manage Crew</p>
                <p className="text-xs text-gray-500">
                  Staff scheduling, onboarding, performance notes
                </p>
              </div>
              <span className="text-orange-500 font-semibold text-sm">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Live Order Feed
            </h3>
            <p className="text-sm text-gray-500">
              Recent customer activity synced from the order service.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            View full history →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-3">Order</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Total</th>
                <th className="py-3">Status</th>
                <th className="py-3">Placed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-6 text-center text-gray-400" colSpan={5}>
                    Loading live feed...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td className="py-6 text-center text-gray-400" colSpan={5}>
                    No orders yet. Once orders start coming in, the feed will
                    populate automatically.
                  </td>
                </tr>
              ) : (
                recentOrders.slice(0, 6).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-medium text-gray-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.customerName || 'Guest'}
                    </td>
                    <td className="py-3 text-gray-900 font-semibold">
                      {formatCurrency(order.total || 0)}
                    </td>
                    <td className="py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide">
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

