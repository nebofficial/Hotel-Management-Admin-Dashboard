'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0);

export function PaymentMethodAnalysis({ data = [], loading }) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-red-50 to-rose-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-800">Payment Method Analysis</CardTitle>
        <p className="text-[11px] text-slate-500">Cash / Card / Online distribution</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-xs text-slate-500 py-4 text-center">Loading...</p>
        ) : !data?.length ? (
          <p className="text-xs text-slate-500 py-4 text-center">No payment data for selected period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-red-100">
                  <th className="text-left py-2 px-2 font-medium">Method</th>
                  <th className="text-right py-2 px-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.method} className="border-t border-red-50 hover:bg-red-50/50">
                    <td className="py-1.5 px-2 font-medium">{row.method}</td>
                    <td className="text-right py-1.5 px-2">{formatCurrency(row.amount)}</td>
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
