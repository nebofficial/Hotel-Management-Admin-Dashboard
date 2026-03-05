'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreditNoteSummary({ refundCreditNote = {} }) {
  const { creditNotesIssued = 0, totalRefundAmount = 0 } = refundCreditNote
  const fmt = (n) =>
    '\u20B9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className="border border-amber-200 shadow-sm rounded-xl bg-amber-50/50">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm">Credit Note Details</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Credit Notes Issued</span>
          <span className="font-semibold">{creditNotesIssued}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Adjustments</span>
          <span className="font-semibold">{fmt(totalRefundAmount)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
