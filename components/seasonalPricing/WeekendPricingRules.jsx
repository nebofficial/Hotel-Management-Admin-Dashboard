'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function WeekendPricingRules({ rules = [] }) {
  const weekendRules = rules.filter((r) => r.ruleType === 'weekend')

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-red-400/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-orange-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">Weekend Pricing Rules</CardTitle>
        <p className="text-[11px] text-slate-600">
          Friday, Saturday and Sunday adjustments to capture peak demand.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {weekendRules.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No weekend-specific pricing rules configured.
          </p>
        ) : (
          <ul className="divide-y divide-orange-100/80 text-xs">
            {weekendRules.map((rule) => (
              <li key={rule.id} className="px-4 py-2.5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{rule.name}</p>
                  <p className="text-[11px] text-slate-600">
                    {rule.startDate} → {rule.endDate}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {rule.adjustmentType === 'discount' ? 'Discount' : 'Increase'}{' '}
                    {Number(rule.adjustmentPercent || 0).toFixed(1)}% on{' '}
                    {(rule.weekendDays || []).join(', ') || 'weekend days'}
                  </p>
                </div>
                <p className="text-[10px] text-slate-500 text-right">
                  {(rule.roomTypes || []).join(', ') || 'All room types'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

