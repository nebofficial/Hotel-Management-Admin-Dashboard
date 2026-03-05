'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function AdvanceReceiptPreview({ advance, booking }) {
  if (!advance) {
    return (
      <Card className="border border-slate-200 bg-white/90">
        <CardHeader className="pb-2">
          <h3 className="text-sm font-semibold text-slate-900">Advance Receipt Preview</h3>
          <p className="text-xs text-slate-600">Generate an advance to preview the receipt.</p>
        </CardHeader>
        <CardContent className="p-4 text-sm text-slate-500">
          No receipt selected.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900">Advance Receipt</h3>
        <p className="text-xs text-slate-600">
          Receipt #{advance.receiptNumber} • {advance.createdAt && new Date(advance.createdAt).toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Guest</span>
          <span className="font-semibold">{advance.guestName}</span>
        </div>
        {booking && (
          <>
            <div className="flex justify-between">
              <span>Booking</span>
              <span>Room {booking.roomNumber}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Stay</span>
              <span>
                {new Date(booking.checkIn).toLocaleDateString()} →{' '}
                {new Date(booking.checkOut).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
          <span>Advance Amount</span>
          <span className="font-semibold text-slate-900">
            ₹{Number(advance.amount || 0).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Adjusted</span>
          <span>₹{Number(advance.adjustedAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>Refunded</span>
          <span>₹{Number(advance.refundedAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-slate-200 pt-2 mt-1 text-sm">
          <span>Balance Advance</span>
          <span>
            ₹{(Number(advance.amount || 0) - Number(advance.adjustedAmount || 0) - Number(advance.refundedAmount || 0)).toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

