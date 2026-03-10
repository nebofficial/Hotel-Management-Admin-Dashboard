"use client"

import { BarChart2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

function fmt(n) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n) }

export function PropertyRevenueChart(p) {
  const { byProperty, loading } = p
  const data = (byProperty || []).map((x) => ({ name: (x.name || x.hotelName || "").slice(0, 14), value: x.value ?? x.revenue ?? 0 }))
  if (loading) return <div className="flex h-56 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">Loading...</div>
  if (data.length === 0) return <div className="flex h-56 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">No data.</div>
  return (
    <div className="rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><BarChart2 className="h-4 w-4" /> Property-wise Revenue</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} width={50} tickFormatter={(v) => fmt(v).slice(0, 8)} />
          <Tooltip formatter={(v) => [fmt(v), "Revenue"]} />
          <Bar dataKey="value" fill="#b45309" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
