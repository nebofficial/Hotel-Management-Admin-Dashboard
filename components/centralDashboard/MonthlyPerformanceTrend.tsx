"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

function fmt(n) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n) }

export function MonthlyPerformanceTrend(p) {
  const { trends, loading } = p
  const data = (trends || []).map((t) => ({ month: t.month, revenue: t.totalRevenue ?? 0, bookings: t.totalBookings ?? 0 }))
  if (loading) return <div className="flex h-56 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">Loading...</div>
  if (data.length === 0) return <div className="flex h-56 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">No data.</div>
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase text-white">Monthly Performance Trends</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
          <XAxis dataKey="month" tick={{ fill: "white", fontSize: 10 }} />
          <YAxis tick={{ fill: "white", fontSize: 10 }} width={45} />
          <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", borderRadius: 8, color: "white" }} formatter={(v, name) => [name === "revenue" ? fmt(v) : v, name]} />
          <Line type="monotone" dataKey="revenue" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="bookings" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
