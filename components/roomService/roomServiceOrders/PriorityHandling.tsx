'use client'

import { useMemo, useState } from "react"
import type { RoomServiceOrder, RoomServicePriority } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Star, Zap } from "lucide-react"

interface Props {
  orders: RoomServiceOrder[]
  onUpdateOrder: (
    id: string,
    patch: Partial<RoomServiceOrder> & { autoChargeToRoomBill?: boolean },
  ) => Promise<any>
}

function priorityBadge(priority: RoomServicePriority) {
  switch (priority) {
    case "VIP":
      return "bg-purple-100 text-purple-700 border-purple-200"
    case "Urgent":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

export default function PriorityHandling({ orders, onUpdateOrder }: Props) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const vip = useMemo(() => {
    return orders.filter((o) => o.priority === "VIP")
  }, [orders])

  const urgent = useMemo(() => {
    return orders.filter((o) => o.priority === "Urgent")
  }, [orders])

  const normal = useMemo(() => {
    return orders.filter((o) => o.priority === "Normal")
  }, [orders])

  const setPriority = async (orderId: string, priority: RoomServicePriority) => {
    setError(null)
    setUpdating(orderId)
    try {
      await onUpdateOrder(orderId, { priority })
    } catch (e: any) {
      setError(e?.message || "Failed to update priority")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Star className="h-4 w-4" />
            Priority Handling
            <Badge className="bg-white/15 text-white border-none">
              VIP & urgent tagging
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Mark orders as High Priority (VIP / Urgent) for faster handling and
          special attention.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <Card className="rounded-2xl border border-red-200 bg-red-50 shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-red-900 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Urgent ({urgent.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {urgent.length === 0 ? (
              <div className="py-8 text-center text-sm text-red-700">
                No urgent orders.
              </div>
            ) : (
              urgent.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-red-200 bg-white p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-red-900 truncate">
                        {o.orderNumber || "—"} • Room {o.roomNumber}
                      </div>
                      <div className="text-xs text-red-800 mt-0.5">
                        {o.guestName || "Guest"}
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                      Urgent
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={updating === o.id}
                      onClick={() => setPriority(o.id, "Normal")}
                    >
                      Normal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={updating === o.id}
                      onClick={() => setPriority(o.id, "VIP")}
                    >
                      VIP
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-purple-200 bg-purple-50 shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-purple-900 flex items-center gap-2">
              <Star className="h-4 w-4" />
              VIP ({vip.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {vip.length === 0 ? (
              <div className="py-8 text-center text-sm text-purple-700">
                No VIP orders.
              </div>
            ) : (
              vip.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-purple-200 bg-white p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-purple-900 truncate">
                        {o.orderNumber || "—"} • Room {o.roomNumber}
                      </div>
                      <div className="text-xs text-purple-800 mt-0.5">
                        {o.guestName || "Guest"}
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      VIP
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={updating === o.id}
                      onClick={() => setPriority(o.id, "Normal")}
                    >
                      Normal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={updating === o.id}
                      onClick={() => setPriority(o.id, "Urgent")}
                    >
                      Urgent
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Normal ({normal.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {normal.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No normal priority orders.
              </div>
            ) : (
              normal.slice(0, 8).map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • Room {o.roomNumber}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={updating === o.id}
                      onClick={() => setPriority(o.id, "VIP")}
                    >
                      VIP
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      disabled={updating === o.id}
                      onClick={() => setPriority(o.id, "Urgent")}
                    >
                      Urgent
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
