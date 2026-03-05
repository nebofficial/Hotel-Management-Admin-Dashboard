'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Grid3x3 } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function FloorLayoutView({ tables, onRefresh }: Props) {
  const { user } = useAuth()
  const [selectedFloor, setSelectedFloor] = useState<string>("All")
  const [error, setError] = useState<string | null>(null)

  const floors = Array.from(new Set(tables.map((t) => t.floor).filter(Boolean))) as string[]
  const filteredTables = selectedFloor === "All"
    ? tables
    : tables.filter((t) => t.floor === selectedFloor)

  const getStatusColor = (status: RestaurantTable["status"]) => {
    const colors = {
      Available: "bg-green-500",
      Occupied: "bg-red-500",
      Reserved: "bg-purple-500",
      Cleaning: "bg-amber-500",
      "Out of Service": "bg-slate-400",
    }
    return colors[status] || colors.Available
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-pink-500 via-rose-500 to-red-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Floor layout view
            </div>
            <div className="text-lg font-semibold">
              {filteredTables.length} tables
            </div>
          </div>
          <Grid3x3 className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Visual floor layout
            </CardTitle>
            {floors.length > 0 && (
              <select
                aria-label="Select floor"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="h-7 px-2 rounded-md border border-slate-200 bg-white text-xs"
              >
                <option value="All">All floors</option>
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
              </select>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {filteredTables.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No tables to display. Add tables first.
            </div>
          ) : (
            <div
              className="grid grid-cols-6 gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200"
            >
              {filteredTables.map((table) => (
                <div
                  key={table.id}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-1.5 transition-all ${
                    table.status === "Available"
                      ? "border-green-300 bg-green-50"
                      : table.status === "Occupied"
                      ? "border-red-300 bg-red-50"
                      : table.status === "Reserved"
                      ? "border-purple-300 bg-purple-50"
                      : table.status === "Cleaning"
                      ? "border-amber-300 bg-amber-50"
                      : "border-slate-300 bg-slate-50"
                  }`}
                  title={`${table.tableNo} - ${table.status} - Capacity: ${table.capacity}`}
                >
                  <div className="text-[10px] font-semibold text-slate-900">
                    {table.tableNo}
                  </div>
                  <div className="text-[9px] text-slate-600 mt-0.5">
                    {table.capacity}
                  </div>
                  <div
                    className={`h-1.5 w-1.5 rounded-full mt-0.5 ${getStatusColor(table.status)}`}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-[10px] text-slate-600">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-[10px] text-slate-600">Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <span className="text-[10px] text-slate-600">Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-[10px] text-slate-600">Cleaning</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
