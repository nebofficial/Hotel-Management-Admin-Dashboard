"use client"

import { BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface OccupancyItem {
  hotelName: string
  occupancyRate: number
  totalRooms: number
  occupied: number
}

interface OccupancyOverviewProps {
  properties: OccupancyItem[]
  loading?: boolean
}

function fmt(n: number) {
  return `${n.toFixed(1)}%`
}

export function OccupancyOverview({ properties, loading }: OccupancyOverviewProps) {
  const chartData = properties.map((p) => ({
    name: p.hotelName?.slice(0, 12) || "—",
    rate: p.occupancyRate ?? 0,
    fullName: p.hotelName,
  }))

  return (
    <div className="rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/95">
        <BarChart3 className="h-4 w-4" />
        Occupancy Analytics by Property
      </h3>
      {loading ? (
        <div className="flex h-48 items-center justify-center text-white/80">Loading…</div>
      ) : chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-white/80">
          No occupancy data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
            <XAxis dataKey="name" tick={{ fill: "white", fontSize: 11 }} />
            <YAxis tick={{ fill: "white", fontSize: 11 }} width={36} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.8)",
                border: "none",
                borderRadius: 8,
                color: "white",
              }}
              formatter={(value: number) => [fmt(value), "Occupancy"]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName}
            />
            <Bar dataKey="rate" fill="rgba(255,255,255,0.9)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
