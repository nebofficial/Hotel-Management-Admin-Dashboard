"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { StockManagement, StockLinenItem } from "./StockManagement"
import {
  UsageTracking,
  UsageTrackingRecord,
  UsageLinenItem,
  UsageCondition,
  IssuedType,
} from "./UsageTracking"
import {
  ConditionMonitoring,
  ConditionRecord,
  ConditionStatus,
} from "./ConditionMonitoring"
import { ReplenishmentAlerts, ReplenishmentItem } from "./ReplenishmentAlerts"
import {
  ReportingAnalytics,
  ReportingItem,
  ReportingUsage,
} from "./ReportingAnalytics"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface LinenItemRecord {
  id: string
  itemName: string
  category: string
  currentStock: number
  minimumThreshold: number
  maximumCapacity: number | null
  unit: string
  location: string | null
}

export interface LinenUsageRecord {
  id: string
  linenItemId: string
  itemName: string
  quantity: number
  issuedTo: string
  issuedType: IssuedType
  condition: UsageCondition
  issuedDate: string
  returnedDate: string | null
  returnedCondition: UsageCondition | null
}

export default function LinenInventory() {
  const { user } = useAuth()
  const [items, setItems] = useState<LinenItemRecord[]>([])
  const [usage, setUsage] = useState<LinenUsageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!user?.hotelId) {
        setError("Hotel information not available. Please sign in again.")
        setLoading(false)
        return
      }
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        setError("Not authenticated. Please log in again.")
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const [itemsRes, usageRes] = await Promise.all([
          fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/linen-items`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/linen-usage`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const itemsJson = itemsRes.ok ? await itemsRes.json().catch(() => ({})) : {}
        const usageJson = usageRes.ok ? await usageRes.json().catch(() => ({})) : {}

        const itemsList = (itemsJson as any).items || []
        const mappedItems: LinenItemRecord[] = itemsList.map((i: any) => ({
          id: String(i.id),
          itemName: String(i.itemName),
          category: String(i.category || "Bedding"),
          currentStock: Number(i.currentStock || 0),
          minimumThreshold: Number(i.minimumThreshold || 50),
          maximumCapacity: i.maximumCapacity != null ? Number(i.maximumCapacity) : null,
          unit: String(i.unit || "pieces"),
          location: i.location ? String(i.location) : null,
        }))
        setItems(mappedItems)

        const usageList = (usageJson as any).usage || []
        const mappedUsage: LinenUsageRecord[] = usageList.map((u: any) => ({
          id: String(u.id),
          linenItemId: String(u.linenItemId),
          itemName: String(u.itemName),
          quantity: Number(u.quantity || 1),
          issuedTo: String(u.issuedTo),
          issuedType: (u.issuedType as IssuedType) || "Room",
          condition: (u.condition as UsageCondition) || "Good",
          issuedDate: String(u.issuedDate || ""),
          returnedDate: u.returnedDate ? String(u.returnedDate) : null,
          returnedCondition: u.returnedCondition
            ? (u.returnedCondition as UsageCondition)
            : null,
        }))
        setUsage(mappedUsage)
      } catch (e: any) {
        console.error(e)
        setError(
          e instanceof Error ? e.message : "Failed to load linen inventory.",
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user?.hotelId])

  const refreshData = async () => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return
    try {
      const [itemsRes, usageRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/linen-items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/linen-usage`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (itemsRes.ok) {
        const data = await itemsRes.json().catch(() => ({}))
        const list = (data as any).items || []
        const mapped: LinenItemRecord[] = list.map((i: any) => ({
          id: String(i.id),
          itemName: String(i.itemName),
          category: String(i.category || "Bedding"),
          currentStock: Number(i.currentStock || 0),
          minimumThreshold: Number(i.minimumThreshold || 50),
          maximumCapacity: i.maximumCapacity != null ? Number(i.maximumCapacity) : null,
          unit: String(i.unit || "pieces"),
          location: i.location ? String(i.location) : null,
        }))
        setItems(mapped)
      }

      if (usageRes.ok) {
        const data = await usageRes.json().catch(() => ({}))
        const list = (data as any).usage || []
        const mapped: LinenUsageRecord[] = list.map((u: any) => ({
          id: String(u.id),
          linenItemId: String(u.linenItemId),
          itemName: String(u.itemName),
          quantity: Number(u.quantity || 1),
          issuedTo: String(u.issuedTo),
          issuedType: (u.issuedType as IssuedType) || "Room",
          condition: (u.condition as UsageCondition) || "Good",
          issuedDate: String(u.issuedDate || ""),
          returnedDate: u.returnedDate ? String(u.returnedDate) : null,
          returnedCondition: u.returnedCondition
            ? (u.returnedCondition as UsageCondition)
            : null,
        }))
        setUsage(mapped)
      }
    } catch {
      // ignore
    }
  }

  const handleCreateItem = async (payload: {
    itemName: string
    category: string
    currentStock: number
    minimumThreshold: number
    maximumCapacity: number | null
    unit: string
    location: string | null
  }) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setCreating(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/linen-items`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const errorMsg = (data as any)?.message || `Failed to create item (${res.status})`
        const errors = (data as any)?.errors || []
        if (errors.length > 0) {
          const errorDetails = errors.map((e: any) => `${e.param}: ${e.msg}`).join(', ')
          throw new Error(`${errorMsg}: ${errorDetails}`)
        }
        throw new Error(errorMsg)
      }
      await refreshData()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to create linen item. Try again.",
      )
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateStock = async (id: string, stock: number) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/linen-items/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentStock: stock }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update stock (${res.status})`,
        )
      }
      await refreshData()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to update stock. Try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  const handleIssue = async (payload: {
    linenItemId: string
    itemName: string
    quantity: number
    issuedTo: string
    issuedType: IssuedType
    condition: UsageCondition
  }) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setCreating(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/linen-usage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to issue linen (${res.status})`,
        )
      }
      await refreshData()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to issue linen. Try again.",
      )
    } finally {
      setCreating(false)
    }
  }

  const handleReturn = async (id: string, returnedCondition: UsageCondition) => {
    if (!user?.hotelId) return
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/linen-usage/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            returnedDate: new Date().toISOString().slice(0, 10),
            returnedCondition,
          }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to return linen (${res.status})`,
        )
      }
      await refreshData()
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to return linen. Try again.",
      )
    } finally {
      setSaving(false)
    }
  }

  const stockItems: StockLinenItem[] = useMemo(
    () =>
      items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        category: i.category,
        currentStock: i.currentStock,
        minimumThreshold: i.minimumThreshold,
        maximumCapacity: i.maximumCapacity,
        unit: i.unit,
        location: i.location,
      })),
    [items],
  )

  const usageItems: UsageLinenItem[] = useMemo(
    () =>
      items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        currentStock: i.currentStock,
      })),
    [items],
  )

  const usageRecords: UsageTrackingRecord[] = useMemo(
    () =>
      usage.map((u) => ({
        id: u.id,
        linenItemId: u.linenItemId,
        itemName: u.itemName,
        quantity: u.quantity,
        issuedTo: u.issuedTo,
        issuedType: u.issuedType,
        condition: u.condition,
        issuedDate: u.issuedDate,
        returnedDate: u.returnedDate,
        returnedCondition: u.returnedCondition,
      })),
    [usage],
  )

  const conditionRecords: ConditionRecord[] = useMemo(
    () =>
      usage.map((u) => ({
        id: u.id,
        itemName: u.itemName,
        condition: u.condition as ConditionStatus,
        quantity: u.quantity,
      })),
    [usage],
  )

  const replenishmentItems: ReplenishmentItem[] = useMemo(
    () =>
      items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        category: i.category,
        currentStock: i.currentStock,
        minimumThreshold: i.minimumThreshold,
        maximumCapacity: i.maximumCapacity,
        unit: i.unit,
        location: i.location,
      })),
    [items],
  )

  const reportingItems: ReportingItem[] = useMemo(
    () =>
      items.map((i) => ({
        id: i.id,
        itemName: i.itemName,
        category: i.category,
        currentStock: i.currentStock,
        minimumThreshold: i.minimumThreshold,
      })),
    [items],
  )

  const reportingUsage: ReportingUsage[] = useMemo(
    () =>
      usage.map((u) => ({
        id: u.id,
        itemName: u.itemName,
        quantity: u.quantity,
        issuedDate: u.issuedDate,
        returnedDate: u.returnedDate,
      })),
    [usage],
  )

  const refreshAll = async () => {
    await refreshData()
  }

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="pb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Linen inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage stock levels, track usage, monitor conditions, and generate inventory reports.
          </p>
        </div>
        <button
          type="button"
          onClick={refreshAll}
          disabled={loading || !user?.hotelId}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-3 text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="stock" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs">
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="condition">Condition</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-3">
          <StockManagement
            items={stockItems}
            creating={creating}
            onCreate={handleCreateItem}
            onUpdateStock={handleUpdateStock}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="usage" className="space-y-3">
          <UsageTracking
            usage={usageRecords}
            items={usageItems}
            creating={creating}
            onIssue={handleIssue}
            onReturn={handleReturn}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="condition" className="space-y-3">
          <ConditionMonitoring usage={conditionRecords} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-3">
          <ReplenishmentAlerts items={replenishmentItems} />
        </TabsContent>

        <TabsContent value="reporting" className="space-y-3">
          <ReportingAnalytics items={reportingItems} usage={reportingUsage} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
