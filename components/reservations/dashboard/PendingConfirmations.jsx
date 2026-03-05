'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PendingConfirmations({ rows = [] }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pending Confirmations</CardTitle>
        <p className="text-blue-100 text-xs">Bookings waiting for confirmation</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm max-h-[260px] overflow-y-auto">
        {rows.map((b) => (
          <div key={b.id} className="bg-white/10 rounded-xl px-3 py-2">
            <div className="flex justify-between items-center">
              <div className="min-w-0">
                <p className="font-semibold truncate">{b.guestName || 'Guest'}</p>
                <p className="text-xs text-blue-100 truncate">
                  Room {b.roomNumber || '-'} • {b.bookingNumber || b.id?.slice(0, 8)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-100">Check-in</p>
                <p className="font-semibold text-sm">
                  {b.checkIn ? new Date(b.checkIn).toLocaleDateString('en-IN') : '-'}
                </p>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-blue-100 text-sm">No pending confirmations.</p>
        )}
      </CardContent>
    </Card>
  )
}

