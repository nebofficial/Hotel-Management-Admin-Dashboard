'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function RefundSummary({ refundCreditNote = {}, kpis = {} }) {
  const {
    totalRefundAmount = 0,
    refundCount = 0,
    creditNotesIssued = 0,
    netAdjustedRevenue = 0,
  } = refundCreditNote

  const totalBilled = Number(kpis.totalBilledAmount || 0)
  const refundPercent = totalBilled > 0 ? ((totalRefundAmount / totalBilled) * 100).toFixed(1) : 0
  const isHighRefund = refundPercent > 10

  const fmt = (n) =>
    '\u20B9' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-red-900 flex items-center gap-2">
          {isHighRefund && <AlertTriangle className="h-4 w-4 text-red-600" />}
          Refund & Credit Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-xl px-3 py-2">
            <p className="text-red-700 text-xs">Total Refund Amount</p>
            <p className="text-lg font-bold text-red-900">{fmt(totalRefundAmount)}</p>
          </div>
          <div className="bg-white/60 rounded-xl px-3 py-2">
            <p className="text-red-700 text-xs">Refund Count</p>
            <p className="text-lg font-bold text-red-900">{refundCount}</p>
          </div>
          <div className="bg-white/60 rounded-xl px-3 py-2">
            <p className="text-red-700 text-xs">Credit Notes Issued</p>
            <p className="text-lg font-bold text-red-900">{creditNotesIssued}</p>
          </div>
          <div className="bg-white/60 rounded-xl px-3 py-2">
            <p className="text-red-700 text-xs">Net Adjusted Revenue</p>
            <p className="text-lg font-bold text-emerald-700">{fmt(netAdjustedRevenue)}</p>
          </div>
        </div>
        {isHighRefund && (
          <p className="text-xs text-red-700 bg-red-50 rounded-lg px-2 py-1.5">
            High refund rate ({refundPercent}%). Review refund policy.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
