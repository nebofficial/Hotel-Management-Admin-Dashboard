"use client"

import { PieChart as PieIcon } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

interface DistributionItem {
  name: string
  value: number
  share?: number
}

interface RevenueDistributionChartProps {
  byProperty: DistributionItem[]
  totalRevenue: number
  loading?: boolean
}

const COLORS = ["#f59e0b", "#eab308", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4"]

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function RevenueDistributionChart({
  byProperty,
  totalRevenue,
  loading,
}: RevenueDistributionChartProps) {
  const chartData = byProperty.map((p) => ({
    name: p.name?.slice(0, 14) || "—",
    value: p.value,
    fullName: p.name,
  }))

  return (
    <div className="rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-900/90">
        <PieIcon className="h-4 w-4" />
        Revenue Distribution
      </h3>
      {loading ? (
        <div className="flex h-56 items-center justify-center text-gray-800">Loading…</div>
      ) : chartData.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-gray-800">
          No revenue data.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis type="number" tickFormatter={(v) => fmt(v)} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number) => [fmt(value), "Revenue"]}
                contentStyle={{ borderRadius: 8 }}
              />
              <Bar dataKey="value" fill="#b45309" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={180}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [fmt(value), "Revenue"]}
                contentStyle={{ borderRadius: 8 }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
