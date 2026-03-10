'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RatePlanPerformance({ ratePlans = [] }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-amber-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-rose-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">Rate Plan Performance</CardTitle>
        <p className="text-[11px] text-slate-600">Compare performance of different rate plans.</p>
      </CardHeader>
      <CardContent className="p-0">
        {ratePlans.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No rate plan data in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-rose-100/80 border-b border-rose-200/60">
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Rate Plan</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Bookings</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {ratePlans.map((rp) => (
                  <tr key={rp.key || rp.ratePlan} className="border-b border-slate-100 hover:bg-rose-50/60">
                    <td className="py-2 px-3 font-medium text-slate-800">{rp.key || rp.ratePlan}</td>
                    <td className="py-2 px-3 text-right text-slate-700">
                      {rp.bookings?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-700">
                      ₹{' '}
                      {rp.revenue?.toLocaleString('en-IN', {
                        maximumFractionDigits: 0,
                      }) || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

