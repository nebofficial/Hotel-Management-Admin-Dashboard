'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RoomTypeOccupancy({ roomTypeOccupancy = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-orange-50 to-rose-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Room Type Performance</CardTitle>
        <p className="text-[11px] text-slate-500">Occupancy by room category</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !roomTypeOccupancy?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No room type data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-orange-100">
                  <th className="text-left py-2 px-2 font-medium">Room Type</th>
                  <th className="text-right py-2 px-2 font-medium">Rooms</th>
                  <th className="text-right py-2 px-2 font-medium">Room Nights Sold</th>
                  <th className="text-right py-2 px-2 font-medium">Occupancy %</th>
                </tr>
              </thead>
              <tbody>
                {roomTypeOccupancy.map((row) => (
                  <tr key={row.roomType} className="border-t border-orange-50 hover:bg-orange-50/50">
                    <td className="py-1.5 px-2 font-medium">{row.roomType}</td>
                    <td className="text-right py-1.5 px-2">{row.totalRooms}</td>
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
