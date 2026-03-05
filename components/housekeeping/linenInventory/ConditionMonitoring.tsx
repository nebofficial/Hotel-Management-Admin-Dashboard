"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Package } from "lucide-react"

export type ConditionStatus = "New" | "Good" | "Worn" | "Damaged"

export interface ConditionRecord {
  id: string
  itemName: string
  condition: ConditionStatus
  quantity: number
}

interface ConditionMonitoringProps {
  usage: ConditionRecord[]
}

export function ConditionMonitoring({ usage }: ConditionMonitoringProps) {
  const byCondition = new Map<ConditionStatus, number>()
  usage.forEach((u) => {
    const current = byCondition.get(u.condition) || 0
    byCondition.set(u.condition, current + u.quantity)
  })

  const newCount = byCondition.get("New") || 0
  const goodCount = byCondition.get("Good") || 0
  const wornCount = byCondition.get("Worn") || 0
  const damagedCount = byCondition.get("Damaged") || 0
  const total = newCount + goodCount + wornCount + damagedCount

  const conditionStats = [
    {
      label: "New",
      count: newCount,
      color: "bg-emerald-100 text-emerald-800",
      bgGradient: "from-emerald-50 to-emerald-100",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
    },
    {
      label: "Good",
      count: goodCount,
      color: "bg-blue-100 text-blue-800",
      bgGradient: "from-blue-50 to-blue-100",
      icon: Package,
      iconColor: "text-blue-600",
    },
    {
      label: "Worn",
      count: wornCount,
      color: "bg-amber-100 text-amber-800",
      bgGradient: "from-amber-50 to-amber-100",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
    },
    {
      label: "Damaged",
      count: damagedCount,
      color: "bg-rose-100 text-rose-800",
      bgGradient: "from-rose-50 to-rose-100",
      icon: XCircle,
      iconColor: "text-rose-600",
    },
  ]

  const byItem = new Map<string, Map<ConditionStatus, number>>()
  usage.forEach((u) => {
    if (!byItem.has(u.itemName)) {
      byItem.set(u.itemName, new Map())
    }
    const itemMap = byItem.get(u.itemName)!
    const current = itemMap.get(u.condition) || 0
    itemMap.set(u.condition, current + u.quantity)
  })

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {conditionStats.map((stat) => {
          const Icon = stat.icon
          const percentage = total > 0 ? Math.round((stat.count / total) * 100) : 0
          return (
            <Card
              key={stat.label}
              className={`border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br ${stat.bgGradient}`}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 ${stat.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-700">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.count}</p>
                  <p className="text-[10px] text-slate-600">{percentage}% of total</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Condition by item
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-xs">
              <thead className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Item</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">New</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Good</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Worn</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Damaged</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(byItem.entries()).map(([itemName, conditions]) => {
                  const itemNew = conditions.get("New") || 0
                  const itemGood = conditions.get("Good") || 0
                  const itemWorn = conditions.get("Worn") || 0
                  const itemDamaged = conditions.get("Damaged") || 0
                  const itemTotal = itemNew + itemGood + itemWorn + itemDamaged
                  return (
                    <tr
                      key={itemName}
                      className="border-b border-slate-100 hover:bg-linear-to-r hover:from-slate-50 hover:to-white"
                    >
                      <td className="px-3 py-2 font-medium text-slate-900">{itemName}</td>
                      <td className="px-3 py-2 text-center">
                        {itemNew > 0 && (
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                            {itemNew}
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {itemGood > 0 && (
                          <Badge className="bg-blue-100 text-blue-800 text-[10px]">
                            {itemGood}
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {itemWorn > 0 && (
                          <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                            {itemWorn}
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {itemDamaged > 0 && (
                          <Badge className="bg-rose-100 text-rose-800 text-[10px]">
                            {itemDamaged}
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center font-semibold text-slate-900">
                        {itemTotal}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
