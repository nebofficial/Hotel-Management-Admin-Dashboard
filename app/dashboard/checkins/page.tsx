'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckInsPage() {
  const checkIns = [
    { id: 1, guestName: "John Doe", room: "101", time: "14:30", source: "Online" },
    { id: 2, guestName: "Jane Smith", room: "202", time: "15:45", source: "Phone" },
    { id: 3, guestName: "Mike Wilson", room: "305", time: "16:20", source: "Walk-in" },
    { id: 4, guestName: "Sarah Brown", room: "401", time: "17:00", source: "Online" },
    { id: 5, guestName: "Tom Davis", room: "502", time: "17:30", source: "Phone" },
  ]

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Today's Check-ins</h1>
        <p className="text-xs text-gray-500 mt-0.5">Guest arrivals for today</p>
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Check-in List (5 guests)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {checkIns.map((checkIn) => (
              <div key={checkIn.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{checkIn.guestName}</p>
                  <p className="text-xs text-gray-500">Room {checkIn.room}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900">{checkIn.time}</p>
                    <p className="text-xs text-gray-500">{checkIn.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
