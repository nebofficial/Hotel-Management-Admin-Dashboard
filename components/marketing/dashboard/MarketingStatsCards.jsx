'use client'

const formatNumber = (v, digits = 0) =>
  typeof v === 'number'
    ? v.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: digits })
    : '0'

export function MarketingStatsCards({ summary }) {
  const {
    totalBookings = 0,
    totalRevenue = 0,
    averageRoomRate = 0,
    otaBookingPercentage = 0,
  } = summary || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-500 text-white shadow-lg p-4">
        <p className="text-[11px] uppercase tracking-wide opacity-90">Total Bookings</p>
        <p className="text-2xl font-semibold mt-1">{formatNumber(totalBookings)}</p>
        <p className="text-[10px] mt-1 opacity-90">Bookings in selected period</p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-300 to-teal-400 text-slate-900 shadow-lg p-4">
        <p className="text-[11px] uppercase tracking-wide opacity-90">Total Campaign Revenue</p>
        <p className="text-2xl font-semibold mt-1">₹ {formatNumber(totalRevenue, 0)}</p>
        <p className="text-[10px] mt-1 opacity-90">Includes all confirmed bookings</p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-400 to-sky-400 text-white shadow-lg p-4">
        <p className="text-[11px] uppercase tracking-wide opacity-90">Average Room Rate</p>
        <p className="text-2xl font-semibold mt-1">₹ {formatNumber(averageRoomRate, 0)}</p>
        <p className="text-[10px] mt-1 opacity-90">Approx. per-booking room revenue</p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-500 text-white shadow-lg p-4">
        <p className="text-[11px] uppercase tracking-wide opacity-90">OTA Booking %</p>
        <p className="text-2xl font-semibold mt-1">{formatNumber(otaBookingPercentage, 1)}%</p>
        <p className="text-[10px] mt-1 opacity-90">Share of OTA vs direct bookings</p>
      </div>
    </div>
  )
}

