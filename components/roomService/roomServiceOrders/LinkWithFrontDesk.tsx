'use client'

import { useMemo, useState } from "react"
import type { FrontDeskGuestPreview, RoomServiceOrder } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Link2 } from "lucide-react"

interface Props {
  orders: RoomServiceOrder[]
  onLookupGuest: (roomNumber: string) => Promise<FrontDeskGuestPreview | null>
  onUpdateOrder: (
    id: string,
    patch: Partial<RoomServiceOrder> & { autoChargeToRoomBill?: boolean },
  ) => Promise<any>
}

export default function LinkWithFrontDesk({
  orders,
  onLookupGuest,
  onUpdateOrder,
}: Props) {
  const [linkingId, setLinkingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const unlinked = useMemo(
    () => orders.filter((o) => !o.linkedToFrontDesk),
    [orders],
  )
  const linked = useMemo(
    () => orders.filter((o) => o.linkedToFrontDesk).slice(0, 10),
    [orders],
  )

  const handleLink = async (o: RoomServiceOrder) => {
    setError(null)
    setLinkingId(o.id)
    try {
      const guest = await onLookupGuest(o.roomNumber)
      if (!guest) {
        throw new Error("No active booking found for this room")
      }
      await onUpdateOrder(o.id, {
        linkedToFrontDesk: true,
        guestName: guest.guestName,
        bookingId: guest.bookingId,
        bookingNumber: guest.bookingNumber,
      })
    } catch (e: any) {
      setError(e?.message || "Failed to link with front desk")
    } finally {
      setLinkingId(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap=2">
            <Link2 className="h-4 w-4" />
            Link with Front Desk
            <Badge className="bg-white/15 text-white border-none">
              Sync billing & guest
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Sync room-service orders with front desk bookings and guest details.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Unlinked orders ({unlinked.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {unlinked.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                All orders are linked.
              </div>
            ) : (
              unlinked.slice(0, 10).map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • Room {o.roomNumber}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {o.guestName || "Guest not verified"}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={linkingId === o.id}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleLink(o)}
                  >
                    <Link2 className="h-3.5 w-3.5 mr-1.5" />
                    Link
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Linked orders ({linked.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {linked.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No linked orders yet.
              </div>
            ) : (
              linked.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-indigo-200 bg-indigo-50 p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-indigo-900 truncate">
                        {o.orderNumber || "—"} • Room {o.roomNumber}
                      </div>
                      <div className="text-xs text-indigo-800 mt-0.5">
                        {o.guestName || "Guest"}
                      </div>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                      Linked
                    </Badge>
                  </div>
                  {o.bookingNumber && (
                    <div className="text-[11px] text-indigo-700">
                      Booking: {o.bookingNumber}
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

