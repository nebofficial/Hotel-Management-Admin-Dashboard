'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RecentBookingActivity({ rows = [] }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200">
      <CardHeader className="pb-2 border-b border-amber-200/50 bg-amber-50/50">
        <CardTitle className="text-base text-amber-900">Recent Booking Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-amber-100/80">
              <tr>
                <th className="text-left py-2 px-3 font-semibold text-amber-900">Booking #</th>
                <th className="text-left py-2 px-3 font-semibold text-amber-900">Guest</th>
                <th className="text-left py-2 px-3 font-semibold text-amber-900">Room</th>
                <th className="text-left py-2 px-3 font-semibold text-amber-900">Status</th>
                <th className="text-left py-2 px-3 font-semibold text-amber-900">Check-in</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-amber-100 hover:bg-amber-50">
                  <td className="py-2 px-3 text-gray-800">{b.bookingNumber || b.id?.slice(0, 8)}</td>
                  <td className="py-2 px-3 text-gray-800">{b.guestName || '-'}</td>
                  <td className="py-2 px-3 text-gray-800">{b.roomNumber || '-'}</td>
                  <td className="py-2 px-3 text-gray-800">{b.status || '-'}</td>
                  <td className="py-2 px-3 text-gray-600">
                    {b.checkIn ? new Date(b.checkIn).toLocaleDateString('en-IN') : '-'}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                    No recent bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

