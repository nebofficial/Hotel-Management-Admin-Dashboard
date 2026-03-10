"use client"

import { Card, CardContent } from "@/components/ui/card"

interface RestaurantSalesReportProps {
  data: {
    totalRestaurantRevenue?: number
    totalOrders?: number
    averageOrderValue?: number
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

export function RestaurantSalesReport({ data, loading }: RestaurantSalesReportProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-900">
        Restaurant Sales
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-none bg-white/80 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-gray-700">Total Revenue</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {loading ? "—" : fmt(data?.totalRestaurantRevenue || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-gray-700">Total Orders</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {loading ? "—" : data?.totalOrders ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/80 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-gray-700">Avg Order Value</p>
            <p className="mt-1 text-xl font-bold text-gray-900">
              {loading ? "—" : fmt(data?.averageOrderValue || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

