'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StayDetailsPanel({ booking, stay }) {
  if (!booking) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Stay Details</CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
          <p className="text-white/80 text-sm text-center py-6">
            Search and select a stay to adjust early check-in / late check-out.
          </p>
        </CardContent>
      </Card>
    )
  }

  const standardCheckIn = new Date(booking.checkIn)
  const standardCheckOut = new Date(booking.checkOut)

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Stay Details</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <div className="text-white/80">Guest</div>
            <div className="font-semibold text-sm">{booking.guestName}</div>
          </div>
          <div>
            <div className="text-white/80">Room</div>
            <div className="font-semibold text-sm">
              {booking.roomNumber} ({booking.roomType || 'N/A'})
            </div>
          </div>
          <div>
            <div className="text-white/80">Standard Check-in</div>
            <div className="font-semibold text-sm">
              {new Date(booking.checkIn).toLocaleDateString('en-IN')} • {formatTime(booking.checkIn)}
            </div>
          </div>
          <div>
            <div className="text-white/80">Standard Check-out</div>
            <div className="font-semibold text-sm">
              {new Date(booking.checkOut).toLocaleDateString('en-IN')} • {formatTime(booking.checkOut)}
            </div>
          </div>
          <div>
            <div className="text-white/80">Current Time</div>
            <div className="font-semibold text-sm">{formatTime(new Date())}</div>
          </div>
          <div>
            <div className="text-white/80">Nightly Rate (approx)</div>
            <div className="font-semibold text-sm">
              ₹{Number(booking.roomCostTotal || booking.totalAmount || 0).toFixed(2)}
            </div>
          </div>
        </div>
        {stay && (
          <div className="mt-1 text-[11px] text-emerald-100">
            Stay status: <span className="font-semibold">{stay.status}</span> • Deposit paid: ₹
            {Number(stay.paidDeposit || 0).toFixed(2)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

