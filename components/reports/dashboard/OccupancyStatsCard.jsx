'use client'

export function OccupancyStatsCard({ data }) {
  const {
    totalRooms = 0,
    roomsOccupiedToday = 0,
    roomsAvailableToday = 0,
    occupancyRateToday = 0,
  } = data || {}

  const rate = typeof occupancyRateToday === 'number' ? occupancyRateToday.toFixed(1) : occupancyRateToday || 0

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide opacity-80">Occupancy</p>
        <span className="text-sm font-semibold">{rate}%</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="bg-sky-900/20 rounded-lg px-2 py-1.5">
          <p className="opacity-80">Total Rooms</p>
          <p className="font-semibold">{totalRooms}</p>
        </div>
        <div className="bg-sky-900/20 rounded-lg px-2 py-1.5">
          <p className="opacity-80">Occupied</p>
          <p className="font-semibold">{roomsOccupiedToday}</p>
        </div>
        <div className="bg-sky-900/20 rounded-lg px-2 py-1.5">
          <p className="opacity-80">Available</p>
          <p className="font-semibold">{roomsAvailableToday}</p>
        </div>
      </div>
    </div>
  )
}

