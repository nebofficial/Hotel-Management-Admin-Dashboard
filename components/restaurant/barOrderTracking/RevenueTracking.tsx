'use client'

import { useMemo, useState } from "react"
import type { BarOrder } from "./BarOrderTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts"

type Period = "Daily" | "Weekly"

function dateKey(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay() // 0=Sun
  const diff = (day + 6) % 7 // make Monday start
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

interface Props {
  orders: BarOrder[]
}

export default function RevenueTracking({ orders }: Props) {
  const [period, setPeriod] = useState<Period>("Daily")

  const served = useMemo(() => orders.filter((o) => o.status === "Served"), [orders])

  const totals = useMemo(() => {
    const gross = served.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
    const discounts = served.reduce((sum, o) => sum + Number(o.happyHourDiscount || 0), 0)
    const tickets = served.length
    const avg = tickets ? gross / tickets : 0
    return { gross, discounts, tickets, avg }
  }, [served])

  const dailyData = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; tickets: number }>()
    served.forEach((o) => {
      const k = o.createdAt ? dateKey(new Date(o.createdAt)) : dateKey(new Date())
      const cur = map.get(k) || { name: k.slice(5), revenue: 0, tickets: 0 }
      cur.revenue += Number(o.totalAmount || 0)
      cur.tickets += 1
      map.set(k, cur)
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([, v]) => ({
        name: v.name,
        revenue: Math.round(v.revenue),
        tickets: v.tickets,
      }))
  }, [served])

  const weeklyData = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; tickets: number }>()
    served.forEach((o) => {
      const d = o.createdAt ? new Date(o.createdAt) : new Date()
      const wk = startOfWeek(d)
      const k = dateKey(wk)
      const cur = map.get(k) || { name: `Wk ${k.slice(5)}`, revenue: 0, tickets: 0 }
      cur.revenue += Number(o.totalAmount || 0)
      cur.tickets += 1
      map.set(k, cur)
    })
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-10)
      .map(([, v]) => ({
        name: v.name,
        revenue: Math.round(v.revenue),
        tickets: v.tickets,
      }))
  }, [served])

  const data = period === "Daily" ? dailyData : weeklyData

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-emerald-600 to-green-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue Tracking
            <Badge className="bg-white/15 text-white border-none">
              Charts & cards
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Daily / weekly revenue from Served bar orders. (Frontend visualization; backend reports endpoint is also provided.)
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Gross revenue
            </div>
            <div className="text-lg font-semibold text-slate-900">
              ₹{totals.gross.toFixed(0)}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Discounts
            </div>
            <div className="text-lg font-semibold text-slate-900">
              ₹{totals.discounts.toFixed(0)}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Tickets served
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {totals.tickets.toString().padStart(2, "0")}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Avg ticket
            </div>
            <div className="text-lg font-semibold text-slate-900">
              ₹{totals.avg.toFixed(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs">
          <TabsTrigger value="Daily">Daily</TabsTrigger>
          <TabsTrigger value="Weekly">Weekly</TabsTrigger>
        </TabsList>

        <TabsContent value="Daily" className="space-y-3">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Revenue (last 14 days)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Weekly" className="space-y-3">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Revenue trend (weekly)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ left: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Revenue table ({data.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="overflow-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Period
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">
                    Tickets
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-10 text-center text-slate-400"
                    >
                      No served orders yet.
                    </td>
                  </tr>
                ) : (
                  data.map((r) => (
                    <tr
                      key={r.name}
                      className="border-b border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="px-3 py-2 font-medium text-slate-900">
                        {r.name}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-700">
                        {r.tickets}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold text-slate-900">
                        ₹{r.revenue.toFixed(0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

