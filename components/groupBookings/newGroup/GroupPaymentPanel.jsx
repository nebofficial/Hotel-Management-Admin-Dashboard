'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function GroupPaymentPanel({ value, onChange, totals }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })

  const finalTotal = totals ? totals.finalAmount : 0
  const advance = Number(v.advancePaid || 0) || 0
  const balance = finalTotal ? Math.max(0, finalTotal - advance) : 0

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-rose-700 via-red-700 to-orange-600 text-white">
      <CardHeader>
        <CardTitle className="text-white text-sm">Group Payment</CardTitle>
        <div className="text-xs text-rose-100/90">
          Collect advance and view real-time balance based on final group total.
        </div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-white/90">Advance Payment</Label>
            <Input
              type="number"
              min={0}
              value={v.advancePaid || 0}
              onChange={(e) => set({ advancePaid: Math.max(0, Number(e.target.value || 0)) })}
              className="mt-1 h-8 bg-white/15 text-white border-white/25"
            />
          </div>
          <div>
            <Label className="text-white/90">Payment Mode</Label>
            <Select
              value={v.mode || 'cash'}
              onValueChange={(mode) => set({ mode })}
            >
              <SelectTrigger className="mt-1 h-8 bg-white/15 text-white border-white/25">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-rose-100/80">Total Group Amount</div>
            <div className="text-base font-semibold">
              {finalTotal ? finalTotal.toFixed(2) : '—'}
            </div>
          </div>
          <div>
            <div className="text-rose-100/80">Advance Paid</div>
            <div className="text-base font-semibold">{advance.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-rose-100/80">Balance Due</div>
            <div className="text-base font-bold">{balance ? balance.toFixed(2) : '—'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

