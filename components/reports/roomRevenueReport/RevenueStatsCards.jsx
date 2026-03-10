'use client'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function RevenueStatsCards({ summary }) {
  const { totalRoomRevenue = 0, adr = 0, revpar = 0, totalBookings = 0 } = summary || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Room Revenue</p>
        <div className="text-2xl font-semibold mt-1">{formatCurrency(totalRoomRevenue)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">ADR</p>
        <p className="text-[11px] opacity-80">Avg Daily Rate</p>
        <div className="text-2xl font-semibold mt-1">{formatCurrency(adr)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 via-purple-400 to-fuchsia-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">RevPAR</p>
        <p className="text-[11px] opacity-80">Rev Per Available Room</p>
        <div className="text-2xl font-semibold mt-1">{formatCurrency(revpar)}</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-500 text-slate-900 shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Bookings</p>
        <div className="text-2xl font-semibold mt-1">{totalBookings}</div>
      </div>
    </div>
  )
}
