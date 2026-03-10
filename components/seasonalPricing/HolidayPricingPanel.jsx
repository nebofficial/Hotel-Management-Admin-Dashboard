'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function HolidayPricingPanel({ rules = [] }) {
  const holidayRules = rules.filter((r) => r.ruleType === 'holiday')

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-amber-300/10 via-yellow-200/5 to-orange-300/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-amber-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">Holiday Pricing</CardTitle>
        <p className="text-[11px] text-slate-600">
          Special seasonal rates for New Year, Christmas, festivals and national holidays.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {holidayRules.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No holiday pricing rules configured. Create rules for key holidays to maximise revenue.
          </p>
        ) : (
          <ul className="divide-y divide-amber-100/80 text-xs">
            {holidayRules.map((rule) => (
              <li key={rule.id} className="px-4 py-2.5 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{rule.name}</p>
                  <p className="text-[11px] text-slate-600">
                    {rule.startDate} → {rule.endDate}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {rule.adjustmentType === 'discount' ? 'Discount' : 'Increase'}{' '}
                    {Number(rule.adjustmentPercent || 0).toFixed(1)}%
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

