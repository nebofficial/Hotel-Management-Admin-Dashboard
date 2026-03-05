'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function OccupancyReportPage() {
  const monthlyData = [
    { month: "Jan", rate: 78 },
    { month: "Feb", rate: 82 },
    { month: "Mar", rate: 85 },
    { month: "Apr", rate: 88 },
    { month: "May", rate: 91 },
    { month: "Jun", rate: 87 },
  ]

  const metrics = [
    { label: "Current Rate", value: "87%" },
    { label: "Avg Monthly", value: "85%" },
    { label: "Highest", value: "91%" },
    { label: "Lowest", value: "78%" },
  ]

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Occupancy Report</h1>
        <p className="text-xs text-gray-500 mt-0.5">6-month occupancy analytics</p>
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
          <CardTitle className="text-sm font-semibold">6-Month Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={35} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="rate" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  )
}
