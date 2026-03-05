"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

interface DashboardOverviewProps {
  title: string
  description: string
  metrics?: Array<{
    label: string
    value: string | number
    change?: string
    trend?: "up" | "down"
  }>
  chartData?: Array<{ name: string; value: number; [key: string]: any }>
  chartType?: "line" | "bar" | "pie"
}

export function DashboardOverview({
  title,
  description,
  metrics = [],
  chartData = [],
  chartType = "bar",
}: DashboardOverviewProps) {
  const colors = ["#dc2626", "#f97316", "#eab308", "#22c55e", "#06b6d4"]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>

      {/* Metrics Grid */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="border border-gray-200 shadow-xs rounded-md">
              <CardContent className="p-2.5">
                <p className="text-xs text-gray-600 font-medium mb-1">{metric.label}</p>
                <div className="flex items-end justify-between">
                  <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                  {metric.change && (
                    <div className="flex items-center gap-0.5">
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          metric.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="border border-gray-200 shadow-xs">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold">Overview Chart</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ResponsiveContainer width="100%" height={220}>
              {chartType === "line" && (
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={35} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={1.5} dot={{ r: 3 }} />
                </LineChart>
              )}
              {chartType === "bar" && (
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={35} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
              {chartType === "pie" && (
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={{ fontSize: 11 }} outerRadius={70} fill="#dc2626" dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          <CardDescription className="text-xs">Latest updates and changes</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-gray-600">Recent activity will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
