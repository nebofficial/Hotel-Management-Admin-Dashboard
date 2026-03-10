"use client"

import { Building2, Building, Home, BedDouble } from "lucide-react"

interface PropertyOverviewCardsProps {
  totalProperties: number
  activeProperties: number
  inactiveProperties: number
  totalRooms: number
  loading?: boolean
}

export function PropertyOverviewCards({
  totalProperties,
  activeProperties,
  inactiveProperties,
  totalRooms,
  loading,
}: PropertyOverviewCardsProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/90">
        Property Overview
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-200" />
            <span className="text-xs font-medium text-white/90">Total Properties</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{loading ? "—" : totalProperties}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-emerald-200" />
            <span className="text-xs font-medium text-white/90">Active</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{loading ? "—" : activeProperties}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-emerald-200" />
            <span className="text-xs font-medium text-white/90">Inactive</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{loading ? "—" : inactiveProperties}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-emerald-200" />
            <span className="text-xs font-medium text-white/90">Total Rooms</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-white">{loading ? "—" : totalRooms}</p>
        </div>
      </div>
    </div>
  )
}
