'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentStatusSummary({ paymentStatus = {} }) {
  const { paidAmount = 0, pendingAmount = 0, overdueCount = 0, collectionPercent = 0 } = paymentStatus
  const fmt = (n) =>
    '\u20B9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Payment Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-blue-100 text-xs">Paid Amount</p>
            <p className="text-lg font-bold">{fmt(paidAmount)}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-blue-100 text-xs">Pending Amount</p>
            <p className="text-lg font-bold">{fmt(pendingAmount)}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-blue-100 text-xs">Overdue Count</p>
            <p className="text-lg font-bold">{overdueCount}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-blue-100 text-xs">Collection %</p>
            <p className="text-lg font-bold">{collectionPercent}%</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-blue-100">
            <span>Collection</span>
            <span>{collectionPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${Math.min(collectionPercent, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
