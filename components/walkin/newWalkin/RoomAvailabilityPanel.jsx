'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bed, RefreshCw, Check, Star } from 'lucide-react'

export default function RoomAvailabilityPanel({
  roomTypes,
  selectedRoomType,
  onRoomTypeChange,
  availableRooms,
  selectedRoom,
  onRoomSelect,
  onRefresh,
  loading,
}) {
  const rooms = availableRooms || []
  const suggestedRoom = rooms.length > 0 ? rooms[0] : null

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Bed className="h-5 w-5" />
            Instant Room Allocation
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-white/80 text-sm">Real-time room availability</p>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
        <div className="space-y-4">
          <div>
            <Label className="text-white/90 text-sm">Room Type</Label>
            <Select value={selectedRoomType || ''} onValueChange={onRoomTypeChange}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20 h-10">
                <SelectValue placeholder="All room types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {(roomTypes || []).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white/90 text-sm">Available Rooms</Label>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {rooms.length} available
              </Badge>
            </div>

            {suggestedRoom && !selectedRoom && (
              <div className="mb-3 p-2 bg-yellow-500/30 rounded-lg border border-yellow-400/50">
                <div className="flex items-center gap-2 text-yellow-100 text-xs mb-1">
                  <Star className="h-3 w-3" /> Suggested Room
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/20 h-auto py-2"
                  onClick={() => onRoomSelect(suggestedRoom)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{suggestedRoom.roomNumber}</span>
                    <Badge className="bg-blue-400/30 text-blue-100">{suggestedRoom.roomType}</Badge>
                    <span className="text-white/80 text-sm">₹{suggestedRoom.pricePerNight}/night</span>
                  </div>
                </Button>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {rooms.length === 0 ? (
                <p className="text-white/60 text-sm text-center py-4">No rooms available</p>
              ) : (
                rooms.map((room) => (
                  <Button
                    key={room.id}
                    variant="ghost"
                    className={`w-full justify-between text-white hover:bg-white/20 h-auto py-2 ${
                      selectedRoom?.id === room.id ? 'bg-white/30 ring-2 ring-white' : ''
                    }`}
                    onClick={() => onRoomSelect(room)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{room.roomNumber}</span>
                      <Badge className="bg-white/20 text-white text-xs">{room.roomType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-sm">₹{room.pricePerNight}</span>
                      {selectedRoom?.id === room.id && <Check className="h-4 w-4 text-green-300" />}
                    </div>
                  </Button>
                ))
              )}
            </div>
          </div>

          {selectedRoom && (
            <div className="p-3 bg-green-500/30 rounded-lg border border-green-400/50">
              <div className="text-green-100 text-xs mb-1">Selected Room</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl">{selectedRoom.roomNumber}</span>
                  <Badge className="bg-green-400/30 text-green-100">{selectedRoom.roomType}</Badge>
                </div>
                <span className="text-white font-semibold">₹{selectedRoom.pricePerNight}/night</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
