'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MonthlyOccupancyReport({ monthly = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Monthly Occupancy</CardTitle>
        <p className="text-[11px] text-slate-500">Room nights sold per month</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !monthly?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No monthly data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-amber-100">
                  <th className="text-left py-2 px-2 font-medium">Month</th>
                  <th className="text-right py-2 px-2 font-medium">Room Nights Sold</th>
                  <th className="text-right py-2 px-2 font-medium">Occupancy %</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((row) => (
                  <tr key={row.month} className="border-t border-amber-50 hover:bg-amber-50/50">
                    <td className="py-1.5 px-2">{row.monthLabel}</td>
                    <td className="text-right py-1.5 px-2">{row.roomNightsSold}</td>
                    <td className="text-right py-1.5 px-2 font-medium">{row.occupancyPercentage}%</td>
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
