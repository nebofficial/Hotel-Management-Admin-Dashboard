'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function RefundAdjustment({ refundAmount = 0, refundReason = '', onChange, readonly }) {
  const emit = (patch) => {
    onChange?.({
      refundAmount,
      refundReason,
      ...patch,
    })
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-gradient-to-br from-rose-100 to-red-100 text-red-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Refund Adjustment (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="space-y-1">
          <Label className="text-red-900">Refund Amount (₹)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            readOnly={readonly}
            value={refundAmount}
            onChange={(e) => emit({ refundAmount: Number(e.target.value) || 0 })}
            className="bg-white border-red-200 text-red-900"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-red-900">Reason</Label>
          <Textarea
            rows={2}
            readOnly={readonly}
            value={refundReason}
            onChange={(e) => emit({ refundReason: e.target.value })}
            className="bg-white border-red-200 text-red-900 text-xs"
            placeholder="Short note on why refund is issued"
          />
        </div>
      </CardContent>
    </Card>
  )
}

