'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, CheckCircle2, XCircle, ChefHat } from "lucide-react"
import type { KitchenKOT } from "./KitchenKOT"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  kots: KitchenKOT[]
  onRefresh: () => void
}

export default function OrderStatusTracking({ kots, onRefresh }: Props) {
  const { user } = useAuth()
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleStatusChange = async (kotId: string, newStatus: KitchenKOT["status"]) => {
    if (!user?.hotelId) return

    setUpdating(kotId)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/kitchen-kots/${kotId}`,
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
        throw new Error((data as any)?.message || `Failed to update status (HTTP ${res.status})`)
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: KitchenKOT["status"]) => {
    const colors = {
      Pending: "bg-blue-100 text-blue-700 border-blue-200",
      Preparing: "bg-purple-100 text-purple-700 border-purple-200",
      Ready: "bg-green-100 text-green-700 border-green-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
      Completed: "bg-slate-100 text-slate-700 border-slate-200",
    }
    return colors[status] || colors.Pending
  }

  const statusGroups: Record<KitchenKOT["status"], KitchenKOT[]> = {
    Pending: [],
    Preparing: [],
    Ready: [],
    Cancelled: [],
    Completed: [],
  }

  kots.forEach((kot) => {
    if (statusGroups[kot.status]) {
      statusGroups[kot.status].push(kot)
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

      {(["Pending", "Preparing", "Ready", "Cancelled", "Completed"] as const).map((status) => (
        <Card key={status} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              {status === "Pending" && <Clock className="h-4 w-4 text-blue-600" />}
              {status === "Preparing" && <ChefHat className="h-4 w-4 text-purple-600" />}
              {status === "Ready" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              {status === "Cancelled" && <XCircle className="h-4 w-4 text-red-600" />}
              {status === "Completed" && <CheckCircle2 className="h-4 w-4 text-slate-600" />}
              {status} ({statusGroups[status].length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-2">
              {statusGroups[status].length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  No KOTs with this status
                </div>
              ) : (
                statusGroups[status].map((kot) => (
                  <div
                    key={kot.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-900 font-mono">{kot.kotNumber}</span>
                        <Badge className={`border text-[10px] ${getStatusColor(kot.status)}`}>
                          {kot.status}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Table {kot.tableNo} • {kot.items.length} items
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-2">
                      {(["Pending", "Preparing", "Ready", "Cancelled", "Completed"] as const)
                        .filter((s) => s !== status)
                        .slice(0, 2)
                        .map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleStatusChange(kot.id, s)}
                            disabled={updating === kot.id}
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
