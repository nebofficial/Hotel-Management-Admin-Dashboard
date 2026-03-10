'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function CommissionPerformanceReport({ data = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-orange-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-orange-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Commission Performance</CardTitle>
        <p className="text-[11px] text-slate-500">Incentives earned by staff.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : !data.length ? (
          <p className="text-xs text-slate-500 py-8 text-center">No commission data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-orange-100/80 border-b border-orange-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Staff Name</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Department</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Commission Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 50).map((row, i) => (
                <tr key={row.staffId || row.staffName || i} className="border-b border-slate-100 hover:bg-orange-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{row.staffName}</td>
                  <td className="py-2 px-3 text-slate-600">{row.department || '-'}</td>
                  <td className="py-2 px-3 text-right font-semibold text-orange-700">
                    ₹{formatCurrency(row.commissionAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}

