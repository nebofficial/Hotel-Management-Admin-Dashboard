'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const MODES = ['original', 'cash', 'bank_transfer']

export default function RefundProcessingPanel({ policy, value, onChange, onProcess, processing }) {
  const v = value || {}
  const set = (patch) => onChange?.({ ...v, ...patch })

  const maxRefund = policy ? Number(policy.refundableAmount || 0) : 0

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Refund Processing</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-white/90">Refund Amount</Label>
            <Input
              type="number"
              min={0}
              max={maxRefund}
              value={v.amount ?? maxRefund}
              onChange={(e) => set({ amount: Number(e.target.value || 0) })}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Mode</Label>
            <select
              value={v.method || 'original'}
              onChange={(e) => set({ method: e.target.value })}
              className="mt-1 w-full h-9 rounded-md bg-white/15 text-white border border-white/20 text-xs"
            >
              {MODES.map((m) => (
                <option key={m} value={m}>
                  {m === 'original' ? 'Original method' : m.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label className="text-white/90">Reference Number</Label>
          <Input
            value={v.reference || ''}
            onChange={(e) => set({ reference: e.target.value })}
            className="mt-1 bg-white/15 text-white border-white/20 h-9"
            placeholder="Transaction / reference ID"
          />
        </div>
        <Button
          type="button"
          disabled={!policy || processing || maxRefund <= 0}
          onClick={() => onProcess?.(v)}
          className="w-full h-9 bg-white text-amber-700 hover:bg-amber-50 font-semibold text-xs"
        >
          {processing ? 'Processing Refund…' : 'Process Refund'}
        </Button>
      </CardContent>
    </Card>
  )
}

