'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RevenueReportPage() {
  const data = [
    { month: "Jan", value: 38000 },
    { month: "Feb", value: 42000 },
    { month: "Mar", value: 41000 },
    { month: "Apr", value: 45000 },
    { month: "May", value: 48000 },
    { month: "Jun", value: 47000 },
  ]

  const metrics = [
    { label: "Total Revenue", value: "$251,000" },
    { label: "Monthly Avg", value: "$41,833" },
    { label: "Highest Month", value: "$48,000" },
    { label: "Growth", value: "+23.7%" },
  ]

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Revenue Report</h1>
        <p className="text-xs text-gray-500 mt-0.5">6-month revenue analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">{metric.label}</p>
              <div className="text-xl font-bold text-gray-900">{metric.value}</div>
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
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
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
