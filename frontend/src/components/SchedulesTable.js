import React from 'react';

const SchedulesTable = ({ schedules, loading, onDelete }) => {
  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (startIso, endIso) => {
    if (!startIso || !endIso) return '';
    const start = new Date(startIso);
    const end = new Date(endIso);
    const diffMs = end - start;
    if (diffMs <= 0 || Number.isNaN(diffMs)) return '';

    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    return `${minutes}m`;
  };

  if (loading) {
    return <p className="text-sm text-gray-600">Loading schedules...</p>;
  }

  if (!schedules || schedules.length === 0) {
    return <p className="text-sm text-gray-600">No schedules added yet.</p>;
  }

  const handleDeleteClick = (id) => {
    if (!onDelete) return;
    const ok = window.confirm('Are you sure you want to delete this schedule?');
    if (ok) onDelete(id);
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-gray-200 shadow-sm">
      <table className="min-w-full text-xs text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-2 font-semibold text-gray-900">Worker</th>
            <th className="px-3 py-2 font-semibold text-gray-900 hidden sm:table-cell">
              Role
            </th>
            <th className="px-3 py-2 font-semibold text-gray-900 hidden md:table-cell">
              Phone
            </th>
            <th className="px-3 py-2 font-semibold text-gray-900">Date</th>
            <th className="px-3 py-2 font-semibold text-gray-900">Start</th>
            <th className="px-3 py-2 font-semibold text-gray-900">End</th>
            <th className="px-3 py-2 font-semibold text-gray-900 hidden sm:table-cell">
              Duration
            </th>
            <th className="px-3 py-2 font-semibold text-gray-900 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {schedules.map((s) => (
            <tr key={s._id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-900">
                {s.worker?.name || 'Unknown worker'}
              </td>
              <td className="px-3 py-2 text-gray-700 hidden sm:table-cell">
                {s.worker?.role || '—'}
              </td>
              <td className="px-3 py-2 text-gray-600 hidden md:table-cell">
                {s.worker?.phone || '—'}
              </td>
              <td className="px-3 py-2 text-gray-900">
                {formatDate(s.start)}
              </td>
              <td className="px-3 py-2 text-gray-900">
                {formatTime(s.start)}
              </td>
              <td className="px-3 py-2 text-gray-900">
                {formatTime(s.end)}
              </td>
              <td className="px-3 py-2 text-gray-700 hidden sm:table-cell">
                {formatDuration(s.start, s.end) || '—'}
              </td>
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => handleDeleteClick(s._id)}
                  className="text-[11px] text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulesTable;
