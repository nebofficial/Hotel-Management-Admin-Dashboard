'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BedDouble, ArrowUpRight } from 'lucide-react'

export default function RoomAssignmentPanel({ reservation, rooms, selectedRoomId, onRoomChange, onUpgrade, upgrading }) {
  const currentRoomLabel = reservation
    ? `Room ${reservation.roomNumber} (${reservation.roomType || 'N/A'})`
    : 'No reservation selected'

  const handleSelectChange = (val) => {
    if (val === 'current') {
      onRoomChange?.('')
    } else {
      onRoomChange?.(val)
    }
  }

  const selectValue = selectedRoomId || 'current'

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <BedDouble className="h-5 w-5" />
          Room Assignment / Upgrade
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-3 text-xs">
        <div>
          <Label className="text-white/90">Reserved Room</Label>
          <div className="mt-1 px-3 py-2 bg-white/10 rounded-md border border-white/20 text-sm">
            {currentRoomLabel}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <Label className="text-white/90">Change / Upgrade To</Label>
            <Select value={selectValue} onValueChange={handleSelectChange}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20 h-9">
                <SelectValue placeholder="Keep current room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Keep current room</SelectItem>
                {(rooms || []).map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    Room {r.roomNumber} • {r.roomType} • ₹{r.pricePerNight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              type="button"
              disabled={!reservation || upgrading}
              onClick={onUpgrade}
              className="w-full h-9 bg-white text-purple-700 hover:bg-purple-50 text-xs font-semibold"
            >
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Auto Upgrade
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

