'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function RefundDetailsForm({ amount, onAmountChange, reason, onReasonChange, maxAmount }) {
  return (
    <Card className="border border-yellow-200 bg-gradient-to-br from-yellow-50/80 to-amber-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Refund Details</h3>
        <p className="text-xs text-slate-600">Capture refund amount and mandatory reason.</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-sm">
        <div>
          <p className="text-[11px] text-slate-700 mb-1">
            Refund Amount {maxAmount != null && `(max ₹${Number(maxAmount || 0).toFixed(2)})`}
          </p>
          <Input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <p className="text-[11px] text-slate-700 mb-1">Reason</p>
          <Input
            value={reason}
            onChange={(e) => onReasonChange?.(e.target.value)}
            placeholder="e.g. Guest dissatisfaction, billing error"
            className="h-8 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  )
}

