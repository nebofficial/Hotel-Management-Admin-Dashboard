'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CreditUsagePanel({ creditNote, onApply }) {
  if (!creditNote) {
    return (
      <Card className="border border-yellow-200 bg-gradient-to-br from-yellow-50/80 to-amber-50/80">
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold text-slate-900">Credit Usage</h3>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-sm text-slate-500">
          Generate a credit note to apply it to future bills.
        </CardContent>
      </Card>
    )
  }

  const remaining =
    Number(creditNote.totalAmount || 0) - Number(creditNote.usedAmount || 0)

  const handleApply = () => {
    onApply?.(remaining)
  }

  return (
    <Card className="border border-yellow-200 bg-gradient-to-br from-yellow-50/80 to-amber-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Credit Usage</h3>
        <p className="text-xs text-slate-600">
          Remaining credit ₹{remaining.toFixed(2)} can be applied during checkout.
        </p>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-sm">
        <button
          type="button"
          onClick={handleApply}
          className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-medium py-1.5"
        >
          Apply Credit to Next Checkout
        </button>
      </CardContent>
    </Card>
  )
}

