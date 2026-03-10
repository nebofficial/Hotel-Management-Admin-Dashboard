'use client'

const formatNumber = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function StaffPerformanceSummaryCards({ summary }) {
  const {
    totalStaffEvaluated = 0,
    topPerformerName = '-',
    averageAttendanceRate = 0,
    totalStaffSales = 0,
  } = summary || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Staff Evaluated</p>
        <div className="text-2xl font-semibold mt-1">{formatNumber(totalStaffEvaluated)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Top Performing Employee</p>
        <div className="text-lg font-semibold mt-1 truncate">{topPerformerName}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Average Attendance Rate</p>
        <div className="text-2xl font-semibold mt-1">{averageAttendanceRate.toFixed(1)}%</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-300 to-teal-500 text-slate-800 shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Sales by Staff</p>
        <div className="text-2xl font-semibold mt-1">₹{formatNumber(totalStaffSales)}</div>
      </div>
    </div>
  )
}

