'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function DailyRestaurantSales({ daily = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-sky-50 to-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Daily Restaurant Sales</CardTitle>
        <p className="text-[11px] text-slate-500">Revenue and orders by date</p>
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
                  <th className="text-right py-2 px-2 font-medium">Orders</th>
                  <th className="text-right py-2 px-2 font-medium">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((row) => (
                  <tr key={row.date} className="border-t border-slate-100 hover:bg-sky-50/50">
                    <td className="py-1.5 px-2">{row.date}</td>
                    <td className="text-right py-1.5 px-2">{row.totalOrders}</td>
                    <td className="text-right py-1.5 px-2 font-medium">{formatCurrency(row.totalSales)}</td>
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
