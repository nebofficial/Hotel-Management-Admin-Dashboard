'use client'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function ADRCard({ adr, roomNightsSold }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 text-slate-900 shadow-lg p-4">
      <p className="text-xs uppercase tracking-wide opacity-80">ADR</p>
      <p className="text-[11px] opacity-80">Room Revenue / Rooms Sold</p>
      <div className="text-2xl font-semibold mt-2">{formatCurrency(adr)}</div>
      {roomNightsSold != null && (
        <p className="text-[11px] opacity-80 mt-1">Based on {roomNightsSold} room nights</p>
      )}
    </div>
  )
}
