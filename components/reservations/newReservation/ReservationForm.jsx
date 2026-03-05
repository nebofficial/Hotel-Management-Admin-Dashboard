'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ReservationForm({ reservationNumber, onReservationNumberChange, stay, onChange }) {
  const set = (patch) => onChange((s) => ({ ...s, ...patch }))

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <CardHeader>
        <CardTitle className="text-white">Reservation Creation Panel</CardTitle>
        <div className="text-white/80 text-sm">🧾 Reservation number auto-generated on page load.</div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Label className="text-white/90">Reservation Number</Label>
            <Input
              value={reservationNumber || ''}
              onChange={(e) => onReservationNumberChange && onReservationNumberChange(e.target.value)}
              className="mt-1 bg-white/15 text-white placeholder:text-white/70 border-white/20"
            />
          </div>
          <div>
            <Label className="text-white/90">Check-in</Label>
            <Input
              type="date"
              value={stay.checkIn || ''}
              onChange={(e) => set({ checkIn: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
          <div>
            <Label className="text-white/90">Check-out</Label>
            <Input
              type="date"
              value={stay.checkOut || ''}
              onChange={(e) => set({ checkOut: e.target.value })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
          <div>
            <Label className="text-white/90">Guests</Label>
            <Input
              type="number"
              min={1}
              value={stay.numberOfGuests || 1}
              onChange={(e) => set({ numberOfGuests: Math.max(1, Number(e.target.value || 1)) })}
              className="mt-1 bg-white/15 text-white border-white/20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

