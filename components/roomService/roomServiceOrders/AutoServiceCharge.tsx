'use client'

import { useMemo, useState } from "react"
import type { RoomServiceOrder } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle, Percent, Save } from "lucide-react"

interface Props {
  orders: RoomServiceOrder[]
  onUpdateOrder: (
    id: string,
    patch: Partial<RoomServiceOrder> & { autoChargeToRoomBill?: boolean },
  ) => Promise<any>
}

function money(n: number) {
  return `₹${Number(n || 0).toFixed(0)}`
}

export default function AutoServiceCharge({ orders, onUpdateOrder }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [percent, setPercent] = useState(10)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const withCharge = useMemo(
    () => orders.filter((o) => (o.serviceChargePercent || o.serviceChargeAmount) > 0),
    [orders],
  )
  const withoutCharge = useMemo(
    () => orders.filter((o) => (o.serviceChargePercent || o.serviceChargeAmount) === 0),
    [orders],
  )

  const startEdit = (order: RoomServiceOrder) => {
    setEditingId(order.id)
    setPercent(order.serviceChargePercent || 10)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setPercent(10)
  }

  const saveCharge = async (orderId: string, subtotal: number) => {
    setError(null)
    setSaving(orderId)
    try {
      const amount = Math.round((subtotal * percent) / 100)
      const total = subtotal + amount
      await onUpdateOrder(orderId, {
        serviceChargePercent: percent,
        serviceChargeAmount: amount,
        totalAmount: total,
      })
      setEditingId(null)
      setPercent(10)
    } catch (e: any) {
      setError(e?.message || "Failed to save service charge")
    } finally {
      setSaving(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-violet-600 to-purple-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Auto Service Charge
            <Badge className="bg-white/15 text-white border-none">
              Configurable percentage
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Automatically add service charge to room-service bills. Configure per
          order.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              With service charge ({withCharge.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p3 pt-0 space-y-2">
            {withCharge.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No orders with service charge yet.
              </div>
            ) : (
              withCharge.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-violet-200 bg-violet-50 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-violet-900 truncate">
                        {o.orderNumber || "—"} • Room {o.roomNumber}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => startEdit(o)}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="text-xs text-violet-800">
                    Service charge: {o.serviceChargePercent}% (
                    {money(o.serviceChargeAmount)}) • Total: {money(o.totalAmount)}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Without service charge ({withoutCharge.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {withoutCharge.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                All orders have service charge.
              </div>
            ) : (
              withoutCharge.slice(0, 10).map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • Room {o.roomNumber}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Subtotal: {money(o.subtotal)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    onClick={() => startEdit(o)}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {editingId && (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Configure service charge
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="rs-service-charge">Service charge (%)</Label>
              <Slider
                aria-label="Service charge percentage"
                value={[percent]}
                min={0}
                max={25}
                step={0.5}
                onValueChange={(v) => setPercent(Number(v?.[0] || 0))}
              />
              <div className="flex items-center gap-2">
                <Input
                  id="rs-service-charge"
                  aria-label="Service charge percentage"
                  type="number"
                  min={0}
                  max={25}
                  step={0.5}
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value || 0))}
                  className="h-9 w-[140px]"
                />
                <span className="text-xs text-slate-500">%</span>
              </div>
            </div>

            {(() => {
              const order = orders.find((o) => o.id === editingId)
              if (!order) return null
              const amount = Math.round((order.subtotal * percent) / 100)
              const total = order.subtotal + amount
              return (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      {money(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-600">
                      Service charge ({percent}%)
                    </span>
                    <span className="font-semibold text-slate-900">
                      {money(amount)}
                    </span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Total</span>
                    <span className="font-semibold text-slate-900">
                      {money(total)}
                    </span>
                  </div>
                </div>
              )
            })()}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={saving === editingId}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={saving === editingId}
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => {
                  const order = orders.find((o) => o.id === editingId)
                  if (order) saveCharge(editingId, order.subtotal)
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

