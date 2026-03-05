"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, TrendingDown, Package } from "lucide-react"
import Link from "next/link"

export interface ReplenishmentItem {
  id: string
  itemName: string
  category: string
  currentStock: number
  minimumThreshold: number
  maximumCapacity: number | null
  unit: string
  location: string | null
}

interface ReplenishmentAlertsProps {
  items: ReplenishmentItem[]
}

export function ReplenishmentAlerts({ items }: ReplenishmentAlertsProps) {
  const lowStock = items.filter((i) => i.currentStock < i.minimumThreshold)
  const outOfStock = items.filter((i) => i.currentStock === 0)
  const criticalStock = items.filter(
    (i) => i.currentStock > 0 && i.currentStock < i.minimumThreshold * 0.5,
  )

  const getUrgency = (item: ReplenishmentItem) => {
    if (item.currentStock === 0) return { level: "Critical", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    if (item.currentStock < item.minimumThreshold * 0.5)
      return { level: "High", color: "bg-rose-100 text-rose-800", icon: AlertTriangle }
    return { level: "Medium", color: "bg-amber-100 text-amber-800", icon: Bell }
  }

  const getReorderQuantity = (item: ReplenishmentItem) => {
    const target = item.maximumCapacity || item.minimumThreshold * 3
    return Math.max(target - item.currentStock, item.minimumThreshold)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border border-red-100 shadow-sm rounded-2xl bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-200 text-red-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-red-800">Critical alerts</p>
              <p className="text-xl font-bold text-red-900">{criticalStock.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-amber-100 shadow-sm rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-200 text-amber-700">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-800">Low stock</p>
              <p className="text-xl font-bold text-amber-900">{lowStock.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-rose-100 shadow-sm rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-200 text-rose-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-rose-800">Out of stock</p>
              <p className="text-xl font-bold text-rose-900">{outOfStock.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-2 pt-4 px-4 flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-600" />
            Replenishment alerts
          </CardTitle>
          {lowStock.length > 0 && (
            <Badge className="bg-amber-100 text-amber-800 text-[10px]">
              {lowStock.length} items need reorder
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {lowStock.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-3">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-slate-900">All items are well stocked!</p>
              <p className="text-xs text-slate-500 mt-1">No replenishment needed at this time.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStock
                .sort((a, b) => {
                  // Sort by urgency: out of stock first, then critical, then low
                  if (a.currentStock === 0 && b.currentStock > 0) return -1
                  if (a.currentStock > 0 && b.currentStock === 0) return 1
                  return a.currentStock - b.currentStock
                })
                .map((item) => {
                  const urgency = getUrgency(item)
                  const Icon = urgency.icon
                  const reorderQty = getReorderQuantity(item)
                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg border-2 p-3 ${
                        urgency.level === "Critical"
                          ? "border-red-200 bg-red-50"
                          : urgency.level === "High"
                          ? "border-rose-200 bg-rose-50"
                          : "border-amber-200 bg-amber-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`h-4 w-4 ${urgency.color.replace("bg-", "text-").replace("-100", "-700")}`} />
                            <span className="font-semibold text-slate-900">{item.itemName}</span>
                            <Badge className={`text-[10px] ${urgency.color}`}>
                              {urgency.level}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
                            <div>
                              <span className="text-slate-600">Current:</span>
                              <span className="font-semibold text-slate-900 ml-1">
                                {item.currentStock} {item.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">Minimum:</span>
                              <span className="font-semibold text-slate-900 ml-1">
                                {item.minimumThreshold} {item.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">Shortage:</span>
                              <span className="font-semibold text-rose-700 ml-1">
                                {item.minimumThreshold - item.currentStock} {item.unit}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">Reorder:</span>
                              <span className="font-semibold text-emerald-700 ml-1">
                                {reorderQty} {item.unit}
                              </span>
                            </div>
                          </div>
                          {item.location && (
                            <p className="text-[11px] text-slate-500 mt-1">
                              Location: {item.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border border-blue-100 shadow-sm rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-200 text-blue-700 shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold text-blue-900 mb-1">Quick actions</p>
              <p className="text-blue-700 mb-2">
                Review low stock items above and update inventory levels in Stock Management, or
                connect with suppliers for bulk orders.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/housekeeping/laundry"
                  className="text-[11px] px-2 py-1 rounded-md bg-white text-blue-700 hover:bg-blue-100 border border-blue-200"
                >
                  Check laundry status
                </Link>
                <Link
                  href="/housekeeping/schedule"
                  className="text-[11px] px-2 py-1 rounded-md bg-white text-blue-700 hover:bg-blue-100 border border-blue-200"
                >
                  View cleaning schedule
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
