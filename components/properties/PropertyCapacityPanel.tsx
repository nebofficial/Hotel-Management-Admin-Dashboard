"use client"

import { BedDouble, Users } from "lucide-react"

interface PropertyCapacityPanelProps {
  totalRooms: number
  roomCategories: { name: string; count: number }[]
  loading?: boolean
}

export function PropertyCapacityPanel({
  totalRooms,
  roomCategories,
  loading,
}: PropertyCapacityPanelProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/95">
        <BedDouble className="h-4 w-4" />
        Property Capacity Details
      </h3>
      {loading ? (
        <div className="flex h-24 items-center justify-center text-white/80">Loading...</div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-white/90" />
              <span className="text-sm font-medium text-white/90">Total Rooms</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">{totalRooms}</p>
          </div>
          {roomCategories.length > 0 && (
            <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
              <p className="text-xs font-medium text-white/90">Room Categories</p>
              <ul className="mt-2 space-y-1">
                {roomCategories.map((c) => (
                  <li key={c.name} className="flex justify-between text-sm text-white">
                    <span>{c.name}</span>
                    <span>{c.count} rooms</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
