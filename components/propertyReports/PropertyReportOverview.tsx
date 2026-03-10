"use client"

import { Card, CardContent } from "@/components/ui/card"

interface OverviewProps {
  propertyName: string
  totalRevenue: number
  occupancyRate: number
  totalExpenses: number
  loading?: boolean
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function PropertyReportOverview({
  propertyName,
  totalRevenue,
  occupancyRate,
  totalExpenses,
  loading,
}: OverviewProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/90">
        Property Report Overview
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Selected Property</p>
            <p className="mt-1 text-sm font-semibold truncate">
              {loading ? "—" : propertyName || "Not selected"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Total Revenue</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : fmt(totalRevenue || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Occupancy Rate</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : `${(occupancyRate || 0).toFixed(1)}%`}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Total Expenses</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : fmt(totalExpenses || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

