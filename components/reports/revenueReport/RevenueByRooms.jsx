'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0)

export function RevenueByRooms({ revenueByRooms = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-violet-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Revenue by Rooms</CardTitle>
        <p className="text-[11px] text-slate-500">Income from room bookings.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : revenueByRooms.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No room revenue data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-violet-100/80 border-b border-violet-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Room Type</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Bookings</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenueByRooms.map((r, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-violet-50/50">
                  <td className="py-2 px-3 font-medium">{r.roomType}</td>
                  <td className="py-2 px-3 text-right">{r.bookings ?? 0}</td>
                  <td className="py-2 px-3 text-right font-semibold text-violet-600">₹{formatCurrency(r.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
