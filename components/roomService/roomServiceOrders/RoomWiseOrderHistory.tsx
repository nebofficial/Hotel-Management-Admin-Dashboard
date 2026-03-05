'use client'

import { useMemo, useState } from "react"
import type { RoomServiceOrder } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Props {
  orders: RoomServiceOrder[]
}

function money(n: number) {
  return `₹${Number(n || 0).toFixed(0)}`
}

function badgeClass(status: RoomServiceOrder["status"]) {
  switch (status) {
    case "Pending":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "Preparing":
      return "bg-orange-100 text-orange-700 border-orange-200"
    case "OutForDelivery":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "Delivered":
      return "bg-green-100 text-green-700 border-green-200"
    case "Cancelled":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

export default function RoomWiseOrderHistory({ orders }: Props) {
  const [roomFilter, setRoomFilter] = useState("")

  const grouped = useMemo(() => {
    const map = new Map<
      string,
      { room: string; total: number; count: number; orders: RoomServiceOrder[] }
    >()
    orders.forEach((o) => {
      const key = o.roomNumber
      if (!map.has(key)) {
        map.set(key, { room: key, total: 0, count: 0, orders: [] })
      }
      const bucket = map.get(key)!
      bucket.total += Number(o.totalAmount || 0)
      bucket.count += 1
      bucket.orders.push(o)
    })
    return Array.from(map.values()).sort((a, b) => a.room.localeCompare(b.room))
  }, [orders])

  const filtered = useMemo(() => {
    if (!roomFilter.trim()) return grouped
    const q = roomFilter.trim().toLowerCase()
    return grouped.filter((g) => g.room.toLowerCase().includes(q))
  }, [grouped, roomFilter])

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-teal-600 to-cyan-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            Room-wise Order History
            <Badge className="bg-white/15 text-white border-none">
              Filter orders by room
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          View all orders grouped by room number and filter for a specific room.
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center justify-between gap-2">
            <span>Orders by room</span>
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <Input
                aria-label="Filter by room number"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                placeholder="Filter by room…"
                className="pl-8 h-9 w-[260px]"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No orders found.
            </div>
          ) : (
            filtered.map((g) => (
              <Card
                key={g.room}
                className="rounded-xl border border-slate-200 bg-slate-50/40"
              >
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                    <span>Room {g.room}</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-900 text-white border-none">
                        {g.count} orders
                      </Badge>
                      <span className="text-xs font-semibold text-slate-700">
                        Total: {money(g.total)}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-slate-700">
                            Order
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
                        {g.orders
                          .slice()
                          .sort((a, b) =>
                            (b.createdAt || "").localeCompare(a.createdAt || ""),
                          )
                          .map((o) => (
                            <tr
                              key={o.id}
                              className="border-b border-slate-100 hover:bg-slate-50/50"
                            >
                              <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                                {o.orderNumber || "—"}
                              </td>
                              <td className="px-3 py-2 text-slate-600">
                                {o.guestName || "—"}
                              </td>
                              <td className="px-3 py-2 text-slate-600">
                                {o.items
                                  .map((i) => `${i.quantity}x ${i.name}`)
                                  .join(", ")}
                              </td>
                              <td className="px-3 py-2">
                                <Badge className={`border ${badgeClass(o.status)}`}>
                                  {o.status === "OutForDelivery"
                                    ? "Out for delivery"
                                    : o.status}
                                </Badge>
                              </td>
                              <td className="px-3 py-2 text-right font-semibold text-slate-900">
                                {money(o.totalAmount)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  )
}

