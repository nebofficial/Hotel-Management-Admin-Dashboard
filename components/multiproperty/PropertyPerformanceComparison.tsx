"use client"

import { BarChart2 } from "lucide-react"

interface PropertyRow {
  hotelName: string
  occupancyRate: number
  revenue: number
  averageDailyRate: number
  revPAR: number
}

interface PropertyPerformanceComparisonProps {
  properties: PropertyRow[]
  loading?: boolean
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

export function PropertyPerformanceComparison(props: PropertyPerformanceComparisonProps) {
  const { properties, loading } = props
  return (
    <div className="rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-700 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/95">
        <BarChart2 className="h-4 w-4" /> Property Performance Comparison
      </h3>
      {loading ? <div className="flex h-32 items-center justify-center text-white/80">Loading...</div> : properties.length === 0 ? <div className="flex h-32 items-center justify-center text-white/80">No data.</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/30 text-left">
                <th className="py-2 text-white/90">Property</th>
                <th className="py-2 text-right text-white/90">Occupancy</th>
                <th className="py-2 text-right text-white/90">Revenue</th>
                <th className="py-2 text-right text-white/90">ADR</th>
                <th className="py-2 text-right text-white/90">RevPAR</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.hotelName} className="border-b border-white/20 text-white/95">
                  <td className="py-2 font-medium">{p.hotelName}</td>
                  <td className="py-2 text-right">{p.occupancyRate?.toFixed(1) ?? 0}%</td>
                  <td className="py-2 text-right">{fmt(p.revenue ?? 0)}</td>
                  <td className="py-2 text-right">{fmt(p.averageDailyRate ?? 0)}</td>
                  <td className="py-2 text-right">{fmt(p.revPAR ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
