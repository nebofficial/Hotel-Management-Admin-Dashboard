'use client'

import { useMemo, useState } from "react"
import type { RoomServiceOrder } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Clock, Save } from "lucide-react"

interface Props {
  orders: RoomServiceOrder[]
  onUpdateOrder: (
    id: string,
    patch: Partial<RoomServiceOrder> & { autoChargeToRoomBill?: boolean },
  ) => Promise<any>
}

export default function EstimatedDeliveryTime({ orders, onUpdateOrder }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [minutes, setMinutes] = useState<number | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const pending = useMemo(() => {
    const p = orders.filter(
      (o) => o.status === "Pending" || o.status === "Preparing",
    )
    const load = p.length
    return p.map((o) => ({
      ...o,
      autoETA: 20 + Math.max(0, load - 1) * 2,
    }))
  }, [orders])

  const startEdit = (o: RoomServiceOrder & { autoETA?: number }) => {
    setEditingId(o.id)
    setMinutes(o.estimatedDeliveryMinutes || o.autoETA || null)
  }

  const cancel = () => {
    setEditingId(null)
    setMinutes(null)
  }

  const save = async (id: string) => {
    setError(null)
    setSaving(id)
    try {
      await onUpdateOrder(id, {
        estimatedDeliveryMinutes: minutes != null && minutes > 0 ? minutes : null,
      })
      setEditingId(null)
      setMinutes(null)
    } catch (e: any) {
      setError(e?.message || "Failed to save ETA")
    } finally {
      setSaving(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-amber-600 to-orange-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap=2">
            <Clock className="h-4 w-4" />
            Estimated Delivery Time
            <Badge className="bg-white/15 text-white border-none">
              Auto-calculate ETA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Auto-calc formula: 20 min base + 2 min per additional pending order.
        </CardContent>
      </Card>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap=2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Pending orders ({pending.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          {pending.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No pending orders.
            </div>
          ) : (
            pending.map((o) => (
              <div
                key={o.id}
                className="rounded-lg border border-slate-200 bg-slate-50/40 p=3"
              >
                <div className="flex items-center justify-between gap=3 mb-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • Room {o.roomNumber}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {o.items.map((i) => i.name).slice(0, 2).join(", ")}
                    </div>
                  </div>
                  <div className="text-right">
                    {o.estimatedDeliveryMinutes ? (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        {o.estimatedDeliveryMinutes} min
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                        Auto: {o.autoETA} min
                      </Badge>
                    )}
                  </div>
                </div>

                {editingId === o.id ? (
                  <div className="flex items-center gap=2 mt-2">
                    <Input
                      aria-label="Estimated minutes"
                      type="number"
                      min={0}
                      value={minutes ?? ""}
                      onChange={(e) =>
                        setMinutes(
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                      className="h-9"
                      placeholder="Minutes"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={cancel}
                      disabled={saving === o.id}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700"
                      disabled={saving === o.id}
                      onClick={() => save(o.id)}
                    >
                      <Save className="h-3.5 w-3.5 mr-1.5" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 mt-2"
                    onClick={() => startEdit(o)}
                  >
                    {o.estimatedDeliveryMinutes ? "Edit ETA" : "Set ETA"}
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  )
}

