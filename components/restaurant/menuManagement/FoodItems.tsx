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
import { AlertTriangle, Plus, Trash2, Edit2, UtensilsCrossed } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function FoodItems({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: categories[0]?.id || "",
    price: "",
    taxRate: "12",
    isVeg: true,
  })

  const handleCreate = async () => {
    if (!user?.hotelId || !form.name.trim() || !form.categoryId) {
      setError("Name and category are required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            categoryId: form.categoryId,
            price: Number(form.price || 0),
            taxRate: Number(form.taxRate || 0),
            isVeg: form.isVeg,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to create item (HTTP ${res.status})`,
        )
      }

      setCreating(false)
      setForm({
        name: "",
        description: "",
        categoryId: categories[0]?.id || "",
        price: "",
        taxRate: "12",
        isVeg: true,
      })
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to create item")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
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
            name: form.name.trim(),
            description: form.description.trim() || null,
            categoryId: form.categoryId,
            price: Number(form.price || 0),
            taxRate: Number(form.taxRate || 0),
            isVeg: form.isVeg,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update item (HTTP ${res.status})`,
        )
      }

      setEditingItem(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update item")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.hotelId || !confirm("Delete this menu item?")) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to delete item (HTTP ${res.status})`,
        )
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to delete item")
    } finally {
      setSaving(false)
    }
  }

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || "Unknown"

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <Card className="rounded-2xl bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-sm border-none flex-1">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide opacity-80">
                Total items
              </div>
              <div className="text-lg font-semibold">
                {items.length.toString().padStart(2, "0")}
              </div>
            </div>
            <UtensilsCrossed className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        <Button
          size="sm"
          className="h-8 px-3 text-xs bg-orange-600 hover:bg-orange-700 ml-3"
          onClick={() => setCreating(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add item
        </Button>
      </div>

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
            Food items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No menu items yet. Click "Add item" to create your first item.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {item.name}
                      </span>
                      {item.isVeg ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                          🥗 Veg
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                          🍖 Non-Veg
                        </Badge>
                      )}
                      {!item.isAvailable && (
                        <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[10px]">
                          Unavailable
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {getCategoryName(item.categoryId)} • ₹{item.price.toFixed(2)} • GST {item.taxRate}%
                    </div>
                    {item.description && (
                      <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 ml-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-slate-200 text-slate-600"
                      onClick={() => {
                        setEditingItem(item)
                        setForm({
                          name: item.name,
                          description: item.description || "",
                          categoryId: item.categoryId,
                          price: item.price.toString(),
                          taxRate: item.taxRate.toString(),
                          isVeg: item.isVeg,
                        })
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-rose-200 text-rose-600"
                      onClick={() => handleDelete(item.id)}
                      disabled={saving}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={creating || !!editingItem} onOpenChange={(open) => {
        if (!open) {
          setCreating(false)
          setEditingItem(null)
          setForm({
            name: "",
            description: "",
            categoryId: categories[0]?.id || "",
            price: "",
            taxRate: "12",
            isVeg: true,
          })
        }
      }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit item" : "Add food item"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Paneer Tikka"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700" htmlFor="food-item-category">Category *</label>
              <select
                id="food-item-category"
                aria-label="Category"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="h-8 text-xs w-full rounded-md border border-slate-200 bg-white px-2"
              >
                {categories.filter(c => c.isActive).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Price (₹) *</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Tax rate (%)</label>
                <Input
                  type="number"
                  value={form.taxRate}
                  onChange={(e) => setForm({ ...form, taxRate: e.target.value })}
                  placeholder="12"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description"
                className="h-16 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs resize-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVeg"
                aria-label="Vegetarian item"
                checked={form.isVeg}
                onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300"
              />
              <label htmlFor="isVeg" className="text-xs text-slate-700">
                Vegetarian item
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setCreating(false)
                  setEditingItem(null)
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-orange-600 hover:bg-orange-700"
                disabled={!form.name.trim() || !form.categoryId || saving}
                onClick={editingItem ? handleUpdate : handleCreate}
              >
                {saving ? "Saving..." : editingItem ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
