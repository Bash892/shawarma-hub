import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRegisterPage = () => {
  const { registerAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    adminSecret: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerAdmin(form);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 w-full">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 mb-4">
            <span className="text-white font-bold text-2xl">SH</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Registration</h2>
          <p className="text-sm text-gray-600">Create a new admin account for Shawarma Hub</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Create a password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Secret</label>
            <input
              name="adminSecret"
              type="password"
              value={form.adminSecret}
              onChange={onChange}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter admin secret"
            />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating admin...' : 'Register Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
