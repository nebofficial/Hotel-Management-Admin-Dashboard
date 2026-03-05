'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

export default function RevenuePage() {
  const revenue = [
    { label: "Room Revenue", value: "$28,450", change: "+8.2%", trend: "up" },
    { label: "Restaurant Revenue", value: "$12,300", change: "+5.1%", trend: "up" },
    { label: "Other Revenue", value: "$4,481", change: "+2.3%", trend: "up" },
    { label: "Total Revenue", value: "$45,231", change: "+12.5%", trend: "up" },
  ]

  const revenueData = [
    { name: "Jan", value: 38000 },
    { name: "Feb", value: 41000 },
    { name: "Mar", value: 39000 },
    { name: "Apr", value: 44000 },
    { name: "May", value: 46000 },
    { name: "Jun", value: 45000 },
  ]

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Revenue Summary</h1>
        <p className="text-xs text-gray-500 mt-0.5">Income breakdown and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {revenue.map((item, idx) => (
          <Card key={idx} className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">{item.label}</p>
              <div className="flex items-end justify-between">
                <div className="text-xl font-bold text-gray-900">{item.value}</div>
                <div className="flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">{item.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">6-Month Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={35} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={1.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  )
}
