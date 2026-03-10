"use client"

import { CalendarCheck, DollarSign, Percent, Building2 } from "lucide-react"

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function CentralStatsCards(p: { totalBookings: number; totalRevenue: number; averageOccupancy: number; activeProperties: number; loading?: boolean }) {
  const { totalBookings, totalRevenue, averageOccupancy, activeProperties, loading } = p
  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/90">Global Performance Overview</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-white/15 p-3">
          <div className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-emerald-200" /><span className="text-xs text-white/90">Total Bookings</span></div>
          <p className="mt-1 text-2xl font-bold text-white">{loading ? "-" : totalBookings}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3">
          <div className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-200" /><span className="text-xs text-white/90">Total Revenue</span></div>
          <p className="mt-1 text-xl font-bold text-white">{loading ? "-" : fmt(totalRevenue)}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3">
          <div className="flex items-center gap-2"><Percent className="h-5 w-5 text-emerald-200" /><span className="text-xs text-white/90">Avg Occupancy</span></div>
          <p className="mt-1 text-2xl font-bold text-white">{loading ? "-" : `${averageOccupancy?.toFixed(1) ?? 0}%`}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3">
          <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-emerald-200" /><span className="text-xs text-white/90">Active Properties</span></div>
          <p className="mt-1 text-2xl font-bold text-white">{loading ? "-" : activeProperties}</p>
        </div>
      </div>
    </div>
  )
}
