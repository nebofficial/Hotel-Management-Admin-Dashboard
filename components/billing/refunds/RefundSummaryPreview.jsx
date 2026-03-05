'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RefundSummaryPreview({ bill, refundAmount }) {
  if (!bill) {
    return (
      <Card className="border border-slate-200 bg-white/90">
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold text-slate-900">Refund Summary</h3>
        </CardHeader>
        <CardContent className="p-4 text-sm text-slate-500">Select a bill to see refund summary.</CardContent>
      </Card>
    )
  }

  const paid = Number(bill.paidAmount || 0)
  const refunded = Number(bill.refundedAmount || 0)
  const pending = paid - refunded
  const refund = Number(refundAmount || 0) || 0
  const remaining = pending - refund

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Refund Summary</h3>
        <p className="text-xs text-slate-600">
          Bill #{bill.billNumber} • {bill.guestName}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Paid Amount</span>
          <span>₹{paid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Already Refunded</span>
          <span>₹{refunded.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Refundable Balance</span>
          <span>₹{pending.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 mt-1 pt-1">
          <span>Requested Refund</span>
          <span className="font-semibold text-rose-700">₹{refund.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Balance After Refund</span>
          <span>₹{remaining.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

