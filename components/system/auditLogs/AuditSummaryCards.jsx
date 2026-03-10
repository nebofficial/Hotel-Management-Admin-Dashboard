'use client'

const formatNumber = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function AuditSummaryCards({ summary }) {
  const {
    totalActivities = 0,
    userLoginsToday = 0,
    dataChangesToday = 0,
    securityAlerts = 0,
  } = summary || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total System Activities</p>
        <div className="text-2xl font-semibold mt-1">{formatNumber(totalActivities)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">User Logins Today</p>
        <div className="text-2xl font-semibold mt-1">{formatNumber(userLoginsToday)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-400 text-slate-900 shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Data Changes Today</p>
        <div className="text-2xl font-semibold mt-1">{formatNumber(dataChangesToday)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-rose-500 via-red-400 to-amber-500 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Security Alerts</p>
        <div className="text-2xl font-semibold mt-1">{formatNumber(securityAlerts)}</div>
      </div>
    </div>
  )
}

