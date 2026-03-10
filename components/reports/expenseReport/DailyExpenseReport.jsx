'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function DailyExpenseReport({ daily = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-sky-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Daily Expense Report
        </CardTitle>
        <p className="text-[11px] text-slate-500">Expenses recorded each day. Helps monitor daily operational spending.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : daily.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No daily expense data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-sky-100/80 border-b border-sky-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Date</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Categories</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Amount</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {daily.slice(0, 30).map((row, i) => {
                const cats = [...new Set((row.items || []).map((x) => x.category))].join(', ') || '-'
                const pm = (row.items || [])[0]?.paymentMethod || '-'
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-sky-50/50">
                    <td className="py-2 px-3 font-medium text-slate-800">{row.date || '-'}</td>
                    <td className="py-2 px-3 text-slate-600 max-w-[200px] truncate">{cats}</td>
                    <td className="py-2 px-3 text-right font-semibold text-slate-800">₹{formatCurrency(row.total)}</td>
                    <td className="py-2 px-3 text-center text-slate-500">{pm}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
