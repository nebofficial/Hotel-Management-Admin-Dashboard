"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Package, Calendar } from "lucide-react"

export interface ReportingItem {
  id: string
  itemName: string
  category: string
  currentStock: number
  minimumThreshold: number
}

export interface ReportingUsage {
  id: string
  itemName: string
  quantity: number
  issuedDate: string
  returnedDate: string | null
}

interface ReportingAnalyticsProps {
  items: ReportingItem[]
  usage: ReportingUsage[]
}

export function ReportingAnalytics({ items, usage }: ReportingAnalyticsProps) {
  const totalStock = items.reduce((sum, i) => sum + i.currentStock, 0)
  const totalValue = items.length // Simplified: could be actual value calculation
  const avgStockLevel = items.length > 0 ? Math.round(totalStock / items.length) : 0

  const activeIssues = usage.filter((u) => !u.returnedDate).length
  const totalIssued = usage.reduce((sum, u) => sum + u.quantity, 0)

  const byCategory = new Map<string, { count: number; stock: number }>()
  items.forEach((item) => {
    const entry = byCategory.get(item.category) || { count: 0, stock: 0 }
    entry.count += 1
    entry.stock += item.currentStock
    byCategory.set(item.category, entry)
  })

  const byItemUsage = new Map<string, number>()
  usage.forEach((u) => {
    const current = byItemUsage.get(u.itemName) || 0
    byItemUsage.set(u.itemName, current + u.quantity)
  })

  const topUsedItems = Array.from(byItemUsage.entries())
    .map(([name, qty]) => ({ name, quantity: qty }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  const recentUsage = usage
    .sort((a, b) => b.issuedDate.localeCompare(a.issuedDate))
    .slice(0, 10)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-200 text-emerald-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-800">Total stock</p>
              <p className="text-xl font-bold text-emerald-900">{totalStock}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-200 text-blue-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-800">Avg stock level</p>
              <p className="text-xl font-bold text-blue-900">{avgStockLevel}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-200 text-purple-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-800">Active issues</p>
              <p className="text-xl font-bold text-purple-900">{activeIssues}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-200 text-amber-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-800">Total issued</p>
              <p className="text-xl font-bold text-amber-900">{totalIssued}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Stock by category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs">
            <div className="space-y-2">
              {Array.from(byCategory.entries()).map(([category, stats]) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 border border-slate-100"
                >
                  <div>
                    <span className="font-medium text-slate-900">{category}</span>
                    <p className="text-[11px] text-slate-600">
                      {stats.count} items • {stats.stock} total stock
                    </p>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 text-[10px]">
                    {stats.count} items
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Most used items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xs">
            {topUsedItems.length === 0 ? (
              <p className="text-slate-500">No usage data yet.</p>
            ) : (
              <div className="space-y-2">
                {topUsedItems.map((item, idx) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-md bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 border border-purple-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-200 text-purple-800 text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-900">{item.name}</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 text-[10px]">
                      {item.quantity} issued
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Recent usage activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs">
          {recentUsage.length === 0 ? (
            <p className="text-slate-500">No usage records yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-xs">
                <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Item</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Quantity</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Issued</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Returned</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsage.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white"
                    >
                      <td className="px-3 py-2 font-medium text-slate-900">{u.itemName}</td>
                      <td className="px-3 py-2 text-slate-700 font-semibold">{u.quantity}</td>
                      <td className="px-3 py-2 text-slate-600">{u.issuedDate}</td>
                      <td className="px-3 py-2 text-slate-600">
                        {u.returnedDate || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          className={
                            u.returnedDate
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }
                          style={{ fontSize: "10px" }}
                        >
                          {u.returnedDate ? "Returned" : "Active"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
