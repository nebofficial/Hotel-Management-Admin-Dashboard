'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function CreditAmountPanel({ invoice, amount, onAmountChange, reason, onReasonChange }) {
  const remaining =
    invoice && invoice.totalAmount != null
      ? Number(invoice.totalAmount || 0) - Number(invoice.creditedAmount || 0)
      : 0

  return (
    <Card className="border border-purple-200 bg-gradient-to-br from-purple-50/80 to-violet-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Credit Amount & Reason</h3>
        <p className="text-xs text-slate-600">
          Enter credit value and reason. Max credit is remaining invoice amount.
        </p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-sm">
        <div>
          <p className="text-[11px] text-slate-700 mb-1">
            Credit Amount {remaining > 0 && `(max ₹${remaining.toFixed(2)})`}
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
            placeholder="Service issue, overcharge, etc."
            className="h-8 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  )
}

