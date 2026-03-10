'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function DepartmentExpenseReport({ departmentExpenses = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-amber-400/10 via-yellow-400/5 to-orange-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-amber-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Department-wise Expense Breakdown
        </CardTitle>
        <p className="text-[11px] text-slate-500">Expenses by department. Helps track department budgets.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : departmentExpenses.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No department data</p>
        ) : (
          <div className="space-y-2">
            {departmentExpenses.map((d, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-white/80 border border-amber-100"
              >
                <span className="text-sm font-medium text-slate-700">{d.department}</span>
                <span className="text-sm font-semibold text-amber-700">₹{formatCurrency(d.total)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
