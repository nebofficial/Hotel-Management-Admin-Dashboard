'use client'

import { useMemo, useState } from "react"
import type { BarInventoryItem, BarOrder } from "./BarOrderTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Package } from "lucide-react"
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Period = "Daily" | "Weekly" | "Monthly"

function dateKey(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function monthKey(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  return `${yyyy}-${mm}`
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

interface Props {
  orders: BarOrder[]
  inventory: BarInventoryItem[]
}

export default function BarOnlyReports({ orders, inventory }: Props) {
  const [period, setPeriod] = useState<Period>("Daily")

  const served = useMemo(() => orders.filter((o) => o.status === "Served"), [orders])

  const revenueSeries = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number }>()
    served.forEach((o) => {
      const d = o.createdAt ? new Date(o.createdAt) : new Date()
      const key =
        period === "Daily"
          ? dateKey(d)
          : period === "Weekly"
            ? dateKey(startOfWeek(d))
            : monthKey(d)
      const label =
        period === "Daily"
          ? key.slice(5)
          : period === "Weekly"
            ? `Wk ${key.slice(5)}`
            : key
      const cur = map.get(key) || { name: label, revenue: 0 }
      cur.revenue += Number(o.totalAmount || 0)
      map.set(key, cur)
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([, v]) => ({ name: v.name, revenue: Math.round(v.revenue) }))
  }, [served, period])

  const topDrinks = useMemo(() => {
    const map = new Map<string, number>()
    served.forEach((o) => {
      o.items?.forEach((i) => {
        map.set(i.name, (map.get(i.name) || 0) + Number(i.quantity || 0))
      })
    })
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, qty]) => ({ name, qty }))
  }, [served])

  const lowStock = useMemo(
    () => inventory.filter((i) => i.currentStock <= i.reorderLevel),
    [inventory],
  )

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-slate-900 to-indigo-900 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Bar-only Reports
            <Badge className="bg-white/15 text-white border-none">
              Daily / Weekly / Monthly
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Revenue snapshots, top-selling drinks, and low-stock list. (Frontend
          visualization)
        </CardContent>
      </Card>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs">
          <TabsTrigger value="Daily">Daily</TabsTrigger>
          <TabsTrigger value="Weekly">Weekly</TabsTrigger>
          <TabsTrigger value="Monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="space-y-3">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Revenue ({period})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueSeries} margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Top drinks (served)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {topDrinks.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No served drinks yet.
              </div>
            ) : (
              <div className="overflow-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-slate-700">
                        Drink
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-slate-700">
                        Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDrinks.map((d) => (
                      <tr
                        key={d.name}
                        className="border-b border-slate-100 hover:bg-slate-50/50"
                      >
                        <td className="px-3 py-2 font-medium text-slate-900">
                          {d.name}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-700">
                          {d.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Low stock items ({lowStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {lowStock.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No low stock warnings.
              </div>
            ) : (
              lowStock.slice(0, 10).map((it) => (
                <div
                  key={it.id}
                  className="rounded-lg border border-red-100 bg-red-50 p-3"
                >
                  <div className="text-sm font-semibold text-red-900 truncate">
                    {it.name}
                  </div>
                  <div className="text-xs text-red-800 mt-0.5">
                    Stock: {it.currentStock} • Reorder: {it.reorderLevel}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

