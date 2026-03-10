'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function WeeklyOccupancyReport({ weekly = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-purple-50 to-fuchsia-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Weekly Occupancy</CardTitle>
        <p className="text-[11px] text-slate-500">Average occupancy per week</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !weekly?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No weekly data for selected period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-100">
                  <th className="text-left py-2 px-2 font-medium">Week Start</th>
                  <th className="text-left py-2 px-2 font-medium">Week End</th>
                  <th className="text-right py-2 px-2 font-medium">Room Nights</th>
                  <th className="text-right py-2 px-2 font-medium">Avg Occupancy %</th>
                </tr>
              </thead>
              <tbody>
                {weekly.map((row) => (
                  <tr key={row.weekStart} className="border-t border-purple-50 hover:bg-purple-50/50">
                    <td className="py-1.5 px-2">{row.weekStart}</td>
                    <td className="py-1.5 px-2">{row.weekEnd}</td>
                    <td className="text-right py-1.5 px-2">{row.roomNightsSold}</td>
                    <td className="text-right py-1.5 px-2 font-medium">{row.averageOccupancyRate}%</td>
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
