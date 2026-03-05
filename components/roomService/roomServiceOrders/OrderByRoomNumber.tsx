'use client'

import { useMemo, useState } from "react"
import type { RoomServiceItem, RoomServiceOrder } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Plus, Search } from "lucide-react"

interface Props {
  orders: RoomServiceOrder[]
  onCreateOrder: (
    payload: Partial<RoomServiceOrder> & { items: RoomServiceItem[] },
  ) => Promise<any>
}

function money(n: number) {
  return `₹${Number(n || 0).toFixed(0)}`
}

export default function OrderByRoomNumber({ orders, onCreateOrder }: Props) {
  const [roomNumber, setRoomNumber] = useState("")
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState(180)
  const [itemQty, setItemQty] = useState(1)
  const [draft, setDraft] = useState<RoomServiceItem[]>([])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const draftSubtotal = useMemo(
    () =>
      draft.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0),
    [draft],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (!q) return true
      const hay = `${o.orderNumber} ${o.roomNumber} ${o.guestName || ""} ${o.status}`.toLowerCase()
      return hay.includes(q)
    })
  }, [orders, query])

  const addItem = () => {
    setError(null)
    if (!itemName.trim()) {
      setError("Item name is required")
      return
    }
    const item: RoomServiceItem = {
      id: `item-${Date.now()}`,
      name: itemName.trim(),
      quantity: Math.max(1, Number(itemQty || 1)),
      price: Number(itemPrice || 0),
      notes: null,
    }
    setDraft((prev) => [item, ...prev])
    setItemName("")
    setItemQty(1)
  }

  const removeItem = (id: string) => {
    setDraft((prev) => prev.filter((d) => d.id !== id))
  }

  const placeOrder = async () => {
    setError(null)
    if (!roomNumber.trim()) {
      setError("Room number is required")
      return
    }
    if (draft.length === 0) {
      setError("Add at least one item")
      return
    }
    setCreating(true)
    try {
      await onCreateOrder({
        roomNumber: roomNumber.trim(),
        items: draft,
        status: "Pending",
        subtotal: draftSubtotal,
        serviceChargePercent: 0,
        serviceChargeAmount: 0,
        totalAmount: draftSubtotal,
        chargeToRoom: false,
        priority: "Normal",
      })
      setDraft([])
      setRoomNumber("")
    } catch (e: any) {
      setError(e?.message || "Failed to create order")
    } finally {
      setCreating(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            Order by Room Number
            <Badge className="bg-white/15 text-white border-none">
              Search room & create order
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Enter a room number, add menu items, and create in-room dining orders.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="rounded-xl border border-slate-200 bg-slate-50/40 lg:col-span-1">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-900">
              Create room-service order
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="rs-room">Room number</Label>
              <Input
                id="rs-room"
                aria-label="Room number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="301"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="rs-item-name">Item</Label>
                <Input
                  id="rs-item-name"
                  aria-label="Item name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Breakfast Set"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rs-item-price">Price</Label>
                <Input
                  id="rs-item-price"
                  aria-label="Item price"
                  type="number"
                  min={0}
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value || 0))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rs-item-qty">Qty</Label>
              <Input
                id="rs-item-qty"
                aria-label="Quantity"
                type="number"
                min={1}
                value={itemQty}
                onChange={(e) => setItemQty(Number(e.target.value || 1))}
              />
            </div>
            <Button
              type="button"
              onClick={addItem}
              className="bg-indigo-600 hover:bg-indigo-700 w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add item
            </Button>

            {draft.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {money(draftSubtotal)}
                  </span>
                </div>
              </div>
            )}

            <Button
              type="button"
              disabled={creating}
              onClick={placeOrder}
              className="bg-slate-900 hover:bg-slate-950 w-full"
            >
              Place order
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-900 flex items-center justify-between gap-2">
              <span>Recent room-service orders</span>
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <Input
                  aria-label="Search orders"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search room, guest, status…"
                  className="pl-8 h-9 w-[260px]"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="overflow-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Order
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Room
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Guest
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Items
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-10 text-center text-slate-400"
                      >
                        No room-service orders found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-slate-100 hover:bg-slate-50/50"
                      >
                        <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                          {o.orderNumber || "—"}
                        </td>
                        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
                          {o.roomNumber}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {o.guestName || "—"}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {o.items.slice(0, 2).map((i) => i.name).join(", ")}
                          {o.items.length > 2 ? ` +${o.items.length - 2}` : ""}
                        </td>
                        <td className="px-3 py-2">
                          <Badge className="border bg-slate-100 text-slate-700 border-slate-200">
                            {o.status === "OutForDelivery"
                              ? "Out for delivery"
                              : o.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-slate-900">
                          {money(o.totalAmount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {draft.length > 0 && (
        <Card className="rounded-xl border border-slate-200 bg-white">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs font-semibold text-slate-900">
              Draft items ({draft.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {draft.map((d) => (
              <div
                key={d.id}
                className="rounded-lg border border-slate-200 bg-slate-50/40 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {d.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Qty {d.quantity} • {money(d.price)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    onClick={() => removeItem(d.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </section>
  )
}

