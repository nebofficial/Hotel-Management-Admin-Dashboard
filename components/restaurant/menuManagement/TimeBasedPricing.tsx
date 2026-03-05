'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Clock } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function TimeBasedPricing({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timePricing, setTimePricing] = useState<any>(null)

  const handleOpen = (item: MenuItem) => {
    setEditingItem(item)
    setTimePricing(item.timeBasedPricing || {
      breakfast: { start: "08:00", end: "11:00", price: item.price },
      lunch: { start: "12:00", end: "15:00", price: item.price },
      dinner: { start: "19:00", end: "22:00", price: item.price },
    })
  }

  const handleSave = async () => {
    if (!editingItem || !user?.hotelId) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items/${editingItem.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timeBasedPricing: timePricing }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update pricing (HTTP ${res.status})`,
        )
      }

      setEditingItem(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update pricing")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Time-based pricing
            </div>
            <div className="text-lg font-semibold">
              {items.filter((i) => i.timeBasedPricing).length} items
            </div>
          </div>
          <Clock className="h-8 w-8 opacity-80" />
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
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Time-based pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to configure.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {item.name}
                    </div>
                    {item.timeBasedPricing ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.timeBasedPricing).map(([key, val]: [string, any]) => (
                          <Badge
                            key={key}
                            className="bg-violet-100 text-violet-700 border-violet-200 text-[10px]"
                          >
                            {key}: ₹{val.price} ({val.start}-{val.end})
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Standard pricing: ₹{item.price}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs ml-3"
                    onClick={() => handleOpen(item)}
                  >
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Configure
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editingItem && timePricing && (
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="sm:max-w-md" showCloseButton>
            <DialogHeader>
              <DialogTitle>Time-based pricing: {editingItem.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-1">
              {["breakfast", "lunch", "dinner"].map((period) => (
                <div key={period} className="space-y-1.5 p-2 rounded border border-slate-200">
                  <div className="text-xs font-semibold text-slate-700 capitalize">
                    {period}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="time"
                      value={timePricing[period]?.start || "08:00"}
                      onChange={(e) =>
                        setTimePricing({
                          ...timePricing,
                          [period]: {
                            ...timePricing[period],
                            start: e.target.value,
                          },
                        })
                      }
                      className="h-7 text-xs"
                    />
                    <Input
                      type="time"
                      value={timePricing[period]?.end || "22:00"}
                      onChange={(e) =>
                        setTimePricing({
                          ...timePricing,
                          [period]: {
                            ...timePricing[period],
                            end: e.target.value,
                          },
                        })
                      }
                      className="h-7 text-xs"
                    />
                    <Input
                      type="number"
                      value={timePricing[period]?.price || editingItem.price}
                      onChange={(e) =>
                        setTimePricing({
                          ...timePricing,
                          [period]: {
                            ...timePricing[period],
                            price: Number(e.target.value),
                          },
                        })
                      }
                      placeholder="Price"
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-violet-600 hover:bg-violet-700"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
