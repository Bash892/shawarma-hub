import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminMenuPage = () => {
  const { token } = useAuth();
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/menu');
      setMenu(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price || '0'),
        category: form.category || undefined,
        imageUrl: form.imageUrl || undefined,
      };
      await apiFetch(
        '/api/menu',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        token
      );
      setForm({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
      });
      await loadMenu();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await apiFetch(`/api/menu/${id}`, { method: 'DELETE' }, token);
      await loadMenu();
    } catch (err) {
      console.error(err);
      setError('Failed to delete item.');
    }
  };

  const categories = useMemo(() => {
    const grouped = menu.reduce((acc, item) => {
      if (!item.category) return acc;
      const key = item.category.trim();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [menu]);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 w-full space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF9554] via-[#FF5A2D] to-[#FF2D20] text-white p-8 shadow-xl">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_55%)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70 mb-3">
                Culinary Ops
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Shawarma Hub Menu Lab
              </h1>
              <p className="mt-2 text-white/80 max-w-2xl">
                Launch new dishes, keep pricing aligned with food costs, and
                manage visuals from a single responsive workspace.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm min-w-[220px]">
              <p className="text-xs uppercase tracking-wide mb-1 text-white/70">
                Items live on menu
              </p>
              <p className="text-4xl font-semibold">
                {loading ? '...' : menu.length}
              </p>
              <p className="text-sm text-white/70">
                {categories.length > 0
                  ? `Top category: ${categories[0][0]}`
                  : 'Add categories to compare'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm xl:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Menu Item
                </h2>
                <p className="text-sm text-gray-500">
                  Complete the form below and deploy instantly to the app.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Auto-sync to frontend
              </span>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col text-xs font-semibold text-gray-700 gap-1">
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
                  placeholder="Falafel Supreme Wrap"
                />
              </label>

              <label className="flex flex-col text-xs font-semibold text-gray-700 gap-1">
                Category
                <input
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Shawarma, Salads, Drinks"
                />
              </label>

              <label className="flex flex-col text-xs font-semibold text-gray-700 gap-1">
                Price
                <input
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="12.99"
                />
              </label>

              <label className="flex flex-col text-xs font-semibold text-gray-700 gap-1">
                Image URL
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={onChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="/images/lamb-shawarma.jpg"
                />
              </label>

              <label className="md:col-span-2 flex flex-col text-xs font-semibold text-gray-700 gap-1">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-orange-500"
                  placeholder="Premium lamb, charred peppers, tahini drizzle..."
                />
              </label>

              {error && (
                <div className="md:col-span-2 text-sm text-red-600">{error}</div>
              )}

              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:opacity-90 transition disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Publish Dish'}
                </button>
                <p className="text-xs text-gray-500">
                  {saving ? 'Communicating with API...' : 'Instant publish on save'}
                </p>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Menu Health
              </h3>
              <p className="text-sm text-gray-500">
                Fast snapshot of categories and pricing tiers.
              </p>
            </div>
            <div className="space-y-3">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Add dishes with categories to populate insights.
                </p>
              ) : (
                categories.map(([label, count]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">
                        {((count / menu.length) * 100).toFixed(0)}% of menu
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-orange-500">
                      {count} items
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="rounded-2xl border border-dashed border-orange-200 p-4 text-sm text-orange-600 bg-orange-50/40">
              Tip: keep imagery to 1:1 ratio (640px+) for the cleanest cards on
              the customer app.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Current Menu Inventory
              </h2>
              <p className="text-sm text-gray-500">
                All live dishes pulled directly from your database.
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Last updated {new Date().toLocaleTimeString()}
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-gray-600">Loading menu...</p>
          ) : menu.length === 0 ? (
            <p className="text-sm text-gray-600">
              No items in the menu. Add your first dish above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {menu.map((item) => (
                <article
                  key={item._id}
                  className="rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="uppercase text-[11px] tracking-[0.2em] text-gray-400">
                        {item.category || 'Uncategorized'}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                    </div>
                    <span className="text-base font-semibold text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate max-w-[70%]">
                      {item.imageUrl || 'No image set'}
                    </span>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="text-red-600 font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenuPage;
