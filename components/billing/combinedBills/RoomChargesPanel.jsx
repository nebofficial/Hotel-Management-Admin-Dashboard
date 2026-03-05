'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RoomChargesPanel({ booking, roomBill, ledger }) {
  const roomTotal = ledger?.roomChargesTotal ?? roomBill?.grandTotal ?? booking?.totalAmount ?? 0

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/70">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Room Charges</h3>
        {booking && (
          <p className="text-xs text-slate-600">
            Room {booking.roomNumber} • {new Date(booking.checkIn).toLocaleDateString()} →{' '}
            {new Date(booking.checkOut).toLocaleDateString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Room Rent + Extras</span>
          <span className="font-semibold">₹{Number(roomTotal).toFixed(2)}</span>
        </div>
        {roomBill && (
          <p className="text-[11px] text-slate-500">
            Bill #{roomBill.billNumber} • Nights: {roomBill.nights}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

