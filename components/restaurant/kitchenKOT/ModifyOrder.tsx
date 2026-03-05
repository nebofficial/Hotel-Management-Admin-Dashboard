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
import { AlertTriangle, Edit2, Plus, Trash2 } from "lucide-react"
import type { KitchenKOT } from "./KitchenKOT"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  kots: KitchenKOT[]
  onRefresh: () => void
}

export default function ModifyOrder({ kots, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingKOT, setEditingKOT] = useState<KitchenKOT | null>(null)
  const [editingItem, setEditingItem] = useState<{ kotId: string; itemIndex: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [itemForm, setItemForm] = useState({
    name: "",
    quantity: "1",
    section: "",
    notes: "",
  })

  const modifiableKOTs = kots.filter((kot) => kot.status === "Pending" || kot.status === "Preparing")

  const handleUpdateItems = async () => {
    if (!editingKOT || !user?.hotelId) return

    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/kitchen-kots/${editingKOT.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: editingKOT.items,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to update (HTTP ${res.status})`)
      }

      setEditingKOT(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to modify order")
    } finally {
      setSaving(false)
    }
  }

  const handleAddItem = () => {
    if (!editingKOT || !itemForm.name.trim()) {
      setError("Item name is required")
      return
    }
    const newItem = {
      id: String(Math.random()),
      name: itemForm.name.trim(),
      quantity: Number(itemForm.quantity || 1),
      section: itemForm.section.trim() || null,
      notes: itemForm.notes.trim() || null,
      status: "Pending",
    }
    setEditingKOT({
      ...editingKOT,
      items: [...editingKOT.items, newItem],
    })
    setItemForm({ name: "", quantity: "1", section: "", notes: "" })
  }

  const handleRemoveItem = (itemIndex: number) => {
    if (!editingKOT) return
    setEditingKOT({
      ...editingKOT,
      items: editingKOT.items.filter((_, idx) => idx !== itemIndex),
    })
  }

  const handleUpdateItem = (itemIndex: number, updates: Partial<typeof itemForm>) => {
    if (!editingKOT) return
    const updatedItems = [...editingKOT.items]
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      ...(updates.name && { name: updates.name }),
      ...(updates.quantity && { quantity: Number(updates.quantity) }),
      ...(updates.section !== undefined && { section: updates.section || null }),
      ...(updates.notes !== undefined && { notes: updates.notes || null }),
    }
    setEditingKOT({ ...editingKOT, items: updatedItems })
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Modifiable orders
            </div>
            <div className="text-lg font-semibold">
              {modifiableKOTs.length.toString().padStart(2, "0")}
            </div>
          </div>
          <Edit2 className="h-8 w-8 opacity-80" />
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
            Modify order items before preparation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {modifiableKOTs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No orders available for modification. Only Pending or Preparing orders can be modified.
              </div>
            ) : (
              modifiableKOTs.map((kot) => (
                <div
                  key={kot.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 font-mono">
                        {kot.kotNumber}
                      </span>
                      <Badge className={`border text-[10px] ${kot.status === "Pending" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-purple-100 text-purple-700 border-purple-200"}`}>
                        {kot.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Table {kot.tableNo} • {kot.items.length} items
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setEditingKOT({ ...kot })
                      setItemForm({ name: "", quantity: "1", section: "", notes: "" })
                    }}
                  >
                    Modify
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editingKOT && (
        <Dialog open={!!editingKOT} onOpenChange={() => { setEditingKOT(null); setEditingItem(null) }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton>
            <DialogHeader>
              <DialogTitle>Modify order: {editingKOT.kotNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-1">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-900">Current items</div>
                {editingKOT.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50">
                    <div className="flex-1 text-xs">
                      <div className="font-medium text-slate-900">{item.name} × {item.quantity}</div>
                      {item.section && <div className="text-[11px] text-slate-500">Section: {item.section}</div>}
                    </div>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleRemoveItem(idx)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-900">Add new item</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    placeholder="Item name"
                    className="h-7 text-xs col-span-2"
                  />
                  <Input
                    type="number"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                    placeholder="Qty"
                    min="1"
                    className="h-7 text-xs"
                  />
                  <Input
                    value={itemForm.section}
                    onChange={(e) => setItemForm({ ...itemForm, section: e.target.value })}
                    placeholder="Section (optional)"
                    className="h-7 text-xs"
                  />
                </div>
                <Input
                  value={itemForm.notes}
                  onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                  placeholder="Notes (optional)"
                  className="h-7 text-xs"
                />
                <Button size="sm" className="h-7 px-2 text-xs w-full" onClick={handleAddItem}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add item
                </Button>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setEditingKOT(null)}>Cancel</Button>
                <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700" disabled={saving} onClick={handleUpdateItems}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
