'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RatePlansPage() {
  const rates = [
    { id: 1, name: "Standard Rate", roomType: "Standard", basePrice: "$120/night", occupancy: "2 guests", bookings: 45 },
    { id: 2, name: "Deluxe Rate", roomType: "Deluxe", basePrice: "$180/night", occupancy: "3 guests", bookings: 32 },
    { id: 3, name: "Suite Rate", roomType: "Suite", basePrice: "$250/night", occupancy: "4 guests", bookings: 18 },
    { id: 4, name: "Promotional", roomType: "Standard", basePrice: "$99/night", occupancy: "2 guests", bookings: 28 },
  ]

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Rate Plans</h1>
        <p className="text-xs text-gray-500 mt-0.5">Room pricing and rate management</p>
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Active Rates (4)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {rates.map((rate) => (
              <div key={rate.id} className="flex items-start justify-between p-2 bg-gray-50 rounded border border-gray-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{rate.name}</p>
                  <p className="text-xs text-gray-600">{rate.roomType} • {rate.occupancy}</p>
                  <p className="text-xs text-gray-500">Bookings: {rate.bookings}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{rate.basePrice}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
