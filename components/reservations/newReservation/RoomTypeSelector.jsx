'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RoomTypeSelector({ value, onChange, roomTypes = [], hint }) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white">
      <CardHeader>
        <CardTitle className="text-white">Room Type & Availability</CardTitle>
        <div className="text-white/80 text-sm">{hint || '⚡ Auto updates on date change.'}</div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl">
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger className="bg-white/15 text-white border-white/20">
            <SelectValue placeholder="Select Room Type" />
          </SelectTrigger>
          <SelectContent>
            {(roomTypes.length ? roomTypes : ['Single', 'Double', 'Deluxe', 'Suite']).map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

