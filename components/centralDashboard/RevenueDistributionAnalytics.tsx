"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#8b5cf6"]

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function RevenueDistributionAnalytics(p: { byProperty: { name: string; value: number }[]; loading?: boolean }) {
  const { byProperty, loading } = p
  const data = (byProperty || []).map((x) => ({ name: (x.name || "").slice(0, 12), value: x.value }))

  if (loading) return <div className="flex h-56 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700">Loading...</div>
  if (data.length === 0) return <div className="flex h-56 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700">No data.</div>

  return (
    <div className="rounded-xl bg-gradient-to-br from-red-500 to-rose-600 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/95">Revenue Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => [fmt(v), "Revenue"]} contentStyle={{ background: "rgba(0,0,0,0.8)", borderRadius: 8, color: "white" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
