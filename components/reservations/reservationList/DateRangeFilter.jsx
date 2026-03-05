'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function DateRangeFilter({ value, onChange }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })

  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div>
        <Label className="text-purple-50">Check-in From</Label>
        <Input
          type="date"
          value={v.checkInFrom || ''}
          onChange={(e) => set({ checkInFrom: e.target.value })}
          className="mt-1 h-8 bg-white/15 text-purple-50 border-purple-100/40"
        />
      </div>
      <div>
        <Label className="text-purple-50">Check-in To</Label>
        <Input
          type="date"
          value={v.checkInTo || ''}
          onChange={(e) => set({ checkInTo: e.target.value })}
          className="mt-1 h-8 bg-white/15 text-purple-50 border-purple-100/40"
        />
      </div>
    </div>
  )
}

