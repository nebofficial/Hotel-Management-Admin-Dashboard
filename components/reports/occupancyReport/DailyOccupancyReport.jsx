'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DailyOccupancyReport({ daily = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-sky-50 to-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Daily Occupancy</CardTitle>
        <p className="text-[11px] text-slate-500">Room occupancy by date</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !daily?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No daily data for selected period.</p>
        ) : (
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-sky-100/80">
                <tr>
                  <th className="text-left py-2 px-2 font-medium">Date</th>
                  <th className="text-right py-2 px-2 font-medium">Available</th>
                  <th className="text-right py-2 px-2 font-medium">Occupied</th>
                  <th className="text-right py-2 px-2 font-medium">Total</th>
                  <th className="text-right py-2 px-2 font-medium">Occupancy %</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((row) => (
                  <tr key={row.date} className="border-t border-slate-100 hover:bg-sky-50/50">
                    <td className="py-1.5 px-2">{row.date}</td>
                    <td className="text-right py-1.5 px-2">{row.roomsAvailable}</td>
                    <td className="text-right py-1.5 px-2">{row.roomsOccupied}</td>
                    <td className="text-right py-1.5 px-2">{row.totalRooms}</td>
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
