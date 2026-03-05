'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function OutstandingCreditTable({ credits = [] }) {
  const getStatusColor = (status) => {
    if (status === 'EXPIRED') return 'bg-red-100 text-red-700'
    if (status === 'EXPIRING_SOON') return 'bg-amber-100 text-amber-700'
    return 'bg-emerald-100 text-emerald-700'
  }

  return (
    <Card className="border border-orange-200 bg-gradient-to-br from-orange-50/80 to-amber-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Outstanding Credits</h3>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="overflow-x-auto max-h-48 bg-white/80 rounded-md border border-slate-200/70">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-1.5 px-2">Credit Note</th>
                <th className="text-left py-1.5 px-2">Guest</th>
                <th className="text-right py-1.5 px-2">Total</th>
                <th className="text-right py-1.5 px-2">Used</th>
                <th className="text-right py-1.5 px-2">Remaining</th>
                <th className="text-left py-1.5 px-2">Expiry</th>
                <th className="text-center py-1.5 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {credits.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-3 text-center text-slate-500">
                    No outstanding credit notes.
                  </td>
                </tr>
              )}
              {credits.map((c) => {
                const remaining = Number(c.totalAmount || 0) - Number(c.usedAmount || 0)
                return (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-1.5 px-2 font-mono text-[11px] text-slate-900">
                      {c.creditNoteNumber}
                    </td>
                    <td className="py-1.5 px-2 text-slate-700">{c.guestName}</td>
                    <td className="py-1.5 px-2 text-right">₹{Number(c.totalAmount || 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">₹{Number(c.usedAmount || 0).toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-right">₹{remaining.toFixed(2)}</td>
                    <td className="py-1.5 px-2 text-slate-700">
                      {c.expiryDate || '-'}
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

