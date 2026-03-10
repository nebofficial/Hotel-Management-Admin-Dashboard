"use client"

import { Card, CardContent } from "@/components/ui/card"

interface RevenueReportPanelProps {
  data: {
    totalRevenueToday?: number
    totalRevenueThisMonth?: number
    totalRevenueThisYear?: number
    averageDailyRevenue?: number
  }
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

export function RevenueReportPanel({ data, loading }: RevenueReportPanelProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/95">
        Revenue Report
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Today</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : fmt(data?.totalRevenueToday || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">This Month</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : fmt(data?.totalRevenueThisMonth || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">This Year</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : fmt(data?.totalRevenueThisYear || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Avg Daily</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : fmt(data?.averageDailyRevenue || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

