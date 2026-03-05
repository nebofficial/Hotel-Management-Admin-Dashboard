'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Radio } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function RealTimeAvailability({ tables, onRefresh }: Props) {
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      onRefresh()
      setLastUpdate(new Date())
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, onRefresh])

  const statusCounts = {
    Available: tables.filter((t) => t.status === "Available").length,
    Occupied: tables.filter((t) => t.status === "Occupied").length,
    Reserved: tables.filter((t) => t.status === "Reserved").length,
    Cleaning: tables.filter((t) => t.status === "Cleaning").length,
    "Out of Service": tables.filter((t) => t.status === "Out of Service").length,
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Real-time availability
            </div>
            <div className="text-lg font-semibold">
              {statusCounts.Available} available
            </div>
          </div>
          <Radio className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Live status
            </CardTitle>
            <div className="flex items-center gap-2">
              <button
                type="button"
                title={autoRefresh ? "Turn off auto refresh" : "Turn on auto refresh"}
                aria-label={autoRefresh ? "Turn off auto refresh" : "Turn on auto refresh"}
                onClick={() => {
                  setAutoRefresh(!autoRefresh)
                  if (!autoRefresh) {
                    onRefresh()
                    setLastUpdate(new Date())
                  }
                }}
                className={`h-6 px-2 rounded text-[10px] border transition-colors ${
                  autoRefresh
                    ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {autoRefresh ? "Auto ON" : "Auto OFF"}
              </button>
              <button
                type="button"
                title="Refresh now"
                aria-label="Refresh table availability"
                onClick={() => {
                  onRefresh()
                  setLastUpdate(new Date())
                }}
                className="h-6 w-6 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-center"
              >
                <div className="text-xs font-semibold text-slate-900">{count}</div>
                <div className="text-[10px] text-slate-500">{status}</div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-200">
            Last updated: {lastUpdate.toLocaleTimeString()}
            {autoRefresh && " • Auto-refresh every 10s"}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Quick status overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-1.5">
            {tables.map((table) => (
              <div
                key={table.id}
                className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50/50"
              >
                <div className="text-xs font-medium text-slate-900">
                  {table.tableNo}
                </div>
                <Badge
                  className={`text-[10px] ${
                    table.status === "Available"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : table.status === "Occupied"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : table.status === "Reserved"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : table.status === "Cleaning"
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {table.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
