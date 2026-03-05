'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RefundHistoryTable({ refunds = [] }) {
  return (
    <Card className="border border-slate-200 bg-white">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Refund History</h3>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="overflow-x-auto max-h-48">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-1.5 px-2">Date</th>
                <th className="text-right py-1.5 px-2">Amount</th>
                <th className="text-left py-1.5 px-2">Method</th>
                <th className="text-left py-1.5 px-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {refunds.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-center text-slate-500">
                    No refunds recorded yet.
                  </td>
                </tr>
              )}
              {refunds.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-1.5 px-2">
                    {r.createdAt && new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-1.5 px-2 text-right">
                    ₹{Number(r.amount || 0).toFixed(2)}
                  </td>
                  <td className="py-1.5 px-2 text-slate-700">{r.method}</td>
                  <td className="py-1.5 px-2 text-slate-600">{r.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

