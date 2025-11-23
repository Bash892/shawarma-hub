import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import SchedulesTable from '../components/SchedulesTable';

const AdminWorkersPage = () => {
  const { token } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [form, setForm] = useState({
    name: '',
    role: '',
    phone: '',
  });

  const [scheduleForm, setScheduleForm] = useState({
    workerId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [savingWorker, setSavingWorker] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);

  const [error, setError] = useState(null);
  const [scheduleError, setScheduleError] = useState(null);

  const loadWorkers = async () => {
    setLoadingWorkers(true);
    try {
      const data = await apiFetch('/api/workers', {}, token);
      setWorkers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load workers.');
    } finally {
      setLoadingWorkers(false);
    }
  };

  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const data = await apiFetch('/api/workers/schedules', {}, token);
      setSchedules(data);
    } catch (err) {
      console.error(err);
      setScheduleError('Failed to load schedules.');
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    loadWorkers();
    loadSchedules();
  }, [token]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onScheduleChange = (e) => {
    setScheduleForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSavingWorker(true);
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
      setSavingWorker(false);
    }
  };

  const handleDeleteWorker = async (id) => {
    try {
      await apiFetch(`/api/workers/${id}`, { method: 'DELETE' }, token);
      setWorkers((prev) => prev.filter((w) => w._id !== id));
      // also remove schedules for that worker from the UI
      setSchedules((prev) => prev.filter((s) => s.worker?._id !== id));
    } catch (err) {
      console.error('Failed to delete worker', err);
      setError('Failed to remove worker.');
    }
  };

  const onSubmitSchedule = async (e) => {
    e.preventDefault();
    setScheduleError(null);

    const { workerId, date, startTime, endTime } = scheduleForm;

    if (!workerId || !date || !startTime || !endTime) {
      setScheduleError('Please select worker, date, start time, and end time.');
      return;
    }

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    if (end <= start) {
      setScheduleError('End time must be after start time.');
      return;
    }

    setSavingSchedule(true);
    try {
      const body = {
        start: start.toISOString(),
        end: end.toISOString(),
      };

      const newSchedule = await apiFetch(
        `/api/workers/${workerId}/schedules`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
        token
      );

      setSchedules((prev) => [...prev, newSchedule]);
      setScheduleForm({
        workerId: '',
        date: '',
        startTime: '',
        endTime: '',
      });
    } catch (err) {
      console.error(err);
      setScheduleError(err.message || 'Failed to create schedule.');
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await apiFetch(
        `/api/workers/schedules/${scheduleId}`,
        { method: 'DELETE' },
        token
      );
      setSchedules((prev) => prev.filter((s) => s._id !== scheduleId));
    } catch (err) {
      console.error('Failed to delete schedule', err);
      setScheduleError('Failed to delete schedule.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1 text-gray-900">Workers</h1>
        <p className="text-sm text-gray-600">
          View and add staff for Shawarma Hub, and manage their schedules.
        </p>
      </div>

      {/* Add worker */}
      <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
        <h2 className="text-sm font-semibold mb-3 text-gray-900">Add Worker</h2>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs mb-1 text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-gray-700">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={onChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
              placeholder="e.g. Chef, Driver, Cashier"
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-gray-700">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>
          {error && (
            <div className="md:col-span-3 text-xs text-red-600">
              {error}
            </div>
          )}
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={savingWorker}
              className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition disabled:opacity-60"
            >
              {savingWorker ? 'Saving...' : 'Add Worker'}
            </button>
          </div>
        </form>
      </div>

      {/* Worker list */}
      <div>
        <h2 className="text-sm font-semibold mb-2 text-gray-900">Current Workers</h2>
        {loadingWorkers ? (
          <p className="text-sm text-gray-600">Loading workers...</p>
        ) : workers.length === 0 ? (
          <p className="text-sm text-gray-600">No workers added yet.</p>
        ) : (
          <div className="space-y-2">
            {workers.map((w) => (
              <div
                key={w._id}
                className="flex items-center justify-between rounded-xl bg-white border border-gray-200 px-3 py-2 text-xs shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900">{w.name}</p>
                  <p className="text-gray-600">{w.role}</p>
                  {w.phone && (
                    <p className="text-[11px] text-gray-500">{w.phone}</p>
                  )}
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700">
                    {w.active === false ? 'Inactive' : 'Active'}
                  </span>
                  <button
                    onClick={() => handleDeleteWorker(w._id)}
                    className="text-[11px] text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduler form */}
      <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
        <h2 className="text-sm font-semibold mb-3 text-gray-900">Create Worker Schedule</h2>
        <form
          onSubmit={onSubmitSchedule}
          className="grid gap-3 md:grid-cols-4"
        >
          <div>
            <label className="block text-xs mb-1 text-gray-700">Worker</label>
            <select
              name="workerId"
              value={scheduleForm.workerId}
              onChange={onScheduleChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-orange-500"
            >
              <option value="">Select worker</option>
              {workers.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name} ({w.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1 text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={scheduleForm.date}
              onChange={onScheduleChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-gray-700">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={scheduleForm.startTime}
              onChange={onScheduleChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-gray-700">End Time</label>
            <input
              type="time"
              name="endTime"
              value={scheduleForm.endTime}
              onChange={onScheduleChange}
              className="w-full rounded-lg bg-white border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-orange-500"
            />
          </div>
          {scheduleError && (
            <div className="md:col-span-4 text-xs text-red-600">
              {scheduleError}
            </div>
          )}
          <div className="md:col-span-4">
            <button
              type="submit"
              disabled={savingSchedule}
              className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition disabled:opacity-60"
            >
              {savingSchedule ? 'Saving...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>

      {/* Schedules table */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold mb-2 text-gray-900">All Schedules</h2>
        <SchedulesTable
          schedules={schedules}
          loading={loadingSchedules}
          onDelete={handleDeleteSchedule}
        />
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWorkersPage;
