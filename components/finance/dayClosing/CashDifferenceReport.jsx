'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CashDifferenceReport({ cashDifference, reason, onChange, locked }) {
  const mismatch = cashDifference !== 0

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Cash Difference Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="bg-black/10 rounded-xl p-2">
          <p className="text-xs text-red-100">Short / Excess Amount</p>
          <p className="font-semibold text-lg">
            ${cashDifference.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <Label className="text-xs text-red-50">
            Reason (mandatory when there is mismatch)
          </Label>
          <Textarea
            disabled={locked || !mismatch}
            value={reason}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="Explain short / excess cash, responsible shift, etc."
            className="mt-1 min-h-[70px] bg-white/10 border-red-200 text-xs"
          />
        </div>
      </CardContent>
    </Card>
  )
}

