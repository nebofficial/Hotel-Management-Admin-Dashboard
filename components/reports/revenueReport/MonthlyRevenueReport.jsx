'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0)

export function MonthlyRevenueReport({ monthly = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-800">Monthly Revenue</CardTitle>
        <p className="text-[11px] text-slate-500">Monthly statistics.</p>
      </CardHeader>
      <CardContent className="p-4 max-h-56 overflow-y-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : monthly.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No monthly data</p>
        ) : (
          <div className="space-y-2">
            {monthly.map((m, i) => (
              <div key={i} className="flex justify-between py-2 px-2 rounded-lg bg-slate-50">
                <span className="text-xs text-slate-700">{m.monthLabel || m.month}</span>
                <span className="text-xs font-semibold">₹{formatCurrency(m.total)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
