"use client"

import { DollarSign, TrendingUp } from "lucide-react"

interface TotalRevenuePanelProps {
  totalRevenue: number
  revenueToday: number
  averageRevenuePerProperty: number
  loading?: boolean
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function TotalRevenuePanel({
  totalRevenue,
  revenueToday,
  averageRevenuePerProperty,
  loading,
}: TotalRevenuePanelProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/95">
        <DollarSign className="h-4 w-4" />
        Revenue Overview Across Properties
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
          <p className="text-xs font-medium text-white/90">Total Revenue (period)</p>
          <p className="mt-1 text-xl font-bold text-white">
            {loading ? "—" : fmt(totalRevenue)}
          </p>
        </div>
        <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
          <p className="text-xs font-medium text-white/90">Revenue Today</p>
          <p className="mt-1 text-xl font-bold text-white">
            {loading ? "—" : fmt(revenueToday)}
          </p>
        </div>
        <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
          <p className="flex items-center gap-1 text-xs font-medium text-white/90">
            <TrendingUp className="h-3 w-3" />
            Avg per Property
          </p>
          <p className="mt-1 text-xl font-bold text-white">
            {loading ? "—" : fmt(averageRevenuePerProperty)}
          </p>
        </div>
      </div>
    </div>
  )
}
