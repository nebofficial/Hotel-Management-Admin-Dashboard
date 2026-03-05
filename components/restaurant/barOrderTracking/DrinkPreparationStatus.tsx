'use client'

import { useMemo, useState } from "react"
import type { BarOrder, BarOrderStatus } from "./BarOrderTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Beaker, CheckCircle2, Loader2 } from "lucide-react"

function badgeClass(status: BarOrderStatus) {
  switch (status) {
    case "Pending":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "Mixing":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "Ready":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "Served":
      return "bg-green-100 text-green-700 border-green-200"
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

interface Props {
  orders: BarOrder[]
  onUpdateOrder: (id: string, patch: Partial<BarOrder>) => Promise<any>
}

export default function DrinkPreparationStatus({ orders, onUpdateOrder }: Props) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeOrders = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .slice()
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
  }, [orders])

  const setStatus = async (orderId: string, next: BarOrderStatus) => {
    setError(null)
    setUpdating(orderId)
    try {
      await onUpdateOrder(orderId, { status: next })
    } catch (e: any) {
      setError(e?.message || "Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Drink Preparation Status
            <Badge className="bg-white/15 text-white border-none">
              Real-time UI
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Track each drink order from Pending → Mixing → Ready → Served using
          quick actions and color badges.
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
        <CardContent className="p-3">
          <div className="overflow-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Order
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Location
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Drinks
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-10 text-center text-slate-400"
                    >
                      No bar orders to track yet.
                    </td>
                  </tr>
                ) : (
                  activeOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                        {o.orderNumber || "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                        {o.location}
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                      </td>
                      <td className="px-3 py-2">
                        <Badge className={`border ${badgeClass(o.status)}`}>
                          {o.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            disabled={updating === o.id}
                            onClick={() => setStatus(o.id, "Pending")}
                            title="Mark as Pending"
                          >
                            Pending
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            disabled={updating === o.id}
                            onClick={() => setStatus(o.id, "Mixing")}
                            title="Mark as Mixing"
                          >
                            Mixing
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 px-2"
                            disabled={updating === o.id}
                            onClick={() => setStatus(o.id, "Ready")}
                            title="Mark as Ready"
                          >
                            Ready
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700"
                            disabled={updating === o.id}
                            onClick={() => setStatus(o.id, "Served")}
                            title="Mark as Served"
                          >
                            {updating === o.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                Served
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

