'use client'

import { useMemo, useState } from "react"
import type { BarInventoryItem, BarOrder } from "./BarOrderTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, PackageMinus } from "lucide-react"

interface Props {
  orders: BarOrder[]
  inventory: BarInventoryItem[]
  onUpdateOrder: (id: string, patch: Partial<BarOrder> & { autoDeductStock?: boolean }) => Promise<any>
}

export default function AutoStockDeduction({
  orders,
  inventory,
  onUpdateOrder,
}: Props) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ready = useMemo(() => orders.filter((o) => o.status === "Ready"), [orders])
  const lowStock = useMemo(
    () => inventory.filter((i) => i.currentStock <= i.reorderLevel).slice(0, 6),
    [inventory],
  )

  const markServedDeduct = async (orderId: string) => {
    setError(null)
    setUpdating(orderId)
    try {
      await onUpdateOrder(orderId, { status: "Served", autoDeductStock: true })
    } catch (e: any) {
      setError(e?.message || "Failed to mark served / deduct stock")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-slate-700 to-slate-900 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <PackageMinus className="h-4 w-4" />
            Auto Stock Deduction
            <Badge className="bg-white/15 text-white border-none">
              UI + API
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Deduct inventory (backend) when an order is marked Served. This uses a
          state-based trigger to keep stock consistent with service.
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
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Ready to serve ({ready.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {ready.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No ready orders right now.
              </div>
            ) : (
              ready.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • {o.location}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Total: ₹{Number(o.totalAmount || 0).toFixed(0)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={updating === o.id}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => markServedDeduct(o.id)}
                    title="Mark served and deduct stock"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Served + Deduct
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Low stock watchlist
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {lowStock.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No low stock items.
              </div>
            ) : (
              lowStock.map((it) => (
                <div
                  key={it.id}
                  className="rounded-lg border border-red-100 bg-red-50 p-3"
                >
                  <div className="text-sm font-semibold text-red-900 truncate">
                    {it.name}
                  </div>
                  <div className="text-xs text-red-800 mt-0.5">
                    Stock: {it.currentStock} • Reorder: {it.reorderLevel}
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

