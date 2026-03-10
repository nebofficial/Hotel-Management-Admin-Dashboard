'use client'

export function RevenueSummaryCard({ data }) {
  const {
    totalRevenue = 0,
    roomRevenue = 0,
    restaurantRevenue = 0,
    otherServicesRevenue = 0,
    currency = 'INR',
  } = data || {}

  const format = (value) =>
    typeof value === 'number' ? value.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : value || 0

  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 text-white shadow-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide opacity-80">Total Revenue</p>
        <span className="text-[10px] bg-emerald-900/30 px-2 py-0.5 rounded-full">{currency}</span>
      </div>
      <div className="text-2xl font-semibold">{format(totalRevenue)}</div>
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="bg-emerald-900/20 rounded-lg px-2 py-1.5">
          <p className="opacity-80">Room</p>
          <p className="font-semibold">{format(roomRevenue)}</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg px-2 py-1.5">
          <p className="opacity-80">Restaurant</p>
          <p className="font-semibold">{format(restaurantRevenue)}</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg px-2 py-1.5">
          <p className="opacity-80">Other</p>
          <p className="font-semibold">{format(otherServicesRevenue)}</p>
        </div>
      </div>
    </div>
  )
}

