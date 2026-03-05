'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, DollarSign, TrendingUp } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function PricingControl({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingPrice, setEditingPrice] = useState<{ id: string; price: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newPrice, setNewPrice] = useState("")

  const handleUpdatePrice = async () => {
    if (!editingPrice || !user?.hotelId || !newPrice) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items/${editingPrice.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price: Number(newPrice) }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update price (HTTP ${res.status})`,
        )
      }

      setEditingPrice(null)
      setNewPrice("")
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update price")
    } finally {
      setSaving(false)
    }
  }

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || "Unknown"

  const avgPrice = items.length > 0
    ? items.reduce((sum, item) => sum + item.price, 0) / items.length
    : 0

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Average price
            </div>
            <div className="text-lg font-semibold">
              ₹{avgPrice.toFixed(2)}
            </div>
          </div>
          <TrendingUp className="h-8 w-8 opacity-80" />
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
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Price control
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to manage pricing for.
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
                    <div className="text-[11px] text-slate-500">
                      {getCategoryName(item.categoryId)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-700">
                      ₹{item.price.toFixed(2)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        setEditingPrice({ id: item.id, price: item.price })
                        setNewPrice(item.price.toString())
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editingPrice && (
        <Card className="rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm">
          <CardContent className="p-3 space-y-2">
            <div className="text-xs font-semibold text-emerald-900">
              Update price
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="New price"
                className="h-8 text-xs flex-1"
              />
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700"
                onClick={handleUpdatePrice}
                disabled={saving || !newPrice}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => {
                  setEditingPrice(null)
                  setNewPrice("")
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
