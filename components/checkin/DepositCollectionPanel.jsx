'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Wallet2 } from 'lucide-react'

const MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

export default function DepositCollectionPanel({ required, paid, value, onChange, onCollect, collecting }) {
  const v = value || {}
  const set = (patch) => onChange?.({ ...v, ...patch })

  const requiredAmt = Number(required || 0)
  const paidAmt = Number(paid || 0)
  const balance = Math.max(0, requiredAmt - paidAmt)

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Wallet2 className="h-5 w-5" />
          Deposit Collection
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-3 text-xs">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className="text-white/70 text-[11px]">Required</div>
            <div className="text-sm font-semibold">₹{requiredAmt.toFixed(2)}</div>
          </div>
          <div className="bg-green-500/30 rounded-lg p-2 text-center border border-green-400/40">
            <div className="text-emerald-100 text-[11px]">Collected</div>
            <div className="text-sm font-semibold">₹{paidAmt.toFixed(2)}</div>
          </div>
          <div className="bg-red-500/30 rounded-lg p-2 text-center border border-red-400/40">
            <div className="text-red-100 text-[11px]">Balance</div>
            <div className="text-sm font-semibold">₹{balance.toFixed(2)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <Label className="text-white/90">Amount to Collect</Label>
            <Input
              type="number"
              min={0}
              value={v.amount || balance}
              onChange={(e) => set({ amount: Number(e.target.value || 0) })}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Payment Mode</Label>
            <Select value={v.mode || 'cash'} onValueChange={(mode) => set({ mode })}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              type="button"
              disabled={!v.amount || Number(v.amount) <= 0 || collecting}
              onClick={() => onCollect?.(v)}
              className="w-full h-9 bg-white text-amber-700 hover:bg-amber-50 font-semibold"
            >
              {collecting ? 'Collecting…' : 'Collect Deposit'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

