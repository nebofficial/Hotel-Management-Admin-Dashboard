'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function AdvanceHistoryTable({ advances = [], onSelectReceipt }) {
  return (
    <Card className="border border-slate-200 bg-white">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Advance History</h3>
        <p className="text-xs text-slate-600">
          View all advance receipts for this guest / booking.
        </p>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="overflow-x-auto max-h-56">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-1.5 px-2">Receipt</th>
                <th className="text-left py-1.5 px-2">Date</th>
                <th className="text-right py-1.5 px-2">Amount</th>
                <th className="text-right py-1.5 px-2">Adjusted</th>
                <th className="text-right py-1.5 px-2">Refunded</th>
                <th className="text-center py-1.5 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {advances.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-slate-500">
                    No advance receipts yet.
                  </td>
                </tr>
              )}
              {advances.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => onSelectReceipt?.(a)}
                >
                  <td className="py-1.5 px-2 font-mono text-[11px] text-slate-900">{a.receiptNumber}</td>
                  <td className="py-1.5 px-2 text-slate-700">
                    {a.createdAt && new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td className="py-1.5 px-2 text-right text-slate-900">
                    ₹{Number(a.amount || 0).toFixed(2)}
                  </td>
                  <td className="py-1.5 px-2 text-right text-slate-700">
                    ₹{Number(a.adjustedAmount || 0).toFixed(2)}
                  </td>
                  <td className="py-1.5 px-2 text-right text-slate-700">
                    ₹{Number(a.refundedAmount || 0).toFixed(2)}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

