'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function RevenueByDateRange({ data = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-purple-50 to-fuchsia-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Revenue by Date</CardTitle>
        <p className="text-[11px] text-slate-500">Daily revenue within selected dates</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !data?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No revenue data for selected period.</p>
        ) : (
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-purple-100/80">
                <tr>
                  <th className="text-left py-2 px-2 font-medium">Date</th>
                  <th className="text-right py-2 px-2 font-medium">Rooms Sold</th>
                  <th className="text-right py-2 px-2 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.date} className="border-t border-purple-50 hover:bg-purple-50/50">
                    <td className="py-1.5 px-2">{row.date}</td>
                    <td className="text-right py-1.5 px-2">{row.roomsSold}</td>
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
