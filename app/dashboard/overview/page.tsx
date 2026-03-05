'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

export default function OverviewPage() {
  const kpis = [
    { label: "Total Revenue", value: "$45,231", change: "+12.5%", trend: "up" },
    { label: "Occupancy Rate", value: "87%", change: "+5.2%", trend: "up" },
    { label: "Available Rooms", value: "23", change: "-2", trend: "down" },
    { label: "Check-ins Today", value: "12", change: "+3", trend: "up" },
  ]

  const revenueData = [
    { name: "Mon", value: 4200 },
    { name: "Tue", value: 3800 },
    { name: "Wed", value: 5200 },
    { name: "Thu", value: 4800 },
    { name: "Fri", value: 6200 },
    { name: "Sat", value: 7100 },
    { name: "Sun", value: 5900 },
  ]

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">KPI Overview</h1>
        <p className="text-xs text-gray-500 mt-0.5">Daily performance metrics and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <div className="text-xl font-bold text-gray-900">{kpi.value}</div>
                <div className="flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">{kpi.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={35} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  )
}
