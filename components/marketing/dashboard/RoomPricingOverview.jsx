'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number'
    ? v.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    : '₹ 0'

export function RoomPricingOverview({ items = [] }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-sky-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">Room Pricing Overview</CardTitle>
        <p className="text-[11px] text-slate-600">Current vs booked pricing by room category.</p>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No pricing data in this range.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-sky-100/80 border-b border-sky-200/60">
                  <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Room Category</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Current Price</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Avg. Booked Rate</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Price Change</th>
                  <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.roomType} className="border-b border-slate-100 hover:bg-sky-50/60">
                    <td className="py-2 px-3 font-medium text-slate-800">{row.roomType}</td>
                    <td className="py-2 px-3 text-right text-slate-700">{formatCurrency(row.currentPrice)}</td>
                    <td className="py-2 px-3 text-right text-slate-700">
                      {formatCurrency(row.averageBookedRate)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span
                        className={`inline-flex items-center justify-end min-w-[72px] ${
                          (row.priceChange || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {Math.abs(row.priceChange || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right text-slate-700">{row.bookings || 0}</td>
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

