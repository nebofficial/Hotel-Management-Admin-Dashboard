'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConfirmationPreview({ booking, policy }) {
  if (!booking || !policy) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-rose-600 via-red-500 to-pink-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Confirmation Preview</CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
          <p className="text-white/80 text-sm text-center py-4">
            Email / WhatsApp confirmation text will appear here after fee calculation.
          </p>
        </CardContent>
      </Card>
    )
  }

  const format = (v) => `₹${Number(v || 0).toFixed(2)}`

  const lines = [
    `Dear ${booking.guestName},`,
    '',
    `Your reservation ${booking.bookingNumber} for room ${booking.roomNumber} has been cancelled.`,
    `Check-in: ${new Date(booking.checkIn).toLocaleString('en-IN')}`,
    `Check-out: ${new Date(booking.checkOut).toLocaleString('en-IN')}`,
    '',
    `Cancellation fee: ${format(policy.cancellationFee)}`,
    `Refundable amount: ${format(policy.refundableAmount)}`,
    '',
    'Refund (if applicable) will be processed as per our refund timelines.',
    '',
    'Thank you,',
    'Hotel Team',
  ]

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-rose-600 via-red-500 to-pink-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Confirmation Preview</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs whitespace-pre-line">
        {lines.join('\n')}
      </CardContent>
    </Card>
  )
}

