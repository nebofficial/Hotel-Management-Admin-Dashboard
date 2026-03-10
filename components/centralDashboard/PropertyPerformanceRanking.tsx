"use client"

import { Trophy } from "lucide-react"

function fmt(n) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(n) }

export function PropertyPerformanceRanking(p) {
  const { properties, loading } = p
  const sorted = [...(properties || [])].sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0))
  if (loading) return <div className="flex h-40 items-center justify-center rounded-xl border border-orange-200 bg-orange-50">Loading...</div>
  if (sorted.length === 0) return <div className="flex h-40 items-center justify-center rounded-xl border border-orange-200 bg-orange-50">No data.</div>
  return (
    <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-white"><Trophy className="h-4 w-4" /> Property Performance Ranking</h3>
      <ol className="space-y-2">
        {sorted.slice(0, 6).map((prop, i) => (
          <li key={prop.hotelName} className="flex justify-between rounded-lg bg-white/15 px-3 py-2 text-white">
            <span>#{i + 1} {prop.hotelName}</span>
            <span>{fmt(prop.revenue ?? 0)} | {(prop.occupancyRate ?? 0).toFixed(0)}%</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
