'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock4 } from 'lucide-react'

export default function LateCheckOutPanel({ value, onChange }) {
  const v = value || {}
  const set = (patch) => onChange?.({ ...v, ...patch })

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Clock4 className="h-5 w-5" />
          Late Check-Out
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-white/90">Requested Check-out Date</Label>
            <Input
              type="date"
              value={v.date || ''}
              onChange={(e) => set({ date: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
          <div>
            <Label className="text-white/90">Requested Check-out Time</Label>
            <Input
              type="time"
              value={v.time || ''}
              onChange={(e) => set({ time: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20 h-9"
            />
          </div>
        </div>
        <p className="text-[11px] text-purple-100">
          Use this when the guest departs after standard check-out time. Extra hours will be billed according to hotel
          policy.
        </p>
      </CardContent>
    </Card>
  )
}

