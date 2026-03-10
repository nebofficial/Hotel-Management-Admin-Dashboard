'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TransactionActivityLogs({ logs = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-rose-500/10 via-red-500/5 to-amber-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-rose-200/60">
        <CardTitle className="text-sm font-semibold text-slate-800">Transaction Activity Logs</CardTitle>
        <p className="text-[11px] text-slate-600">Financial activities - invoices, payments, refunds.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : !logs.length ? (
          <p className="text-xs text-slate-500 py-8 text-center">No transactions in range</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-rose-100/80 border-b border-rose-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Type</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Description</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Amount</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Date &amp; Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 100).map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-rose-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{log.type}</td>
                  <td className="py-2 px-3 text-slate-700">{log.description}</td>
                  <td className="py-2 px-3 text-right text-slate-800">
                    {typeof log.amount === 'number'
                      ? log.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : '-'}
                  </td>
                  <td className="py-2 px-3 text-slate-600">{log.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}

