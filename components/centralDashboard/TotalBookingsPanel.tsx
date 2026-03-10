"use client"

import { CalendarCheck } from "lucide-react"

export function TotalBookingsPanel(p: { totalBookings: number; byProperty: { hotelName: string; bookings: number }[]; loading?: boolean }) {
  const { totalBookings, byProperty, loading } = p
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-900">
        <CalendarCheck className="h-4 w-4" /> Total Bookings
      </h3>
      <p className="text-2xl font-bold text-blue-900">{loading ? "-" : totalBookings}</p>
      {byProperty?.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          {byProperty.slice(0, 5).map((x) => (
            <li key={x.hotelName}>{x.hotelName}: {x.bookings}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
