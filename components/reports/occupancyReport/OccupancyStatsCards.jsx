'use client'

export function OccupancyStatsCards({ summary }) {
  const {
    totalRooms = 0,
    roomsOccupiedToday = 0,
    roomsAvailableToday = 0,
    occupancyRateToday = 0,
    date = '',
  } = summary || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Today&apos;s Occupancy Rate</p>
        <div className="text-2xl font-semibold mt-1">{Number(occupancyRateToday).toFixed(1)}%</div>
        {date && <p className="text-[11px] opacity-80 mt-1">As of {date}</p>}
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-400 to-indigo-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Rooms Occupied</p>
        <div className="text-2xl font-semibold mt-1">{roomsOccupiedToday}</div>
        <p className="text-[11px] opacity-80 mt-1">Currently in use</p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 via-purple-400 to-fuchsia-600 text-white shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Rooms Available</p>
        <div className="text-2xl font-semibold mt-1">{roomsAvailableToday}</div>
        <p className="text-[11px] opacity-80 mt-1">Ready for booking</p>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-400 to-orange-500 text-slate-900 shadow-lg p-4">
        <p className="text-xs uppercase tracking-wide opacity-90">Total Rooms</p>
        <div className="text-2xl font-semibold mt-1">{totalRooms}</div>
        <p className="text-[11px] opacity-80 mt-1">Sellable (excl. maintenance)</p>
      </div>
    </div>
  )
}
