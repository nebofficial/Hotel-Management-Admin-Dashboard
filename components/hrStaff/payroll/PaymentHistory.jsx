'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PaymentHistory({ history = [] }) {
  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-gradient-to-br from-slate-50 to-slate-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Payment History</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!history?.length ? (
          <div className="py-4 text-center text-xs text-slate-500">No payment history</div>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto text-[11px]">
            {history.slice(0, 10).map((h) => (
              <div key={h.id} className="flex justify-between py-1 border-b border-slate-100">
                <span>{h.staffName}</span>
                <span>{Number(h.netSalary).toLocaleString()}</span>
                <span className="text-slate-500">{h.paidAt ? new Date(h.paidAt).toLocaleDateString() : '-'}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
