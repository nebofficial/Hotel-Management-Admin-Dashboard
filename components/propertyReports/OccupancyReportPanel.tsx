"use client"

import { Card, CardContent } from "@/components/ui/card"

interface OccupancyReportPanelProps {
  data: {
    totalRooms?: number
    roomsOccupiedToday?: number
    occupancyRateToday?: number
    daily?: { date: string; roomsOccupied: number }[]
  }
  loading?: boolean
}

export function OccupancyReportPanel({ data, loading }: OccupancyReportPanelProps) {
  const totalRooms = data?.totalRooms ?? 0
  const occupied = data?.roomsOccupiedToday ?? 0
  const rate = data?.occupancyRateToday ?? 0

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/95">
        Occupancy Report
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Total Rooms</p>
            <p className="mt-1 text-xl font-bold">{loading ? "—" : totalRooms}</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Rooms Occupied</p>
            <p className="mt-1 text-xl font-bold">{loading ? "—" : occupied}</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Occupancy %</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : `${rate.toFixed ? rate.toFixed(1) : rate}%`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

