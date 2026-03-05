'use client'

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, BedDouble, RefreshCw, TrendingUp } from "lucide-react"
import OrderByRoomNumber from "./OrderByRoomNumber"
import GuestVerification from "./GuestVerification"
import ChargeToRoomBill from "./ChargeToRoomBill"
import DeliveryTracking from "./DeliveryTracking"
import SpecialInstructions from "./SpecialInstructions"
import EstimatedDeliveryTime from "./EstimatedDeliveryTime"
import AutoServiceCharge from "./AutoServiceCharge"
import RoomWiseOrderHistory from "./RoomWiseOrderHistory"
import LinkWithFrontDesk from "./LinkWithFrontDesk"
import PriorityHandling from "./PriorityHandling"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type RoomServiceStatus =
  | "Pending"
  | "Preparing"
  | "OutForDelivery"
  | "Delivered"
  | "Cancelled"

export type RoomServicePriority = "Normal" | "VIP" | "Urgent"

export interface RoomServiceItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string | null
}

export interface RoomServiceOrder {
  id: string
  orderNumber: string
  roomNumber: string
  guestName: string | null
  bookingId: string | null
  bookingNumber: string | null
  status: RoomServiceStatus
  priority: RoomServicePriority
  items: RoomServiceItem[]
  specialInstructions: string | null
  estimatedDeliveryMinutes: number | null
  serviceChargePercent: number
  serviceChargeAmount: number
  subtotal: number
  totalAmount: number
  chargeToRoom: boolean
  linkedToFrontDesk: boolean
  createdAt?: string
}

export interface FrontDeskGuestPreview {
  bookingId: string
  bookingNumber: string
  roomNumber: string
  guestName: string
  status: string
}

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null

export default function RoomServiceOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<RoomServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = async () => {
    if (!user?.hotelId) {
      setError("Hotel not selected. Please login again.")
      setLoading(false)
      return
    }
    const token = getToken()
    if (!token) {
      setError("Not authenticated. Please log in again.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/room-service-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      const json = res.ok ? await res.json().catch(() => ({})) : {}
      if (!res.ok) {
        throw new Error(
          (json as any)?.message ||
            `Failed to load room-service orders (HTTP ${res.status})`,
        )
      }
      const list = Array.isArray((json as any).orders)
        ? (json as any).orders
        : []
      setOrders(
        list.map((o: any) => ({
          id: String(o.id),
          orderNumber: String(o.orderNumber || ""),
          roomNumber: String(o.roomNumber || ""),
          guestName: o.guestName != null ? String(o.guestName) : null,
          bookingId: o.bookingId ? String(o.bookingId) : null,
          bookingNumber: o.bookingNumber ? String(o.bookingNumber) : null,
          status: (o.status as RoomServiceStatus) || "Pending",
          priority: (o.priority as RoomServicePriority) || "Normal",
          items: Array.isArray(o.items) ? o.items : [],
          specialInstructions:
            o.specialInstructions != null ? String(o.specialInstructions) : null,
          estimatedDeliveryMinutes:
            o.estimatedDeliveryMinutes != null
              ? Number(o.estimatedDeliveryMinutes)
              : null,
          serviceChargePercent: Number(o.serviceChargePercent || 0),
          serviceChargeAmount: Number(o.serviceChargeAmount || 0),
          subtotal: Number(o.subtotal || 0),
          totalAmount: Number(o.totalAmount || 0),
          chargeToRoom: Boolean(o.chargeToRoom),
          linkedToFrontDesk: Boolean(o.linkedToFrontDesk),
          createdAt: o.createdAt ? String(o.createdAt) : undefined,
        })),
      )
    } catch (e: any) {
      setError(e?.message || "Failed to load room-service orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.hotelId) {
      loadOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hotelId])

  const upsertOrderLocal = (next: RoomServiceOrder) => {
    setOrders((prev) => {
      const idx = prev.findIndex((p) => p.id === next.id)
      if (idx === -1) return [next, ...prev]
      const copy = [...prev]
      copy[idx] = next
      return copy
    })
  }

  const createOrder = async (
    payload: Partial<RoomServiceOrder> & { items: RoomServiceItem[] },
  ) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error("Not authenticated")

    const res = await fetch(
      `${API_BASE}/api/hotel-data/${user.hotelId}/room-service-orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    )
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(
        (data as any)?.message ||
          `Failed to create room-service order (HTTP ${res.status})`,
      )
    }
    const o = (data as any).order
    if (o?.id) {
      upsertOrderLocal({
        id: String(o.id),
        orderNumber: String(o.orderNumber || ""),
        roomNumber: String(o.roomNumber || ""),
        guestName: o.guestName != null ? String(o.guestName) : null,
        bookingId: o.bookingId ? String(o.bookingId) : null,
        bookingNumber: o.bookingNumber ? String(o.bookingNumber) : null,
        status: (o.status as RoomServiceStatus) || "Pending",
        priority: (o.priority as RoomServicePriority) || "Normal",
        items: Array.isArray(o.items) ? o.items : [],
        specialInstructions:
          o.specialInstructions != null ? String(o.specialInstructions) : null,
        estimatedDeliveryMinutes:
          o.estimatedDeliveryMinutes != null
            ? Number(o.estimatedDeliveryMinutes)
            : null,
        serviceChargePercent: Number(o.serviceChargePercent || 0),
        serviceChargeAmount: Number(o.serviceChargeAmount || 0),
        subtotal: Number(o.subtotal || 0),
        totalAmount: Number(o.totalAmount || 0),
        chargeToRoom: Boolean(o.chargeToRoom),
        linkedToFrontDesk: Boolean(o.linkedToFrontDesk),
        createdAt: o.createdAt ? String(o.createdAt) : undefined,
      })
    }
    return data
  }

  const updateOrder = async (
    id: string,
    patch: Partial<RoomServiceOrder> & { autoChargeToRoomBill?: boolean },
  ) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error("Not authenticated")

    const res = await fetch(
      `${API_BASE}/api/hotel-data/${user.hotelId}/room-service-orders/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      },
    )
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(
        (data as any)?.message ||
          `Failed to update room-service order (HTTP ${res.status})`,
      )
    }
    const o = (data as any).order
    if (o?.id) {
      upsertOrderLocal({
        id: String(o.id),
        orderNumber: String(o.orderNumber || ""),
        roomNumber: String(o.roomNumber || ""),
        guestName: o.guestName != null ? String(o.guestName) : null,
        bookingId: o.bookingId ? String(o.bookingId) : null,
        bookingNumber: o.bookingNumber ? String(o.bookingNumber) : null,
        status: (o.status as RoomServiceStatus) || "Pending",
        priority: (o.priority as RoomServicePriority) || "Normal",
        items: Array.isArray(o.items) ? o.items : [],
        specialInstructions:
          o.specialInstructions != null ? String(o.specialInstructions) : null,
        estimatedDeliveryMinutes:
          o.estimatedDeliveryMinutes != null
            ? Number(o.estimatedDeliveryMinutes)
            : null,
        serviceChargePercent: Number(o.serviceChargePercent || 0),
        serviceChargeAmount: Number(o.serviceChargeAmount || 0),
        subtotal: Number(o.subtotal || 0),
        totalAmount: Number(o.totalAmount || 0),
        chargeToRoom: Boolean(o.chargeToRoom),
        linkedToFrontDesk: Boolean(o.linkedToFrontDesk),
        createdAt: o.createdAt ? String(o.createdAt) : undefined,
      })
    }
    return data
  }

  const lookupFrontDeskGuest = async (
    roomNumber: string,
  ): Promise<FrontDeskGuestPreview | null> => {
    if (!user?.hotelId) return null
    const token = getToken()
    if (!token) throw new Error("Not authenticated")

    const params = new URLSearchParams({ roomNumber })
    const res = await fetch(
      `${API_BASE}/api/hotel-data/${user.hotelId}/room-service/frontdesk-lookup?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(
        (data as any)?.message ||
          `Failed to verify guest (HTTP ${res.status})`,
      )
    }
    const g = (data as any).guest
    if (!g) return null
    return {
      bookingId: String(g.bookingId),
      bookingNumber: String(g.bookingNumber),
      roomNumber: String(g.roomNumber),
      guestName: String(g.guestName),
      status: String(g.status),
    }
  }

  const noHotel = !user?.hotelId

  const statusCounts = useMemo(() => {
    const base: Record<RoomServiceStatus, number> = {
      Pending: 0,
      Preparing: 0,
      OutForDelivery: 0,
      Delivered: 0,
      Cancelled: 0,
    }
    orders.forEach((o) => {
      base[o.status] = (base[o.status] || 0) + 1
    })
    return base
  }, [orders])

  const deliveredTotal = useMemo(
    () =>
      orders
        .filter((o) => o.status === "Delivered")
        .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
    [orders],
  )

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      {noHotel ? (
        <Card className="rounded-2xl border border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-center gap-2 text-sm text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Hotel not selected. Please login again.</span>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card className="rounded-2xl border border-slate-200 bg-white">
          <CardContent className="p-6 text-sm text-slate-600">
            Loading room-service orders…
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-indigo-600" />
                Room Service Orders
                <Badge className="ml-2 bg-slate-900 text-white border-none">
                  In-room dining
                </Badge>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Create and track in-room dining orders, link with front desk, and
                handle priority guest requests.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-8"
                onClick={loadOrders}
                title="Refresh room-service data"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {error && (
            <Card className="border border-red-100 bg-red-50 rounded-xl">
              <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <Card className="rounded-xl bg-linear-to-r from-indigo-600 to-sky-600 text-white shadow-sm border-none">
              <CardContent className="p-3">
                <div className="text-[11px] uppercase tracking-wide opacity-85">
                  Total orders
                </div>
                <div className="text-lg font-semibold">
                  {orders.length.toString().padStart(2, "0")}
                </div>
              </CardContent>
            </Card>
            {(["Pending", "Preparing", "OutForDelivery", "Delivered"] as const).map(
              (s) => (
                <Card
                  key={s}
                  className="rounded-xl bg-white border border-slate-200 shadow-sm"
                >
                  <CardContent className="p-3 flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wide text-slate-600">
                      {s === "OutForDelivery" ? "Out for delivery" : s}
                    </span>
                    <span className="text-lg font-semibold text-slate-900">
                      {statusCounts[s].toString().padStart(2, "0")}
                    </span>
                  </CardContent>
                </Card>
              ),
            )}
            <Card className="rounded-xl bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-sm border-none">
              <CardContent className="p-3">
                <div className="text-[11px] uppercase tracking-wide opacity-85 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Delivered revenue
                </div>
                <div className="text-lg font-semibold">
                  ₹{deliveredTotal.toFixed(0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="order-room" className="space-y-3">
            <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs flex flex-wrap gap-1">
              <TabsTrigger value="order-room">Order by room</TabsTrigger>
              <TabsTrigger value="guest">Guest verification</TabsTrigger>
              <TabsTrigger value="charge">Charge to room bill</TabsTrigger>
              <TabsTrigger value="delivery">Delivery tracking</TabsTrigger>
              <TabsTrigger value="instructions">Special instructions</TabsTrigger>
              <TabsTrigger value="eta">ETA</TabsTrigger>
              <TabsTrigger value="service-charge">Service charge</TabsTrigger>
              <TabsTrigger value="history">Room-wise history</TabsTrigger>
              <TabsTrigger value="frontdesk">Front desk link</TabsTrigger>
              <TabsTrigger value="priority">Priority</TabsTrigger>
            </TabsList>

            <TabsContent value="order-room" className="space-y-3">
              <OrderByRoomNumber orders={orders} onCreateOrder={createOrder} />
            </TabsContent>

            <TabsContent value="guest" className="space-y-3">
              <GuestVerification onLookupGuest={lookupFrontDeskGuest} />
            </TabsContent>

            <TabsContent value="charge" className="space-y-3">
              <ChargeToRoomBill orders={orders} onUpdateOrder={updateOrder} />
            </TabsContent>

            <TabsContent value="delivery" className="space-y-3">
              <DeliveryTracking orders={orders} onUpdateOrder={updateOrder} />
            </TabsContent>

            <TabsContent value="instructions" className="space-y-3">
              <SpecialInstructions orders={orders} onUpdateOrder={updateOrder} />
            </TabsContent>

            <TabsContent value="eta" className="space-y-3">
              <EstimatedDeliveryTime orders={orders} onUpdateOrder={updateOrder} />
            </TabsContent>

            <TabsContent value="service-charge" className="space-y-3">
              <AutoServiceCharge orders={orders} onUpdateOrder={updateOrder} />
            </TabsContent>

            <TabsContent value="history" className="space-y-3">
              <RoomWiseOrderHistory orders={orders} />
            </TabsContent>

            <TabsContent value="frontdesk" className="space-y-3">
              <LinkWithFrontDesk
                orders={orders}
                onLookupGuest={lookupFrontDeskGuest}
                onUpdateOrder={updateOrder}
              />
            </TabsContent>

            <TabsContent value="priority" className="space-y-3">
              <PriorityHandling orders={orders} onUpdateOrder={updateOrder} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  )
}

