'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StaySummaryPanel({ booking, stay, bill }) {
  if (!booking) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Stay Summary</CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
          <p className="text-white/80 text-sm text-center py-6">Search and select a reservation to see stay details.</p>
        </CardContent>
      </Card>
    )
  }

  const checkIn = new Date(booking.checkIn)
  const checkOut = new Date(booking.checkOut)
  const nights = Math.max(
    1,
    Math.ceil((checkOut.setHours(0, 0, 0, 0) - checkIn.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)),
  )

  const depositPaid = stay ? Number(stay.paidDeposit || 0) : Number(booking.advancePaid || 0)

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Stay Summary</CardTitle>
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
            <div className="text-white/80">Nights</div>
            <div className="font-semibold text-sm">{nights}</div>
          </div>
          <div>
            <div className="text-white/80">Check-in</div>
            <div className="font-semibold text-sm">
              {new Date(booking.checkIn).toLocaleDateString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-white/80">Check-out</div>
            <div className="font-semibold text-sm">
              {new Date(booking.checkOut).toLocaleDateString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-white/80">Deposit Paid</div>
            <div className="font-semibold text-sm">₹{depositPaid.toFixed(2)}</div>
          </div>
        </div>
        {bill && (
          <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-white/80">Bill #</div>
              <div className="font-semibold text-sm">{bill.billNumber}</div>
            </div>
            <div>
              <div className="text-white/80">Total</div>
              <div className="font-semibold text-sm">₹{Number(bill.grandTotal || 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-white/80">Net Payable</div>
              <div className="font-semibold text-sm">₹{Number(bill.netPayable || 0).toFixed(2)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

