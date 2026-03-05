'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Receipt } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function TaxConfiguration({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingTax, setEditingTax] = useState<{ id: string; taxRate: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTaxRate, setNewTaxRate] = useState("")

  const handleUpdateTax = async () => {
    if (!editingTax || !user?.hotelId || !newTaxRate) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items/${editingTax.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taxRate: Number(newTaxRate) }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update tax rate (HTTP ${res.status})`,
        )
      }

      setEditingTax(null)
      setNewTaxRate("")
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update tax rate")
    } finally {
      setSaving(false)
    }
  }

  const avgTaxRate = items.length > 0
    ? items.reduce((sum, item) => sum + item.taxRate, 0) / items.length
    : 0

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Average tax rate
            </div>
            <div className="text-lg font-semibold">
              {avgTaxRate.toFixed(1)}%
            </div>
          </div>
          <Receipt className="h-8 w-8 opacity-80" />
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
            Tax configuration (GST %)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to configure tax for.
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
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px]">
                      GST {item.taxRate}%
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        setEditingTax({ id: item.id, taxRate: item.taxRate })
                        setNewTaxRate(item.taxRate.toString())
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

      {editingTax && (
        <Card className="rounded-2xl border border-indigo-200 bg-indigo-50 shadow-sm">
          <CardContent className="p-3 space-y-2">
            <div className="text-xs font-semibold text-indigo-900">
              Update tax rate (%)
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newTaxRate}
                onChange={(e) => setNewTaxRate(e.target.value)}
                placeholder="Tax rate (0-100)"
                min="0"
                max="100"
                className="h-8 text-xs flex-1"
              />
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700"
                onClick={handleUpdateTax}
                disabled={saving || !newTaxRate}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => {
                  setEditingTax(null)
                  setNewTaxRate("")
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
