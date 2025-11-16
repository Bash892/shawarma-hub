import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminWorkersPage = () => {
  const { token } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    role: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/workers', {}, token);
      setWorkers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load workers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, [token]);

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
        role: form.role,
        phone: form.phone,
      };
      await apiFetch(
        '/api/workers',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        token
      );
      setForm({ name: '', role: '', phone: '' });
      await loadWorkers();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add worker.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWorker = async (id) => {
    try {
      await apiFetch(`/api/workers/${id}`, { method: 'DELETE' }, token);
      setWorkers((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      console.error('Failed to delete worker', err);
      setError('Failed to remove worker.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Workers</h1>
        <p className="text-sm text-slate-400">
          View and add staff for Tasty Bites.
        </p>
      </div>

      {/* Add worker */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
        <h2 className="text-sm font-semibold mb-3">Add Worker</h2>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={onChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
              placeholder="e.g. Chef, Driver, Cashier"
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-red-500"
            />
          </div>
          {error && (
            <div className="md:col-span-3 text-xs text-red-400">
              {error}
            </div>
          )}
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Add Worker'}
            </button>
          </div>
        </form>
      </div>

      {/* Worker list */}
      <div>
        <h2 className="text-sm font-semibold mb-2">Current Workers</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading workers...</p>
        ) : workers.length === 0 ? (
          <p className="text-sm text-slate-400">No workers added yet.</p>
        ) : (
          <div className="space-y-2">
            {workers.map((w) => (
              <div
                key={w._id}
                className="flex items-center justify-between rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-2 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-100">{w.name}</p>
                  <p className="text-slate-400">{w.role}</p>
                  {w.phone && (
                    <p className="text-[11px] text-slate-500">{w.phone}</p>
                  )}
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="inline-flex items-center rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    {w.active === false ? 'Inactive' : 'Active'}
                  </span>
                  <button
                    onClick={() => handleDeleteWorker(w._id)}
                    className="text-[11px] text-red-400 hover:text-red-300"
                  >
                    Remove
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

export default AdminWorkersPage;
