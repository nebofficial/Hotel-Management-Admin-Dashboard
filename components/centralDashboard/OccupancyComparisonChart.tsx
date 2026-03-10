"use client"

import { BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Props { properties: { hotelName: string; occupancyRate: number }[]; loading?: boolean }
export function OccupancyComparisonChart(p: Props) {
  const { properties, loading } = p
  const data = (properties || []).map((x) => ({ name: (x.hotelName || "").slice(0, 12), rate: x.occupancyRate ?? 0 }))
  if (loading) return <div className="flex h-56 items-center justify-center rounded-xl border border-purple-200 bg-purple-50">Loading...</div>
  if (data.length === 0) return <div className="flex h-56 items-center justify-center rounded-xl border border-purple-200 bg-purple-50">No data.</div>
  return (
    <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><BarChart3 className="h-4 w-4" /> Occupancy Comparison</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
          <XAxis dataKey="name" tick={{ fill: "white", fontSize: 11 }} />
          <YAxis tick={{ fill: "white", fontSize: 11 }} width={36} tickFormatter={(v) => v + "%"} />
          <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", borderRadius: 8, color: "white" }} />
          <Bar dataKey="rate" fill="rgba(255,255,255,0.9)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
