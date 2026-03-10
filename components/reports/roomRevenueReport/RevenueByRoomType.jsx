'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function RevenueByRoomType({ data = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-sky-50 to-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Revenue by Room Type</CardTitle>
        <p className="text-[11px] text-slate-500">Breakdown by room category</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !data?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No revenue data for selected period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-sky-100">
                  <th className="text-left py-2 px-2 font-medium">Room Type</th>
                  <th className="text-right py-2 px-2 font-medium">Revenue</th>
                  <th className="text-right py-2 px-2 font-medium">Room Nights</th>
                  <th className="text-right py-2 px-2 font-medium">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.roomType} className="border-t border-sky-50 hover:bg-sky-50/50">
                    <td className="py-1.5 px-2 font-medium">{row.roomType}</td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(row.revenue)}</td>
                    <td className="text-right py-1.5 px-2">{row.roomNights}</td>
                    <td className="text-right py-1.5 px-2">{row.bookings}</td>
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
