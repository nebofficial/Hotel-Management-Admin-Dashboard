'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, XCircle, Clock, Wrench } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function TableStatusTracking({ tables, onRefresh }: Props) {
  const { user } = useAuth()
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleStatusChange = async (tableId: string, newStatus: RestaurantTable["status"]) => {
    if (!user?.hotelId) return

    setUpdating(tableId)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables/${tableId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update status (HTTP ${res.status})`,
        )
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: RestaurantTable["status"]) => {
    const colors = {
      Available: "bg-green-100 text-green-700 border-green-200",
      Occupied: "bg-red-100 text-red-700 border-red-200",
      Reserved: "bg-purple-100 text-purple-700 border-purple-200",
      Cleaning: "bg-amber-100 text-amber-700 border-amber-200",
      "Out of Service": "bg-slate-100 text-slate-700 border-slate-200",
    }
    return colors[status] || colors.Available
  }

  const statusGroups: Record<RestaurantTable["status"], RestaurantTable[]> = {
    Available: [],
    Occupied: [],
    Reserved: [],
    Cleaning: [],
    "Out of Service": [],
  }

  tables.forEach((table) => {
    if (statusGroups[table.status]) {
      statusGroups[table.status].push(table)
    }
  })

  return (
    <section className="space-y-3">
      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      {(["Available", "Occupied", "Reserved", "Cleaning", "Out of Service"] as const).map((status) => (
        <Card key={status} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              {status === "Available" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              {status === "Occupied" && <XCircle className="h-4 w-4 text-red-600" />}
              {status === "Reserved" && <Clock className="h-4 w-4 text-purple-600" />}
              {status === "Cleaning" && <Wrench className="h-4 w-4 text-amber-600" />}
              {status === "Out of Service" && <XCircle className="h-4 w-4 text-slate-600" />}
              {status} ({statusGroups[status].length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {statusGroups[status].length === 0 ? (
                <div className="col-span-full py-4 text-center text-xs text-slate-400">
                  No tables with this status
                </div>
              ) : (
                statusGroups[status].map((table) => (
                  <div
                    key={table.id}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-900">
                        {table.tableNo}
                      </span>
                      <Badge className={`border text-[10px] ${getStatusColor(table.status)}`}>
                        {table.status}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Capacity: {table.capacity}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(["Available", "Occupied", "Reserved", "Cleaning", "Out of Service"] as const)
                        .filter((s) => s !== status)
                        .slice(0, 2)
                        .map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStatusChange(table.id, s)}
                            disabled={updating === table.id}
                            className="h-5 px-1.5 rounded text-[10px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                          >
                            {s.slice(0, 4)}
                          </button>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
