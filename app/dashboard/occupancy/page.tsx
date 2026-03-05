'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function OccupancyPage() {
  const occupancyData = [
    { name: "Occupied", value: 87 },
    { name: "Available", value: 13 },
  ]

  const roomStatus = [
    { status: "Occupied", count: 87, percentage: "87%", color: "bg-red-600" },
    { status: "Available", count: 13, percentage: "13%", color: "bg-green-600" },
  ]

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Occupancy Rate</h1>
        <p className="text-xs text-gray-500 mt-0.5">Room occupancy details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {roomStatus.map((item) => (
          <Card key={item.status} className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">{item.status}</p>
              <div className="flex items-end justify-between">
                <div className="text-xl font-bold text-gray-900">{item.count}</div>
                <div className={`text-xs font-semibold ${item.status === "Occupied" ? "text-red-600" : "text-green-600"}`}>
                  {item.percentage}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Occupancy Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={occupancyData} cx="50%" cy="50%" labelLine={false} label={{ fontSize: 11 }} outerRadius={60} fill="#dc2626" dataKey="value">
                <Cell fill="#dc2626" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  )
}
