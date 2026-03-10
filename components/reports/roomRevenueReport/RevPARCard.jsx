'use client'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function RevPARCard({ revpar, totalRooms }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-500 text-white shadow-lg p-4">
      <p className="text-xs uppercase tracking-wide opacity-90">RevPAR</p>
      <p className="text-[11px] opacity-80">Room Revenue / Total Rooms Available</p>
      <div className="text-2xl font-semibold mt-2">{formatCurrency(revpar)}</div>
      {totalRooms != null && (
        <p className="text-[11px] opacity-80 mt-1">Total rooms: {totalRooms}</p>
      )}
    </div>
  )
}
