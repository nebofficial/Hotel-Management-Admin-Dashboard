'use client'

export function PromoTrackingPanel({ analytics }) {
  const totalPromoBookings = analytics?.totalPromoBookings ?? 0
  const totalDiscountGiven = analytics?.totalDiscountGiven ?? 0
  const byCode = analytics?.byCode || []
  const totalUsed = byCode.reduce((s, c) => s + (c.usedCount || 0), 0)

  return (
    <div className="rounded-2xl border-0 bg-gradient-to-br from-red-500/15 via-rose-500/10 to-orange-500/10 shadow-sm overflow-hidden border border-red-200/50">
      <div className="px-4 pt-4 pb-2 border-b border-red-200/60">
        <p className="text-sm font-semibold text-slate-800">Promo Code Tracking</p>
        <p className="text-[11px] text-slate-600">Real-time view of bookings and discounts from promos.</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/90 border border-red-100 px-4 py-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Bookings using promo</p>
            <p className="text-xl font-bold text-red-700">{totalPromoBookings}</p>
          </div>
          <div className="rounded-xl bg-white/90 border border-red-100 px-4 py-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Discount amount applied</p>
            <p className="text-xl font-bold text-red-700">₹ {Number(totalDiscountGiven).toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-xl bg-white/90 border border-red-100 px-4 py-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Revenue via promo</p>
            <p className="text-xl font-bold text-slate-600">—</p>
            <p className="text-[10px] text-slate-400">Not tracked separately</p>
          </div>
        </div>
        {byCode.length > 0 && (
          <div className="border border-red-100 rounded-xl overflow-hidden">
            <p className="text-[11px] font-medium text-slate-600 px-3 py-2 bg-red-50/80 border-b border-red-100">Redemptions by code</p>
            <ul className="divide-y divide-red-50 max-h-40 overflow-y-auto">
              {byCode.map((c) => (
                <li key={c.id} className="flex justify-between items-center px-3 py-2 text-xs">
                  <span className="font-medium text-slate-800">{c.code}</span>
                  <span className="text-slate-600">{c.usedCount || 0} uses</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
