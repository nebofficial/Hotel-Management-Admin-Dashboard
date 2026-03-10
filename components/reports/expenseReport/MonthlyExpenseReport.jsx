'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function MonthlyExpenseReport({ monthly = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-violet-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          Monthly Expense Analytics
        </CardTitle>
        <p className="text-[11px] text-slate-500">Monthly expense breakdown. Identifies spending patterns.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : monthly.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No monthly data</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {monthly.map((m, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-white/80 border border-violet-100"
              >
                <span className="text-sm font-medium text-slate-700">{m.monthLabel || m.month}</span>
                <span className="text-sm font-semibold text-purple-600">₹{formatCurrency(m.total)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
