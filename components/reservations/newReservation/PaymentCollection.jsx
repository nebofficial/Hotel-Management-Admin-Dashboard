'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PaymentCollection({ payment, onChange, quote }) {
  const p = payment || {}
  const set = (patch) => onChange((x) => ({ ...(x || {}), ...patch }))

  const total = quote ? Number(quote.total || 0) : null
  const advance = Number(p.advancePaid || 0) || 0
  const balance = total == null ? null : Math.max(0, total - advance)

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white">
      <CardHeader>
        <CardTitle className="text-white">Payment & Confirmation</CardTitle>
        <div className="text-white/80 text-sm">Collect advance payment and confirm reservation.</div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white/90">Advance Payment</Label>
            <Input
              type="number"
              min={0}
              value={p.advancePaid == null ? 0 : p.advancePaid}
              onChange={(e) => set({ advancePaid: Math.max(0, Number(e.target.value || 0)) })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
          <div>
            <Label className="text-white/90">Payment Mode</Label>
            <Select value={p.mode || 'cash'} onValueChange={(mode) => set({ mode })}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-white/80">Total Amount</div>
            <div className="text-right font-semibold">{total == null ? '—' : total.toFixed(2)}</div>
            <div className="text-white/80">Advance Paid</div>
            <div className="text-right font-semibold">{advance.toFixed(2)}</div>
            <div className="text-white/80">Balance Amount</div>
            <div className="text-right text-base font-bold">{balance == null ? '—' : balance.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

