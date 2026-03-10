'use client'

export function OccupancyPercentageCard({ rate, label = 'Occupancy Rate' }) {
  const value = typeof rate === 'number' ? rate.toFixed(1) : rate || 0
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-600 text-white shadow-lg p-4 text-center">
      <p className="text-xs uppercase tracking-wide opacity-90">{label}</p>
      <div className="text-3xl font-bold mt-2">{value}%</div>
    </div>
  )
}
