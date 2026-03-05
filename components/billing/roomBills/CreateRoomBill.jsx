'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CreateRoomBill({
  bookings = [],
  selectedBookingId,
  onSelectBooking,
  guest,
  booking,
  nights = 1,
  advancePaid = 0,
  onAdvancePaidChange,
  onGuestNameChange,
  onBookingNumberChange,
  onCheckInChange,
  onCheckOutChange,
  onRoomNumberChange,
  onNightsChange,
}) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Create Room Bill</CardTitle>
        <p className="text-emerald-100 text-xs">
          Select room / booking and auto-fill guest + stay details.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="space-y-1">
          <Label className="text-xs text-emerald-50">Select Booking / Room</Label>
          <Select value={selectedBookingId || ''} onValueChange={onSelectBooking}>
            <SelectTrigger className="w-full bg-white/10 border-white/30 text-xs text-emerald-50">
              <SelectValue placeholder="Choose active booking" />
            </SelectTrigger>
            <SelectContent className="text-gray-900 text-xs">
              {bookings.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.roomNumber || 'Room'}{' '}
                  {b.guestName ? `• ${b.guestName}` : ''}
                  {b.bookingNumber ? ` • ${b.bookingNumber}` : ''}
                </SelectItem>
              ))}
              {bookings.length === 0 && (
                <SelectItem disabled value="__none">
                  No active bookings found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-emerald-50">Guest Name</Label>
            <Input
              value={guest?.fullName || booking?.guestName || ''}
              onChange={(e) => onGuestNameChange?.(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-emerald-100"
              placeholder="Guest will appear here"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-emerald-50">Booking No.</Label>
            <Input
              value={booking?.bookingNumber || ''}
              onChange={(e) => onBookingNumberChange?.(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-emerald-100"
              placeholder="Booking number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-emerald-50">Check-in</Label>
            <Input
              type="date"
              value={booking?.checkIn || ''}
              onChange={(e) => onCheckInChange?.(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-emerald-100"
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-emerald-50">Check-out</Label>
            <Input
              type="date"
              value={booking?.checkOut || ''}
              onChange={(e) => onCheckOutChange?.(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-emerald-100"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-emerald-50">Room</Label>
            <Input
              value={booking?.roomNumber || ''}
              onChange={(e) => onRoomNumberChange?.(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-emerald-100"
              placeholder="Room"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-emerald-50">Nights</Label>
            <Input
              type="number"
              min="1"
              step="1"
              value={nights || 1}
              onChange={(e) => onNightsChange?.(Number(e.target.value) || 1)}
              className="bg-white/10 border-white/30 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-emerald-50">Advance Paid (₹)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={advancePaid}
              onChange={(e) => onAdvancePaidChange?.(Number(e.target.value) || 0)}
              className="bg-white/10 border-white/30 text-white placeholder:text-emerald-100"
              placeholder="0.00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

