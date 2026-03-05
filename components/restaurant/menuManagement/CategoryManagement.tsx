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
import { AlertTriangle, Plus, Trash2, Edit2, ChefHat } from "lucide-react"
import type { MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  categories: MenuCategory[]
  onRefresh: () => void
}

const CATEGORY_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
]

// Tailwind classes for first 8 swatches (avoids inline style for a11y)
const SWATCH_BG_CLASSES = [
  "bg-[#ef4444]", "bg-[#f97316]", "bg-[#f59e0b]", "bg-[#eab308]",
  "bg-[#84cc16]", "bg-[#22c55e]", "bg-[#10b981]", "bg-[#14b8a6]",
]

export default function CategoryManagement({ categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    displayOrder: "0",
    colorTag: CATEGORY_COLORS[0],
  })

  const handleCreate = async () => {
    if (!user?.hotelId || !form.name.trim()) {
      setError("Category name is required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-categories`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            displayOrder: Number(form.displayOrder || 0),
            colorTag: form.colorTag,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to create category (HTTP ${res.status})`,
        )
      }

      setCreating(false)
      setForm({
        name: "",
        description: "",
        displayOrder: "0",
        colorTag: CATEGORY_COLORS[0],
      })
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to create category")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingCategory || !user?.hotelId) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            displayOrder: Number(form.displayOrder || 0),
            colorTag: form.colorTag,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update category (HTTP ${res.status})`,
        )
      }

      setEditingCategory(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update category")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.hotelId || !confirm("Deactivate this category? Items in this category will remain but category will be hidden.")) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-categories/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to delete category (HTTP ${res.status})`,
        )
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to delete category")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <Card className="rounded-2xl bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-sm border-none flex-1">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide opacity-80">
                Categories
              </div>
              <div className="text-lg font-semibold">
                {categories.filter(c => c.isActive).length.toString().padStart(2, "0")}
              </div>
            </div>
            <ChefHat className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        <Button
          size="sm"
          className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 ml-3"
          onClick={() => setCreating(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add category
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
            Menu categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {categories.length === 0 ? (
              <div className="col-span-full py-8 text-center text-xs text-slate-400">
                No categories yet. Click "Add category" to create your first category.
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full shrink-0 bg-[#6366f1]"
                        style={cat.colorTag ? { backgroundColor: cat.colorTag } : undefined}
                      />
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {cat.name}
                      </span>
                      {!cat.isActive && (
                        <Badge className="bg-slate-100 text-slate-500 border-slate-200 text-[10px]">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    {cat.description && (
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {cat.description}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Order: {cat.displayOrder}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-slate-200 text-slate-600"
                      onClick={() => {
                        setEditingCategory(cat)
                        setForm({
                          name: cat.name,
                          description: cat.description || "",
                          displayOrder: cat.displayOrder.toString(),
                          colorTag: cat.colorTag || CATEGORY_COLORS[0],
                        })
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-rose-200 text-rose-600"
                      onClick={() => handleDelete(cat.id)}
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

      <Dialog open={creating || !!editingCategory} onOpenChange={(open) => {
        if (!open) {
          setCreating(false)
          setEditingCategory(null)
          setForm({
            name: "",
            description: "",
            displayOrder: "0",
            colorTag: CATEGORY_COLORS[0],
          })
        }
      }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Name *</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Starters, Main Course"
                className="h-8 text-xs"
              />
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
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Display order</label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                  placeholder="0"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700" htmlFor="category-color">Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="category-color"
                    type="color"
                    aria-label="Category color"
                    value={form.colorTag}
                    onChange={(e) => setForm({ ...form, colorTag: e.target.value })}
                    className="h-8 w-16 rounded border border-slate-200"
                  />
                  <div className="flex-1 flex flex-wrap gap-1">
                    {CATEGORY_COLORS.slice(0, 8).map((color, idx) => (
                      <button
                        key={color}
                        type="button"
                        title={`Set color ${color}`}
                        aria-label={`Set color ${color}`}
                        onClick={() => setForm({ ...form, colorTag: color })}
                        className={`h-6 w-6 rounded border-2 border-slate-300 ${SWATCH_BG_CLASSES[idx] ?? ""}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setCreating(false)
                  setEditingCategory(null)
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-purple-600 hover:bg-purple-700"
                disabled={!form.name.trim() || saving}
                onClick={editingCategory ? handleUpdate : handleCreate}
              >
                {saving ? "Saving..." : editingCategory ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
