'use client'

import { PromoCodeStatusToggle } from './PromoCodeStatusToggle'

export function PromoCodesTable({ promos = [], onEdit, onToggleStatus }) {
  return (
    <div className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-sky-200/60">
        <p className="text-sm font-semibold text-slate-800">Promo Codes Management</p>
        <p className="text-[11px] text-slate-600">
          Central place to manage discounts, validity and room type restrictions.
        </p>
      </div>
      <div className="overflow-x-auto">
        {promos.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No promo codes defined yet.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-sky-100/80 border-b border-sky-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Promo Code</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Discount Type</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Discount Value</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Validity Period</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Usage Limit</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Room Types</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Status</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((p) => {
                const discountLabel = p.discountType === 'fixed'
                  ? `₹ ${Number(p.discountValue || 0).toLocaleString('en-IN')}`
                  : `${Number(p.discountValue || 0).toFixed(0)}%`
                const validity = [p.startDate, p.endDate].filter(Boolean).join(' → ') || 'No limit'
                const limit = p.maxUses != null ? p.maxUses : 'Unlimited'
                const roomLabel = (p.roomTypes || []).length ? (p.roomTypes || []).join(', ') : 'All rooms'

                return (
                  <tr key={p.id} className="border-b border-sky-100/80 hover:bg-sky-50/60">
                    <td className="py-2 px-3 font-semibold text-slate-900">{p.code}</td>
                    <td className="py-2 px-3 text-slate-700">{p.discountType === 'fixed' ? 'Fixed' : 'Percentage'}</td>
                    <td className="py-2 px-3 text-right text-slate-800">{discountLabel}</td>
                    <td className="py-2 px-3 text-slate-700">{validity}</td>
                    <td className="py-2 px-3 text-right text-slate-700">{limit}</td>
                    <td className="py-2 px-3 text-slate-700">{roomLabel}</td>
                    <td className="py-2 px-3 text-center">
                      <PromoCodeStatusToggle isActive={p.isActive} onToggle={() => onToggleStatus?.(p)} />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        className="px-2 h-6 rounded-full border border-sky-500/70 text-sky-800 bg-white text-[10px] font-medium hover:bg-sky-50"
                        onClick={() => onEdit?.(p)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
