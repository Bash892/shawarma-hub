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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Manage Menu</h1>
        <p className="text-sm text-slate-400">
          Add or remove items from the Tasty Bites menu.
        </p>
      </div>

      {/* Add item form */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
        <h2 className="text-sm font-semibold mb-3">Add New Item</h2>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="block text-xs mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
              placeholder="e.g. Burgers, Salads, Drinks"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs mb-1">Price</label>
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
              placeholder="e.g. 9.99"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs mb-1">Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={onChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
              placeholder="/images/cheeseburger.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
          {error && (
            <div className="md:col-span-2 text-xs text-red-400">
              {error}
            </div>
          )}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing menu items */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Current Menu</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading menu...</p>
        ) : menu.length === 0 ? (
          <p className="text-sm text-slate-400">No items in the menu.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3 flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <span className="text-xs text-slate-300">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                {item.category && (
                  <p className="text-[11px] text-slate-400 mb-1">
                    {item.category}
                  </p>
                )}
                {item.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-3 mb-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-[11px] text-slate-500 max-w-[60%] truncate">
                    {item.imageUrl}
                  </span>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="text-[11px] text-red-400 hover:text-red-300"
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
  );
};

export default AdminMenuPage;
