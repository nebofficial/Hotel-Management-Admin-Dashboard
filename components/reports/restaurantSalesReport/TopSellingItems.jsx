'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function TopSellingItems({ data = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-orange-50 to-rose-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Top Selling Items</CardTitle>
        <p className="text-[11px] text-slate-500">Best performing dishes</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !data?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No top items data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-orange-100">
                  <th className="text-left py-2 px-2 font-medium">Item</th>
                  <th className="text-right py-2 px-2 font-medium">Units Sold</th>
                  <th className="text-right py-2 px-2 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.itemName} className="border-t border-orange-50 hover:bg-orange-50/50">
                    <td className="py-1.5 px-2 font-medium">{row.itemName}</td>
                    <td className="text-right py-1.5 px-2">{row.unitsSold}</td>
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
