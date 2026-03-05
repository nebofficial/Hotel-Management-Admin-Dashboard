'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function RoomAssignment({ stay, availability, onAssign }) {
  const rooms = availability?.availableRooms || []
  const selected = stay?.roomId ? String(stay.roomId) : 'auto'

  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white">
      <CardHeader>
        <CardTitle className="text-white">Room Assignment</CardTitle>
        <div className="text-white/80 text-sm">Assign a specific available room (optional).</div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl space-y-3">
        <Select
          value={selected}
          onValueChange={(v) => onAssign(v === 'auto' ? '' : v)}
        >
          <SelectTrigger className="bg-white/15 text-white border-white/20">
            <SelectValue placeholder="Auto-assign the first available room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto assign</SelectItem>
            {rooms.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>
                {r.roomNumber} • {r.roomType} • {r.pricePerNight}/night
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-xs text-white/80">
          {rooms.length ? (
            <>Showing {rooms.length} available rooms.</>
          ) : (
            <>No availability loaded yet (pick dates + room type).</>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

