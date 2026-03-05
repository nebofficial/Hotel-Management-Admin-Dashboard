'use client'

import { useState, useEffect } from "react"
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
import type { ComboOffer } from "./ComboOffers"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface MenuItem {
  id: string
  name: string
  price: number
}

interface Props {
  combos: ComboOffer[]
  onRefresh: () => void
}

export default function CreateComboMeals({ combos, onRefresh }: Props) {
  const { user } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingCombo, setEditingCombo] = useState<ComboOffer | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    items: [] as Array<{ menuItemId: string; name: string; quantity: number; price: number }>,
    comboPrice: "",
  })

  useEffect(() => {
    if (!user?.hotelId) return
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/menu-items`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        const items = (data as any)?.items || []
        setMenuItems(
          items.map((i: any) => ({
            id: String(i.id),
            name: String(i.name),
            price: Number(i.price || 0),
          })),
        )
      })
      .catch(() => {})
  }, [user?.hotelId])

  const handleAddItem = () => {
    const itemId = (document.getElementById("select-item") as HTMLSelectElement)?.value
    const item = menuItems.find((i) => i.id === itemId)
    if (!item) return
    const quantity = Number((document.getElementById("item-quantity") as HTMLInputElement)?.value || 1)
    if (form.items.find((i) => i.menuItemId === itemId)) {
      setError("Item already added")
      return
    }
    setForm({
      ...form,
      items: [...form.items, { menuItemId: item.id, name: item.name, quantity, price: item.price }],
    })
  }

  const handleRemoveItem = (menuItemId: string) => {
    setForm({ ...form, items: form.items.filter((i) => i.menuItemId !== menuItemId) })
  }

  const calculateOriginalPrice = () => {
    return form.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleCreate = async () => {
    if (!user?.hotelId || !form.name.trim() || form.items.length === 0 || !form.comboPrice) {
      setError("Name, items, and combo price are required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/combo-offers`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            items: form.items,
            comboPrice: Number(form.comboPrice),
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to create combo (HTTP ${res.status})`)
      }

      setCreating(false)
      setForm({ name: "", description: "", items: [], comboPrice: "" })
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to create combo")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingCombo || !user?.hotelId || !form.name.trim() || form.items.length === 0 || !form.comboPrice) {
      setError("Name, items, and combo price are required")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/combo-offers/${editingCombo.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            items: form.items,
            comboPrice: Number(form.comboPrice),
          }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to update combo (HTTP ${res.status})`)
      }
      setEditingCombo(null)
      setForm({ name: "", description: "", items: [], comboPrice: "" })
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update combo")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.hotelId || !confirm("Delete this combo?")) return
    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/combo-offers/${id}`,
        { method: "DELETE", headers: { Authorization: token ? `Bearer ${token}` : "" } },
      )
      if (!res.ok) throw new Error("Failed to delete")
      onRefresh()
    } catch (e: any) {
      setError(e?.message || "Failed to delete combo")
    } finally {
      setSaving(false)
    }
  }

  const originalPrice = calculateOriginalPrice()
  const discountAmount = originalPrice - Number(form.comboPrice || 0)
  const discountPercentage = originalPrice > 0 ? ((discountAmount / originalPrice) * 100).toFixed(1) : "0"

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Total combos</div>
            <div className="text-lg font-semibold">{combos.length.toString().padStart(2, "0")}</div>
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900">Combo meals</CardTitle>
            <Button size="sm" className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700" onClick={() => setCreating(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Create combo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {combos.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No combo meals created yet.</div>
            ) : (
              combos.map((combo) => (
                <div key={combo.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">{combo.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {combo.items.length} items • ₹{combo.comboPrice} (Save ₹{combo.discountAmount.toFixed(2)})
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3">
                    <Button variant="outline" size="icon" className="h-7 w-7 border-slate-200 text-slate-600" onClick={() => {
                      setEditingCombo(combo)
                      setForm({
                        name: combo.name,
                        description: combo.description || "",
                        items: combo.items.map((i) => ({ ...i })),
                        comboPrice: String(combo.comboPrice),
                      })
                    }} title="Edit combo">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 border-rose-200 text-rose-600" onClick={() => handleDelete(combo.id)} disabled={saving} title="Delete combo">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={creating || !!editingCombo} onOpenChange={(open) => {
        if (!open) { setCreating(false); setEditingCombo(null); setForm({ name: "", description: "", items: [], comboPrice: "" }) }
      }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingCombo ? "Edit combo meal" : "Create combo meal"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Combo name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Family Combo" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional" className="h-16 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs resize-none" />
            </div>
            <div className="space-y-2 p-2 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-xs font-semibold text-slate-900">Add items</div>
              <div className="flex gap-2">
                <select id="select-item" aria-label="Select menu item to add to combo" className="h-8 text-xs flex-1 rounded-md border border-slate-200 bg-white px-2">
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (₹{item.price})
                    </option>
                  ))}
                </select>
                <Input id="item-quantity" type="number" defaultValue="1" min="1" className="h-8 text-xs w-20" />
                <Button size="sm" className="h-8 px-2 text-xs" onClick={handleAddItem}>
                  Add
                </Button>
              </div>
              {form.items.length > 0 && (
                <div className="space-y-1 mt-2">
                  {form.items.map((item) => (
                    <div key={item.menuItemId} className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                      <span className="text-xs text-slate-700">{item.name} × {item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-5 w-5" onClick={() => handleRemoveItem(item.menuItemId)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Original price</label>
                <Input value={originalPrice.toFixed(2)} disabled className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Combo price *</label>
                <Input type="number" value={form.comboPrice} onChange={(e) => setForm({ ...form, comboPrice: e.target.value })} placeholder="0" className="h-8 text-xs" />
              </div>
            </div>
            {form.comboPrice && originalPrice > 0 && (
              <div className="p-2 rounded-lg bg-green-50 border border-green-200">
                <div className="text-xs font-semibold text-green-900">Discount: ₹{discountAmount.toFixed(2)} ({discountPercentage}%)</div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setCreating(false); setEditingCombo(null) }}>Cancel</Button>
              {editingCombo ? (
                <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-700" disabled={!form.name.trim() || form.items.length === 0 || !form.comboPrice || saving} onClick={handleUpdate}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              ) : (
                <Button size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-700" disabled={!form.name.trim() || form.items.length === 0 || !form.comboPrice || saving} onClick={handleCreate}>
                  {saving ? "Creating..." : "Create"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
