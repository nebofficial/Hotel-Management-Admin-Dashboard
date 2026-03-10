"use client"

import { Card, CardContent } from "@/components/ui/card"

interface InventoryReportPanelProps {
  data: {
    totalItems?: number
    totalInventoryValue?: number
    lowStockItems?: number
    stockConsumedToday?: number
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

export function InventoryReportPanel({ data, loading }: InventoryReportPanelProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/95">
        Inventory Report
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Total Items</p>
            <p className="mt-1 text-xl font-bold">{loading ? "—" : data?.totalItems ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Inventory Value</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : fmt(data?.totalInventoryValue || 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Low Stock</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : data?.lowStockItems ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-white/15 text-white shadow-none">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-white/80">Consumed Today</p>
            <p className="mt-1 text-xl font-bold">
              {loading ? "—" : data?.stockConsumedToday ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

