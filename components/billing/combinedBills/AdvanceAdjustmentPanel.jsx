'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AdvanceAdjustmentPanel({ ledger, onApplyAdvance, loading }) {
  const [amount, setAmount] = useState('')

  const existingAdvance = ledger?.advanceTotal || 0

  const handleApply = () => {
    const amt = Number(amount)
    if (!amt || Number.isNaN(amt)) return
    onApplyAdvance?.(amt)
    setAmount('')
  }

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-orange-50/80 to-amber-50/70">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Advance & Credits</h3>
        <p className="text-xs text-slate-600">Deduct advance and credits from final bill</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-700">Existing Advance</span>
          <span className="font-semibold text-slate-900">₹{existingAdvance.toFixed(2)}</span>
        </div>
        <div className="flex gap-2 mt-1">
          <Input
            type="number"
            placeholder="Additional advance / credit"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-8 text-xs"
          />
          <Button type="button" size="sm" onClick={handleApply} disabled={loading}>
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

