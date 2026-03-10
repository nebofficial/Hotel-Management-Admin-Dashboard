"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface MultiPropertyAnalyticsChartsProps {
  revenueByProperty: { name: string; value: number }[]
  occupancyByProperty: { name: string; rate: number }[]
  loading?: boolean
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function MultiPropertyAnalyticsCharts({
  revenueByProperty,
  occupancyByProperty,
  loading,
}: MultiPropertyAnalyticsChartsProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/95">
        Visual Analytics Dashboard
      </h3>
      {loading ? (
        <div className="flex h-48 items-center justify-center text-white/80">Loading…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-medium text-white/80">Revenue Trend by Property</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={revenueByProperty}
                margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                <XAxis dataKey="name" tick={{ fill: "white", fontSize: 10 }} />
                <YAxis tick={{ fill: "white", fontSize: 10 }} width={40} tickFormatter={(v) => fmt(v).slice(0, 6)} />
                <Tooltip
                  formatter={(v: number) => [fmt(v), "Revenue"]}
                  contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8, color: "white" }}
                />
                <Bar dataKey="value" fill="rgba(255,255,255,0.9)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-white/80">Occupancy Trend by Property</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart
                data={occupancyByProperty}
                margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                <XAxis dataKey="name" tick={{ fill: "white", fontSize: 10 }} />
                <YAxis tick={{ fill: "white", fontSize: 10 }} width={36} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, "Occupancy"]}
                  contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none", borderRadius: 8, color: "white" }}
                />
                <Line type="monotone" dataKey="rate" stroke="rgba(255,255,255,0.95)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
