'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyRound } from 'lucide-react'

export default function KeyCardActivationPanel({ value, onChange, reservation }) {
  const v = value || {}
  const set = (patch) => onChange?.({ ...v, ...patch })

  const checkOutDate = reservation ? new Date(reservation.checkOut).toISOString().slice(0, 10) : ''

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-600 via-rose-500 to-pink-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <KeyRound className="h-5 w-5" />
          Key Card Activation
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label className="text-white/90">Key Card Number</Label>
            <Input
              value={v.keyCardNumber || ''}
              onChange={(e) => set({ keyCardNumber: e.target.value })}
              placeholder="Scan / enter card number"
              className="mt-1 bg-white/15 text-white border-white/20 h-9 placeholder:text-white/70"
            />
          </div>
          <div>
            <Label className="text-white/90">Valid Until</Label>
            <Input
              type="date"
              value={v.validUntil || checkOutDate}
              onChange={(e) => set({ validUntil: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Room</Label>
            <div className="mt-1 px-3 py-2 bg-white/10 rounded-md border border-white/20 text-sm">
              {reservation ? `Room ${reservation.roomNumber}` : '—'}
            </div>
          </div>
        </div>
        <p className="text-[11px] text-white/80">
          Card encoder APIs can be integrated here. For now, card number and validity will be stored with the stay
          record.
        </p>
      </CardContent>
    </Card>
  )
}

