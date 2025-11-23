import React, { useEffect, useState } from 'react';
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

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1 text-gray-900">Manage Menu</h1>
            <p className="text-sm text-gray-600">
              Add or remove items from the Shawarma Hub menu.
            </p>
          </div>

      {/* Add item form */}
      <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
        <h2 className="text-sm font-semibold mb-3 text-gray-900">Add New Item</h2>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="block text-xs mb-1 text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs mb-1 text-gray-700">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
              placeholder="e.g. Burgers, Salads, Drinks"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs mb-1 text-gray-700">Price</label>
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
              placeholder="e.g. 9.99"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs mb-1 text-gray-700">Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={onChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
              placeholder="/images/cheeseburger.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          {error && (
            <div className="md:col-span-2 text-xs text-red-600">
              {error}
            </div>
          )}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing menu items */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Current Menu</h2>
        {loading ? (
          <p className="text-sm text-gray-600">Loading menu...</p>
        ) : menu.length === 0 ? (
          <p className="text-sm text-gray-600">No items in the menu.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl bg-white border border-gray-200 p-3 flex flex-col shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-xs text-gray-700 font-semibold">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                {item.category && (
                  <p className="text-[11px] text-gray-600 mb-1">
                    {item.category}
                  </p>
                )}
                {item.description && (
                  <p className="text-[11px] text-gray-500 line-clamp-3 mb-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-[11px] text-gray-500 max-w-[60%] truncate">
                    {item.imageUrl}
                  </span>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="text-[11px] text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminMenuPage;
