'use client'

import { useMemo, useState } from "react"
import type { RoomServiceOrder } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, CreditCard } from "lucide-react"

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

export default function ChargeToRoomBill({ orders, onUpdateOrder }: Props) {
  const [charging, setCharging] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const uncharged = useMemo(
    () => orders.filter((o) => !o.chargeToRoom && o.status === "Delivered"),
    [orders],
  )
  const charged = useMemo(
    () => orders.filter((o) => o.chargeToRoom).slice(0, 10),
    [orders],
  )

  const handleCharge = async (orderId: string) => {
    setError(null)
    setCharging(orderId)
    try {
      await onUpdateOrder(orderId, { chargeToRoom: true, autoChargeToRoomBill: true })
    } catch (e: any) {
      setError(e?.message || "Failed to charge to room bill")
    } finally {
      setCharging(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Charge to Room Bill
            <Badge className="bg-white/15 text-white border-none">
              Add to guest account
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Automatically add delivered orders to the guest&apos;s room bill.
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
              Ready to charge ({uncharged.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {uncharged.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No delivered orders pending charge.
              </div>
            ) : (
              uncharged.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • Room {o.roomNumber}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {o.guestName || "Guest not linked"}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Total: {money(o.totalAmount)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={charging === o.id}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleCharge(o.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Charge
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Recently charged ({charged.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {charged.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No charged orders yet.
              </div>
            ) : (
              charged.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-emerald-900 truncate">
                        {o.orderNumber || "—"} • Room {o.roomNumber}
                      </div>
                      <div className="text-xs text-emerald-800 mt-0.5">
                        {o.guestName || "Guest"}
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      Charged
                    </Badge>
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Amount: {money(o.totalAmount)}
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

