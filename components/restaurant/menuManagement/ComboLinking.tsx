'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, UtensilsCrossed, Check } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function ComboLinking({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedComboItems, setSelectedComboItems] = useState<string[]>([])

  const handleOpen = (item: MenuItem) => {
    setEditingItem(item)
    setSelectedComboItems([...item.comboItems])
  }

  const handleToggleComboItem = (itemId: string) => {
    setSelectedComboItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    )
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
          body: JSON.stringify({
            comboLinked: selectedComboItems.length > 0,
            comboItems: selectedComboItems,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update combo (HTTP ${res.status})`,
        )
      }

      setEditingItem(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update combo")
    } finally {
      setSaving(false)
    }
  }

  const comboCount = items.filter((i) => i.comboLinked && i.comboItems.length > 0).length

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-pink-500 via-rose-500 to-red-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Combo meals
            </div>
            <div className="text-lg font-semibold">{comboCount}</div>
          </div>
          <UtensilsCrossed className="h-8 w-8 opacity-80" />
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
            Combo linking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to manage combos for.
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
                    {item.comboLinked && item.comboItems.length > 0 ? (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Combo with {item.comboItems.length} item(s)
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Not a combo
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs ml-3"
                    onClick={() => handleOpen(item)}
                  >
                    <UtensilsCrossed className="h-3.5 w-3.5 mr-1" />
                    {item.comboLinked ? "Edit" : "Create combo"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="sm:max-w-md" showCloseButton>
            <DialogHeader>
              <DialogTitle>Combo: {editingItem.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
              <div className="text-xs text-slate-500">
                Select items to include in this combo meal
              </div>
              <div className="space-y-1.5">
                {items
                  .filter((i) => i.id !== editingItem.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100"
                      onClick={() => handleToggleComboItem(item.id)}
                    >
                      <div className="flex-1">
                        <div className="text-xs font-medium text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          ₹{item.price.toFixed(2)}
                        </div>
                      </div>
                      {selectedComboItems.includes(item.id) && (
                        <Check className="h-4 w-4 text-pink-600" />
                      )}
                    </div>
                  ))}
              </div>
              {selectedComboItems.length > 0 && (
                <div className="p-2 rounded bg-pink-50 border border-pink-200">
                  <div className="text-xs font-semibold text-pink-900 mb-1">
                    Selected ({selectedComboItems.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedComboItems.map((id) => {
                      const item = items.find((i) => i.id === id)
                      return item ? (
                        <Badge
                          key={id}
                          className="bg-pink-100 text-pink-700 border-pink-200 text-[10px]"
                        >
                          {item.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
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
                  className="h-8 text-xs bg-pink-600 hover:bg-pink-700"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save combo"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
