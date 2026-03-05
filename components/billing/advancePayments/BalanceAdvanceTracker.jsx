'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function BalanceAdvanceTracker({ summary = {} }) {
  const { totalCollected = 0, totalAdjusted = 0, totalRefunded = 0, balanceAvailable = 0 } = summary

  const status =
    balanceAvailable <= 0 && totalCollected > 0
      ? 'Fully Adjusted'
      : totalRefunded > 0 || totalAdjusted > 0
      ? 'Partially Used'
      : 'Open'

  const statusColor =
    status === 'Fully Adjusted'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'Partially Used'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-100 text-slate-700'

  return (
    <Card className="border border-yellow-200 bg-gradient-to-br from-yellow-50/80 to-amber-50/80">
      <CardHeader className="pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Balance Advance Tracking</h3>
          <p className="text-xs text-slate-600">Monitor how much advance is still available.</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${statusColor}`}>
          {status}
        </span>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Total Collected</span>
          <span>₹{totalCollected.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Adjusted</span>
          <span>₹{totalAdjusted.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Refunded</span>
          <span>₹{totalRefunded.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-amber-200 mt-1 pt-1 font-semibold">
          <span>Balance Available</span>
          <span>₹{balanceAvailable.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

