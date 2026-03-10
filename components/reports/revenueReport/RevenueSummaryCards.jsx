'use client'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function RevenueSummaryCards({ summary }) {
  const { totalRevenueToday = 0, totalRevenueThisMonth = 0, totalRevenueThisYear = 0, averageDailyRevenue = 0 } = summary || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Revenue Today</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(totalRevenueToday)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Revenue This Month</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(totalRevenueThisMonth)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Revenue This Year</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(totalRevenueThisYear)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-300 to-teal-500 text-slate-800 shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Average Daily Revenue</p>
        <div className="text-2xl font-semibold mt-1">₹{formatCurrency(averageDailyRevenue)}</div>
      </div>
    </div>
  )
}
