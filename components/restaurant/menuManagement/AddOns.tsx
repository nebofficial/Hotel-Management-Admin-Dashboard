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
import { AlertTriangle, Plus, X, Settings } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function AddOns({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addOns, setAddOns] = useState<Array<{ name: string; price: number }>>([])
  const [newAddOn, setNewAddOn] = useState({ name: "", price: "" })

  const handleOpen = (item: MenuItem) => {
    setEditingItem(item)
    setAddOns([...item.addOns])
    setNewAddOn({ name: "", price: "" })
  }

  const handleAdd = () => {
    if (!newAddOn.name.trim() || !newAddOn.price) return
    setAddOns([
      ...addOns,
      { name: newAddOn.name.trim(), price: Number(newAddOn.price) },
    ])
    setNewAddOn({ name: "", price: "" })
  }

  const handleRemove = (index: number) => {
    setAddOns(addOns.filter((_, i) => i !== index))
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
          body: JSON.stringify({ addOns }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update add-ons (HTTP ${res.status})`,
        )
      }

      setEditingItem(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update add-ons")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Items with add-ons
            </div>
            <div className="text-lg font-semibold">
              {items.filter((i) => i.addOns.length > 0).length}
            </div>
          </div>
          <Settings className="h-8 w-8 opacity-80" />
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
            Add-ons management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to manage add-ons for.
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
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.addOns.length > 0 ? (
                        item.addOns.map((addon, idx) => (
                          <Badge
                            key={idx}
                            className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]"
                          >
                            {addon.name} (+₹{addon.price})
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          No add-ons
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs ml-3"
                    onClick={() => handleOpen(item)}
                  >
                    <Settings className="h-3.5 w-3.5 mr-1" />
                    Manage
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Manage add-ons: {editingItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-2">
              {addOns.map((addon, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-900">
                      {addon.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      +₹{addon.price.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 border-rose-200 text-rose-600"
                    onClick={() => handleRemove(idx)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={newAddOn.name}
                onChange={(e) =>
                  setNewAddOn({ ...newAddOn, name: e.target.value })
                }
                placeholder="Add-on name"
                className="h-8 text-xs flex-1"
              />
              <Input
                type="number"
                value={newAddOn.price}
                onChange={(e) =>
                  setNewAddOn({ ...newAddOn, price: e.target.value })
                }
                placeholder="Price"
                className="h-8 text-xs w-24"
              />
              <Button
                size="sm"
                className="h-8 px-2 text-xs bg-amber-600 hover:bg-amber-700"
                onClick={handleAdd}
                disabled={!newAddOn.name.trim() || !newAddOn.price}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
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
                className="h-8 text-xs bg-amber-600 hover:bg-amber-700"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
