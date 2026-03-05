'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ReservationSearch({ value, onChange }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
      <div>
        <Label className="text-purple-50">Guest Name</Label>
        <Input
          value={v.guestName || ''}
          onChange={(e) => set({ guestName: e.target.value })}
          placeholder="Search by guest name"
          className="mt-1 h-8 bg-white/15 text-purple-50 placeholder:text-purple-100/70 border-purple-100/40"
        />
      </div>
      <div>
        <Label className="text-purple-50">Phone</Label>
        <Input
          value={v.phone || ''}
          onChange={(e) => set({ phone: e.target.value })}
          placeholder="Search by phone"
          className="mt-1 h-8 bg-white/15 text-purple-50 placeholder:text-purple-100/70 border-purple-100/40"
        />
      </div>
      <div>
        <Label className="text-purple-50">Reservation Number</Label>
        <Input
          value={v.reservationNumber || ''}
          onChange={(e) => set({ reservationNumber: e.target.value })}
          placeholder="RES-2026-0001"
          className="mt-1 h-8 bg-white/15 text-purple-50 placeholder:text-purple-100/70 border-purple-100/40"
        />
      </div>
    </div>
  )
}

