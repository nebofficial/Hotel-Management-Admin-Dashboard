"use client"

import { Building2, BedDouble, CalendarCheck, Percent } from "lucide-react"

interface PropertyStatsCardsProps {
  totalProperties: number
  totalRooms: number
  totalActiveBookings: number
  overallOccupancyRate: number
  loading?: boolean
}

const cards = [
  { key: "properties", label: "Total Properties", icon: Building2 },
  { key: "rooms", label: "Total Rooms", icon: BedDouble },
  { key: "bookings", label: "Active Bookings", icon: CalendarCheck },
  { key: "occupancy", label: "Overall Occupancy", icon: Percent, suffix: "%" },
] as const

export function PropertyStatsCards({
  totalProperties,
  totalRooms,
  totalActiveBookings,
  overallOccupancyRate,
  loading,
}: PropertyStatsCardsProps) {
  const values = {
    properties: totalProperties,
    rooms: totalRooms,
    bookings: totalActiveBookings,
    occupancy: overallOccupancyRate?.toFixed(1) ?? "0",
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/90">
        Global Property Overview
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map(({ key, label, icon: Icon, suffix = "" }) => (
          <div
            key={key}
            className="rounded-lg bg-white/15 backdrop-blur-sm p-3 text-white shadow"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-emerald-200" />
              <span className="text-xs font-medium text-white/90">{label}</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {loading ? "—" : `${values[key]}${suffix}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
