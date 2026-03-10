'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0)

export function RevenueTable({ daily = [], loading }) {
  const list = daily || []
  if (list.length === 0 && !loading) return null

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-800">Detailed Revenue Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Date</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Rooms</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Restaurant</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 50).map((row, i) => (
                <tr key={row.id || i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3">{row.date}</td>
                  <td className="py-2 px-3 text-right">₹{formatCurrency(row.Rooms)}</td>
                  <td className="py-2 px-3 text-right">₹{formatCurrency(row.Restaurant || row.Bar)}</td>
                  <td className="py-2 px-3 text-right font-semibold">₹{formatCurrency(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
