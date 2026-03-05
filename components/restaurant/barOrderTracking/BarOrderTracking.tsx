'use client'

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Martini, RefreshCw, TrendingUp } from "lucide-react"
import SeparateBarOrders from "./SeparateBarOrders"
import DrinkPreparationStatus from "./DrinkPreparationStatus"
import AlcoholInventoryTracking from "./AlcoholInventoryTracking"
import HappyHourIntegration, { HappyHourConfig } from "./HappyHourIntegration"
import RevenueTracking from "./RevenueTracking"
import GlassSizePricing, { GlassSizeOption } from "./GlassSizePricing"
import BottleTracking from "./BottleTracking"
import AgeVerification from "./AgeVerification"
import AutoStockDeduction from "./AutoStockDeduction"
import BarOnlyReports from "./BarOnlyReports"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export type BarOrderStatus =
  | "Pending"
  | "Mixing"
  | "Ready"
  | "Served"
  | "Cancelled"

export interface BarOrderItem {
  id: string
  name: string
  quantity: number
  isAlcohol?: boolean
  basePrice: number
  size?: GlassSizeOption["id"] | null
  unitPrice: number
  status: "Pending" | "Mixing" | "Ready" | "Served" | "Cancelled"
}

export interface BarOrder {
  id: string
  orderNumber: string
  location: string
  items: BarOrderItem[]
  status: BarOrderStatus
  subtotal: number
  happyHourApplied: boolean
  happyHourDiscount: number
  totalAmount: number
  ageVerified: boolean
  createdAt?: string
}

export interface BarInventoryItem {
  id: string
  name: string
  category?: string | null
  unit?: string | null
  currentStock: number
  reorderLevel: number
  isAlcohol: boolean
  bottleSizeMl?: number | null
}

function safeJson<T>(value: unknown, fallback: T): T {
  try {
    return (value as T) ?? fallback
  } catch {
    return fallback
  }
}

export default function BarOrderTracking() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<BarOrder[]>([])
  const [inventory, setInventory] = useState<BarInventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [happyHour, setHappyHour] = useState<HappyHourConfig>({
    enabled: true,
    start: "17:00",
    end: "19:00",
    discountPercent: 15,
  })

  const glassSizes: GlassSizeOption[] = useMemo(
    () => [
      { id: "S", label: "Small", multiplier: 1 },
      { id: "M", label: "Medium", multiplier: 1.35 },
      { id: "L", label: "Large", multiplier: 1.7 },
    ],
    [],
  )

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const loadData = async () => {
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
      const [ordersRes, invRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/bar-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/bar-inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const ordersJson = ordersRes.ok
        ? await ordersRes.json().catch(() => ({}))
        : {}
      const invJson = invRes.ok ? await invRes.json().catch(() => ({})) : {}

      if (!ordersRes.ok) {
        throw new Error(
          (ordersJson as any)?.message ||
            `Failed to load bar orders (HTTP ${ordersRes.status})`,
        )
      }

      const list = Array.isArray((ordersJson as any).orders)
        ? (ordersJson as any).orders
        : []
      setOrders(
        list.map((o: any) => ({
          id: String(o.id),
          orderNumber: String(o.orderNumber || ""),
          location: String(o.location || "Bar"),
          items: Array.isArray(o.items) ? o.items : [],
          status: (o.status as BarOrderStatus) || "Pending",
          subtotal: Number(o.subtotal || 0),
          happyHourApplied: Boolean(o.happyHourApplied),
          happyHourDiscount: Number(o.happyHourDiscount || 0),
          totalAmount: Number(o.totalAmount || 0),
          ageVerified: Boolean(o.ageVerified),
          createdAt: o.createdAt ? String(o.createdAt) : undefined,
        })),
      )

      const invList = Array.isArray((invJson as any).items)
        ? (invJson as any).items
        : []
      setInventory(
        invList.map((i: any) => ({
          id: String(i.id),
          name: String(i.name || ""),
          category: i.category != null ? String(i.category) : null,
          unit: i.unit != null ? String(i.unit) : null,
          currentStock: Number(i.currentStock || 0),
          reorderLevel: Number(i.reorderLevel || 0),
          isAlcohol: Boolean(i.isAlcohol),
          bottleSizeMl: i.bottleSizeMl != null ? Number(i.bottleSizeMl) : null,
        })),
      )
    } catch (e: any) {
      setError(e?.message || "Failed to load bar tracking data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hotelId])

  const statusCounts = useMemo(() => {
    const base = { Pending: 0, Mixing: 0, Ready: 0, Served: 0, Cancelled: 0 }
    orders.forEach((o) => {
      ;(base as any)[o.status] = ((base as any)[o.status] || 0) + 1
    })
    return base
  }, [orders])

  const servedRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "Served")
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
  }, [orders])

  const lowStockCount = useMemo(() => {
    return inventory.filter((i) => i.currentStock <= i.reorderLevel).length
  }, [inventory])

  const upsertOrderLocal = (next: BarOrder) => {
    setOrders((prev) => {
      const idx = prev.findIndex((p) => p.id === next.id)
      if (idx === -1) return [next, ...prev]
      const copy = [...prev]
      copy[idx] = next
      return copy
    })
  }

  const createOrder = async (payload: Partial<BarOrder>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error("Not authenticated")

    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/bar-orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error((data as any)?.message || `Failed to create bar order (HTTP ${res.status})`)
    }
    const o = (data as any).order
    if (o?.id) {
      upsertOrderLocal({
        id: String(o.id),
        orderNumber: String(o.orderNumber || ""),
        location: String(o.location || "Bar"),
        items: Array.isArray(o.items) ? o.items : [],
        status: (o.status as BarOrderStatus) || "Pending",
        subtotal: Number(o.subtotal || 0),
        happyHourApplied: Boolean(o.happyHourApplied),
        happyHourDiscount: Number(o.happyHourDiscount || 0),
        totalAmount: Number(o.totalAmount || 0),
        ageVerified: Boolean(o.ageVerified),
        createdAt: o.createdAt ? String(o.createdAt) : undefined,
      })
    }
    return data
  }

  const updateOrder = async (id: string, patch: Partial<BarOrder>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error("Not authenticated")

    const res = await fetch(
      `${API_BASE}/api/hotel-data/${user.hotelId}/bar-orders/${id}`,
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
      throw new Error((data as any)?.message || `Failed to update order (HTTP ${res.status})`)
    }
    const o = (data as any).order
    if (o?.id) {
      upsertOrderLocal({
        id: String(o.id),
        orderNumber: String(o.orderNumber || ""),
        location: String(o.location || "Bar"),
        items: Array.isArray(o.items) ? o.items : [],
        status: (o.status as BarOrderStatus) || "Pending",
        subtotal: Number(o.subtotal || 0),
        happyHourApplied: Boolean(o.happyHourApplied),
        happyHourDiscount: Number(o.happyHourDiscount || 0),
        totalAmount: Number(o.totalAmount || 0),
        ageVerified: Boolean(o.ageVerified),
        createdAt: o.createdAt ? String(o.createdAt) : undefined,
      })
    }
    return data
  }

  const upsertInventoryLocal = (next: BarInventoryItem) => {
    setInventory((prev) => {
      const idx = prev.findIndex((p) => p.id === next.id)
      if (idx === -1) return [next, ...prev]
      const copy = [...prev]
      copy[idx] = next
      return copy
    })
  }

  const createInventoryItem = async (payload: Partial<BarInventoryItem>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error("Not authenticated")

    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/bar-inventory`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error((data as any)?.message || `Failed to create item (HTTP ${res.status})`)
    }
    const it = (data as any).item
    if (it?.id) {
      upsertInventoryLocal({
        id: String(it.id),
        name: String(it.name || ""),
        category: it.category != null ? String(it.category) : null,
        unit: it.unit != null ? String(it.unit) : null,
        currentStock: Number(it.currentStock || 0),
        reorderLevel: Number(it.reorderLevel || 0),
        isAlcohol: Boolean(it.isAlcohol),
        bottleSizeMl: it.bottleSizeMl != null ? Number(it.bottleSizeMl) : null,
      })
    }
    return data
  }

  const updateInventoryItem = async (id: string, patch: Partial<BarInventoryItem>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error("Not authenticated")

    const res = await fetch(
      `${API_BASE}/api/hotel-data/${user.hotelId}/bar-inventory/${id}`,
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
      throw new Error((data as any)?.message || `Failed to update item (HTTP ${res.status})`)
    }
    const it = (data as any).item
    if (it?.id) {
      upsertInventoryLocal({
        id: String(it.id),
        name: String(it.name || ""),
        category: it.category != null ? String(it.category) : null,
        unit: it.unit != null ? String(it.unit) : null,
        currentStock: Number(it.currentStock || 0),
        reorderLevel: Number(it.reorderLevel || 0),
        isAlcohol: Boolean(it.isAlcohol),
        bottleSizeMl: it.bottleSizeMl != null ? Number(it.bottleSizeMl) : null,
      })
    }
    return data
  }

  if (!user?.hotelId) {
    return (
      <main className="p-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
        <Card className="rounded-2xl border border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-center gap-2 text-sm text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Hotel not selected. Please login again.</span>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="p-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
        <Card className="rounded-2xl border border-slate-200 bg-white">
          <CardContent className="p-6 text-sm text-slate-600">
            Loading bar orders & inventory…
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Martini className="h-4 w-4 text-fuchsia-600" />
            Bar Order Tracking
            <Badge className="ml-2 bg-slate-900 text-white border-none">BOT</Badge>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Separate bar orders, track drink preparation, manage inventory and reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8"
            onClick={loadData}
            title="Refresh bar tracking data"
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
        <Card className="rounded-xl bg-linear-to-r from-fuchsia-600 to-purple-600 text-white shadow-sm border-none">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide opacity-85">
              Orders
            </div>
            <div className="text-lg font-semibold">
              {orders.length.toString().padStart(2, "0")}
            </div>
          </CardContent>
        </Card>
        {(["Pending", "Mixing", "Ready", "Served"] as const).map((s) => (
          <Card
            key={s}
            className="rounded-xl bg-white border border-slate-200 shadow-sm"
          >
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>{s}</span>
                <span className="text-slate-900">
                  {(statusCounts as any)[s].toString().padStart(2, "0")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-slate-900/70"
                  style={{
                    width: `${orders.length ? (((statusCounts as any)[s] / orders.length) * 100).toFixed(0) : 0}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="rounded-xl bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-sm border-none">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide opacity-85 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Served revenue
            </div>
            <div className="text-lg font-semibold">₹{servedRevenue.toFixed(0)}</div>
            <div className="text-[11px] opacity-85 mt-0.5">
              Low stock: {lowStockCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs flex flex-wrap gap-1">
          <TabsTrigger value="orders">Separate Bar Orders</TabsTrigger>
          <TabsTrigger value="status">Drink Preparation</TabsTrigger>
          <TabsTrigger value="inventory">Alcohol Inventory</TabsTrigger>
          <TabsTrigger value="happyhour">Happy Hour</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Tracking</TabsTrigger>
          <TabsTrigger value="glass">Glass Size Pricing</TabsTrigger>
          <TabsTrigger value="bottle">Bottle Tracking</TabsTrigger>
          <TabsTrigger value="age">Age Verification</TabsTrigger>
          <TabsTrigger value="deduct">Auto Stock Deduction</TabsTrigger>
          <TabsTrigger value="reports">Bar-only Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-3">
          <SeparateBarOrders
            orders={orders}
            inventory={inventory}
            glassSizes={glassSizes}
            happyHour={happyHour}
            onCreateOrder={createOrder}
            onUpdateOrder={updateOrder}
          />
        </TabsContent>

        <TabsContent value="status" className="space-y-3">
          <DrinkPreparationStatus orders={orders} onUpdateOrder={updateOrder} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-3">
          <AlcoholInventoryTracking
            items={inventory}
            onCreateItem={createInventoryItem}
            onUpdateItem={updateInventoryItem}
          />
        </TabsContent>

        <TabsContent value="happyhour" className="space-y-3">
          <HappyHourIntegration
            value={happyHour}
            onChange={(v) => setHappyHour(safeJson(v, happyHour))}
          />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-3">
          <RevenueTracking orders={orders} />
        </TabsContent>

        <TabsContent value="glass" className="space-y-3">
          <GlassSizePricing options={glassSizes} />
        </TabsContent>

        <TabsContent value="bottle" className="space-y-3">
          <BottleTracking items={inventory} />
        </TabsContent>

        <TabsContent value="age" className="space-y-3">
          <AgeVerification orders={orders} onUpdateOrder={updateOrder} />
        </TabsContent>

        <TabsContent value="deduct" className="space-y-3">
          <AutoStockDeduction
            orders={orders}
            inventory={inventory}
            onUpdateOrder={updateOrder}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-3">
          <BarOnlyReports orders={orders} inventory={inventory} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

