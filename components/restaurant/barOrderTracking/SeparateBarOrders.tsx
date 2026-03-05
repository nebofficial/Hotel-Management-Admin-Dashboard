'use client'

import { useMemo, useState } from "react"
import type {
  BarInventoryItem,
  BarOrder,
  BarOrderItem,
  BarOrderStatus,
} from "./BarOrderTracking"
import type { HappyHourConfig } from "./HappyHourIntegration"
import type { GlassSizeOption } from "./GlassSizePricing"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, Plus, Search, ShieldCheck } from "lucide-react"

function nowIsInRange(start: string, end: string, now = new Date()) {
  const toMin = (hhmm: string) => {
    const [h, m] = String(hhmm || "00:00")
      .split(":")
      .map((x) => Number(x))
    return (h || 0) * 60 + (m || 0)
  }
  const mins = now.getHours() * 60 + now.getMinutes()
  const s = toMin(start)
  const e = toMin(end)
  if (s === e) return false
  if (s < e) return mins >= s && mins <= e
  return mins >= s || mins <= e
}

function money(n: number) {
  return `₹${Number(n || 0).toFixed(0)}`
}

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
  inventory: BarInventoryItem[]
  glassSizes: GlassSizeOption[]
  happyHour: HappyHourConfig
  onCreateOrder: (payload: Partial<BarOrder>) => Promise<any>
  onUpdateOrder: (id: string, patch: Partial<BarOrder>) => Promise<any>
}

export default function SeparateBarOrders({
  orders,
  inventory,
  glassSizes,
  happyHour,
  onCreateOrder,
  onUpdateOrder,
}: Props) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<BarOrderStatus | "All">("All")

  // create order UI
  const [location, setLocation] = useState("Bar-01")
  const [selectedDrinkId, setSelectedDrinkId] = useState<string>("")
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState<GlassSizeOption["id"]>("S")
  const [draft, setDraft] = useState<BarOrderItem[]>([])
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [ageOpen, setAgeOpen] = useState(false)
  const [ageOk, setAgeOk] = useState(false)

  const happyActive = happyHour.enabled && nowIsInRange(happyHour.start, happyHour.end)

  const drinks = useMemo(() => {
    return inventory
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((i) => ({ ...i }))
  }, [inventory])

  const selectedDrink = useMemo(() => {
    return drinks.find((d) => d.id === selectedDrinkId) || null
  }, [drinks, selectedDrinkId])

  const sizeMultiplier = useMemo(() => {
    const opt = glassSizes.find((g) => g.id === size)
    return opt?.multiplier || 1
  }, [glassSizes, size])

  const baseUnitPrice = useMemo(() => {
    // If inventory doesn't have price, assume 180 for demo; backend can add later.
    return 180
  }, [])

  const computedUnitPrice = useMemo(() => {
    return Math.round(baseUnitPrice * sizeMultiplier)
  }, [baseUnitPrice, sizeMultiplier])

  const draftSubtotal = useMemo(() => {
    return draft.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0)
  }, [draft])

  const happyDiscount = useMemo(() => {
    if (!happyActive) return 0
    return Math.round((draftSubtotal * (happyHour.discountPercent || 0)) / 100)
  }, [draftSubtotal, happyActive, happyHour.discountPercent])

  const draftTotal = useMemo(() => {
    return Math.max(0, draftSubtotal - happyDiscount)
  }, [draftSubtotal, happyDiscount])

  const needsAgeVerify = useMemo(() => {
    return draft.some((d) => Boolean(d.isAlcohol))
  }, [draft])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (status !== "All" && o.status !== status) return false
      if (!q) return true
      const hay = `${o.orderNumber} ${o.location} ${o.status} ${o.items
        .map((i) => i.name)
        .join(" ")}`.toLowerCase()
      return hay.includes(q)
    })
  }, [orders, query, status])

  const addToDraft = () => {
    setCreateError(null)
    if (!selectedDrink) {
      setCreateError("Please select a drink")
      return
    }
    const item: BarOrderItem = {
      id: `${selectedDrink.id}-${Date.now()}`,
      name: selectedDrink.name,
      quantity: Math.max(1, Number(qty || 1)),
      isAlcohol: Boolean(selectedDrink.isAlcohol),
      basePrice: baseUnitPrice,
      size,
      unitPrice: computedUnitPrice,
      status: "Pending",
    }
    setDraft((prev) => [item, ...prev])
    setQty(1)
    setSelectedDrinkId("")
  }

  const removeDraftItem = (id: string) => {
    setDraft((prev) => prev.filter((d) => d.id !== id))
  }

  const placeOrder = async () => {
    setCreateError(null)
    if (draft.length === 0) {
      setCreateError("Add at least one drink to place an order")
      return
    }
    if (needsAgeVerify && !ageOk) {
      setAgeOpen(true)
      return
    }
    setCreating(true)
    try {
      await onCreateOrder({
        location: location.trim() || "Bar",
        items: draft,
        status: "Pending",
        subtotal: draftSubtotal,
        happyHourApplied: Boolean(happyActive),
        happyHourDiscount: happyDiscount,
        totalAmount: draftTotal,
        ageVerified: !needsAgeVerify ? true : Boolean(ageOk),
      })
      setDraft([])
      setAgeOk(false)
    } catch (e: any) {
      setCreateError(e?.message || "Failed to place order")
    } finally {
      setCreating(false)
    }
  }

  const quickStatus = async (orderId: string, next: BarOrderStatus) => {
    try {
      await onUpdateOrder(orderId, { status: next })
    } catch {
      // handled by parent error banner
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Separate Bar Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Card className="rounded-xl border border-slate-200 bg-slate-50/40">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-semibold text-slate-900">
                  Create bar-only order (frontend + API)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="bot-location">Location</Label>
                    <Input
                      id="bot-location"
                      aria-label="Order location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Bar-01"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bot-size">Glass size</Label>
                    <select
                      id="bot-size"
                      aria-label="Glass size"
                      value={size}
                      onChange={(e) => setSize(e.target.value as any)}
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                    >
                      {glassSizes.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.label} (x{g.multiplier})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="bot-drink">Drink</Label>
                    <select
                      id="bot-drink"
                      aria-label="Select drink"
                      value={selectedDrinkId}
                      onChange={(e) => setSelectedDrinkId(e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                    >
                      <option value="">Select drink…</option>
                      {drinks.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                          {d.isAlcohol ? " (Alcohol)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="bot-qty">Qty</Label>
                      <Input
                        id="bot-qty"
                        aria-label="Quantity"
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value || 1))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Unit price</Label>
                      <div className="h-10 rounded-md border border-slate-200 bg-white px-3 flex items-center text-sm text-slate-900">
                        {money(computedUnitPrice)}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={addToDraft}
                    className="bg-fuchsia-600 hover:bg-fuchsia-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add drink
                  </Button>

                  {createError && (
                    <div className="text-xs text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{createError}</span>
                    </div>
                  )}

                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        {money(draftSubtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-slate-600">
                        Happy hour{" "}
                        {happyActive ? (
                          <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="ml-2 bg-slate-100 text-slate-700 border-slate-200">
                            Off
                          </Badge>
                        )}
                      </span>
                      <span className="font-semibold text-slate-900">
                        -{money(happyDiscount)}
                      </span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 font-medium">Total</span>
                      <span className="font-semibold text-slate-900">
                        {money(draftTotal)}
                      </span>
                    </div>
                    {needsAgeVerify && (
                      <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-slate-700" />
                        Age verification required for alcohol orders.
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    disabled={creating}
                    onClick={placeOrder}
                    className="bg-slate-900 hover:bg-slate-950"
                  >
                    Place order
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-slate-200 bg-white lg:col-span-2">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-semibold text-slate-900 flex items-center justify-between gap-2">
                  <span>Orders</span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      <Input
                        aria-label="Search orders"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search order, location, drink…"
                        className="pl-8 h-9 w-[260px]"
                      />
                    </div>
                    <select
                      aria-label="Filter by status"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as BarOrderStatus | "All")
                      }
                      className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                    >
                      <option value="All">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Mixing">Mixing</option>
                      <option value="Ready">Ready</option>
                      <option value="Served">Served</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
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
                          Location
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
                        <th className="px-3 py-2 text-right font-semibold text-slate-700">
                          Actions
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
                            No bar orders found.
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
                              {o.location}
                            </td>
                            <td className="px-3 py-2 text-slate-600">
                              {o.items.slice(0, 2).map((i) => i.name).join(", ")}
                              {o.items.length > 2 ? ` +${o.items.length - 2}` : ""}
                              {!o.ageVerified &&
                                o.items.some((i) => i.isAlcohol) && (
                                  <Badge className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
                                    Age pending
                                  </Badge>
                                )}
                            </td>
                            <td className="px-3 py-2">
                              <Badge className={`border ${badgeClass(o.status)}`}>
                                {o.status}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-slate-900">
                              {money(o.totalAmount)}
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex justify-end gap-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2"
                                  onClick={() => quickStatus(o.id, "Mixing")}
                                  title="Mark as Mixing"
                                >
                                  Mixing
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2"
                                  onClick={() => quickStatus(o.id, "Ready")}
                                  title="Mark as Ready"
                                >
                                  Ready
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => quickStatus(o.id, "Served")}
                                  title="Mark as Served"
                                >
                                  Served
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
                          Qty {d.quantity} • {d.size || "S"} • {money(d.unitPrice)}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2"
                        onClick={() => removeDraftItem(d.id)}
                        title="Remove item"
                      >
                        Remove
                      </Button>
                    </div>
                    {d.isAlcohol && (
                      <div className="mt-2 text-[11px] text-amber-700">
                        Alcohol item
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={ageOpen} onOpenChange={setAgeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Age verification required</AlertDialogTitle>
            <AlertDialogDescription>
              This order contains alcohol items. Confirm the guest is of legal
              drinking age before placing the order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            Tip: You can also verify later from the “Age Verification” tab, but
            bar policy usually requires verification before preparation.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setAgeOk(false)
                setAgeOpen(false)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setAgeOk(true)
                setAgeOpen(false)
                await placeOrder()
              }}
              className="bg-slate-900 hover:bg-slate-950"
            >
              Confirm age & place
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

