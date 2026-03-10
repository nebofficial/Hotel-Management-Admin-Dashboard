'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function RoomRevenueTable({ details = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Detailed Revenue Data</CardTitle>
        <p className="text-[11px] text-slate-500">Bill-level room revenue</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !details?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No detailed data for selected period.</p>
        ) : (
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-slate-100">
                <tr>
                  <th className="text-left py-2 px-2 font-medium">Bill #</th>
                  <th className="text-left py-2 px-2 font-medium">Room</th>
                  <th className="text-left py-2 px-2 font-medium">Type</th>
                  <th className="text-left py-2 px-2 font-medium">Guest</th>
                  <th className="text-left py-2 px-2 font-medium">Check-in</th>
                  <th className="text-left py-2 px-2 font-medium">Check-out</th>
                  <th className="text-right py-2 px-2 font-medium">Nights</th>
                  <th className="text-right py-2 px-2 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {details.slice(0, 100).map((row) => (
                  <tr key={row.billNumber} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-1.5 px-2">{row.billNumber}</td>
                    <td className="py-1.5 px-2">{row.roomNumber}</td>
                    <td className="py-1.5 px-2">{row.roomType}</td>
                    <td className="py-1.5 px-2 truncate max-w-[100px]">{row.guestName}</td>
                    <td className="py-1.5 px-2">{row.checkIn}</td>
                    <td className="py-1.5 px-2">{row.checkOut}</td>
                    <td className="text-right py-1.5 px-2">{row.nights}</td>
                    <td className="text-right py-1.5 px-2 font-medium">{formatCurrency(row.revenue)}</td>
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
