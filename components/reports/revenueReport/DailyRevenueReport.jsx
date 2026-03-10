'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0)

export function DailyRevenueReport({ daily = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-red-600/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-red-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Daily Revenue Report</CardTitle>
        <p className="text-[11px] text-slate-500">Daily financial tracking.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : daily.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No daily data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-red-100/80 border-b border-red-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Date</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Rooms</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Restaurant</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {daily.slice(0, 30).map((r, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-red-50/50">
                  <td className="py-2 px-3 font-medium">{r.date}</td>
                  <td className="py-2 px-3 text-right">₹{formatCurrency(r.Rooms)}</td>
                  <td className="py-2 px-3 text-right">₹{formatCurrency(r.Restaurant || r.Bar)}</td>
                  <td className="py-2 px-3 text-right font-semibold text-red-600">₹{formatCurrency(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
