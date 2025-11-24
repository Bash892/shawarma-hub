import React, { useEffect, useMemo, useState } from 'react';
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

  const insights = useMemo(() => {
    const active = workers.filter((w) => w.active !== false).length;
    const upcoming = schedules.filter(
      (s) => new Date(s.start) > new Date()
    ).length;
    const roles = workers.reduce((acc, worker) => {
      if (!worker.role) return acc;
      acc.add(worker.role);
      return acc;
    }, new Set());
    return {
      totalWorkers: workers.length,
      activeWorkers: active,
      upcomingShifts: upcoming,
      distinctRoles: roles.size,
    };
  }, [workers, schedules]);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 w-full space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111826] via-[#233041] to-[#FF5A2D] text-white p-8 shadow-xl">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_55%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70 mb-3">
                Crew Operations
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Workforce Ops Control Center
              </h1>
              <p className="mt-2 text-white/80 max-w-3xl">
                Add staff, orchestrate kitchen and delivery shifts, and sync
                schedules across the entire Shawarma Hub organization.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 min-w-[220px] backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide mb-1 text-white/70">
                Active crew
              </p>
              <p className="text-4xl font-semibold">
                {insights.activeWorkers}
              </p>
              <p className="text-sm text-white/70">
                {insights.totalWorkers} total, {insights.distinctRoles} roles
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Workers',
              value: insights.totalWorkers,
              sub: 'Kitchen + delivery squad',
            },
            {
              label: 'Active Today',
              value: insights.activeWorkers,
              sub: 'Clocked in / available',
            },
            {
              label: 'Upcoming Shifts',
              value: insights.upcomingShifts,
              sub: 'Scheduled in the next 24h',
            },
            {
              label: 'Distinct Roles',
              value: insights.distinctRoles,
              sub: 'Ops, kitchen, delivery',
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                {metric.label}
              </p>
              <p className="text-3xl font-semibold text-gray-900 mt-3">
                {metric.value ?? 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">{metric.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm xl:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Crew Member
                </h2>
                <p className="text-sm text-gray-500">
                  Centralize onboarding for chefs, drivers, and coordinators.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Syncs to all dashboards
              </span>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
              {['name', 'role', 'phone'].map((field) => (
                <label
                  key={field}
                  className="flex flex-col text-xs font-semibold text-gray-700 gap-1"
                >
                  {field === 'name'
                    ? 'Name'
                    : field === 'role'
                    ? 'Role'
                    : 'Phone'}
                  <input
                    name={field}
                    value={form[field]}
                    onChange={onChange}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
                    placeholder={
                      field === 'role' ? 'Chef, Dispatcher, Driver' : undefined
                    }
                  />
                </label>
              ))}

              {error && (
                <div className="md:col-span-3 text-sm text-red-600">{error}</div>
              )}

              <div className="md:col-span-3 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingWorker}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:opacity-90 transition disabled:opacity-50"
                >
                  {savingWorker ? 'Saving...' : 'Add Worker'}
                </button>
                <p className="text-xs text-gray-500">
                  Worker appears immediately in assignments.
                </p>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Crew Roster
              </h3>
              <p className="text-sm text-gray-500">
                Monitor every role and status in real time.
              </p>
            </div>
            {loadingWorkers ? (
              <p className="text-sm text-gray-500">Loading workers...</p>
            ) : workers.length === 0 ? (
              <p className="text-sm text-gray-500">
                No workers added yet. Add teammates on the left.
              </p>
            ) : (
              <div className="space-y-3">
                {workers.map((w) => (
                  <div
                    key={w._id}
                    className="rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{w.name}</p>
                      <p className="text-xs text-gray-500">
                        {w.role || 'Role TBD'}
                      </p>
                      {w.phone && (
                        <p className="text-xs text-gray-500">{w.phone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${
                          w.active === false
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {w.active === false ? 'Inactive' : 'Active'}
                      </span>
                      <button
                        onClick={() => handleDeleteWorker(w._id)}
                        className="block text-xs text-red-500 mt-2 hover:text-red-600"
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Build Shift Schedule
                </h2>
                <p className="text-sm text-gray-500">
                  Plan kitchen + delivery coverage for the week.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Calendar sync ready
              </span>
            </div>

            <form
              onSubmit={onSubmitSchedule}
              className="grid gap-4 md:grid-cols-2"
            >
              <label className="flex flex-col text-xs font-semibold text-gray-700 gap-1">
                Worker
                <select
                  name="workerId"
                  value={scheduleForm.workerId}
                  onChange={onScheduleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select worker</option>
                  {workers.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.name} ({w.role})
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col text-xs font-semibold text-gray-700 gap-1">
                Date
                <input
                  type="date"
                  name="date"
                  value={scheduleForm.date}
                  onChange={onScheduleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-orange-500"
                />
              </label>

              <label className="flex flex-col text-xs font-semibold text-gray-700 gap-1">
                Start Time
                <input
                  type="time"
                  name="startTime"
                  value={scheduleForm.startTime}
                  onChange={onScheduleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-orange-500"
                />
              </label>

              <label className="flex flex-col text-xs font-semibold text-gray-700 gap-1">
                End Time
                <input
                  type="time"
                  name="endTime"
                  value={scheduleForm.endTime}
                  onChange={onScheduleChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:border-orange-500"
                />
              </label>

              {scheduleError && (
                <div className="md:col-span-2 text-sm text-red-600">
                  {scheduleError}
                </div>
              )}

              <div className="md:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingSchedule}
                  className="rounded-full bg-gradient-to-r from-[#1E90FF] to-[#6A5BFF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:opacity-90 transition disabled:opacity-50"
                >
                  {savingSchedule ? 'Scheduling...' : 'Create Schedule'}
                </button>
                <p className="text-xs text-gray-500">
                  {savingSchedule
                    ? 'Syncing shift plan...'
                    : 'Shifts notify assigned worker immediately.'}
                </p>
              </div>
            </form>
          </div>

          <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Schedules
                </h2>
                <p className="text-sm text-gray-500">
                  Every shift in one place — cancel or edit anytime.
                </p>
              </div>
            </div>

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
