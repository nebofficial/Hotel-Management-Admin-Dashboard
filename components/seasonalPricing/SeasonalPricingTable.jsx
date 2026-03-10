'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SeasonalPricingTable({ rules = [], onEdit, onDelete }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-sky-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">Seasonal Pricing Rules</CardTitle>
        <p className="text-[11px] text-slate-600">
          Central management of seasonal, holiday and weekend pricing rules.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {rules.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No seasonal rules defined yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-sky-100/80 border-b border-sky-200/60">
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Season Name</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Date Range</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Room Types</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Price Adjustment</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Pricing Type</th>
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Rule Type</th>
                  <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Status</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => {
                  const dateRange = `${rule.startDate || ''} → ${rule.endDate || ''}`
                  const roomTypes = (rule.roomTypes || []).join(', ') || 'All'
                  const adj = `${rule.adjustmentType === 'discount' ? '-' : '+'}${Number(
                    rule.adjustmentPercent || 0,
                  ).toFixed(1)}%`
                  const pricingType =
                    rule.adjustmentType === 'discount' ? 'Discount' : 'Increase'
                  const ruleTypeLabel =
                    rule.ruleType === 'holiday'
                      ? 'Holiday'
                      : rule.ruleType === 'weekend'
                      ? 'Weekend'
                      : rule.ruleType === 'dynamic'
                      ? 'Dynamic'
                      : 'Season'

                  return (
                    <tr
                      key={rule.id}
                      className="border-b border-sky-100/80 last:border-0 hover:bg-sky-50/60"
                    >
                      <td className="py-2 px-3 font-semibold text-slate-900">{rule.name}</td>
                      <td className="py-2 px-3 text-slate-700">{dateRange}</td>
                      <td className="py-2 px-3 text-slate-700">{roomTypes}</td>
                      <td className="py-2 px-3 text-right text-slate-800">{adj}</td>
                      <td className="py-2 px-3 text-slate-700">{pricingType}</td>
                      <td className="py-2 px-3 text-slate-700">{ruleTypeLabel}</td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[64px] h-6 rounded-full text-[10px] font-medium ${
                            rule.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            className="px-2 h-6 rounded-full border border-sky-500/70 text-sky-800 bg-white text-[10px] font-medium hover:bg-sky-50"
                            onClick={() => onEdit?.(rule)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="px-2 h-6 rounded-full border border-rose-300 text-rose-700 bg-white text-[10px] font-medium hover:bg-rose-50"
                            onClick={() => onDelete?.(rule)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

