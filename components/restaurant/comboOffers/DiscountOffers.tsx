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
import { AlertTriangle, Plus, Trash2, Edit2, Percent } from "lucide-react"
import type { DiscountOffer } from "./ComboOffers"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  discounts: DiscountOffer[]
  onRefresh: () => void
}

const emptyForm = {
  name: "",
  description: "",
  discountType: "Percentage" as "Percentage" | "Flat",
  discountValue: "",
  minOrderValue: "",
  maxDiscountAmount: "",
  limitedQuantity: "",
  priority: "0",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  autoApply: false,
  isActive: true,
}

export default function DiscountOffers({ discounts, onRefresh }: Props) {
  const { user } = useAuth()
  const [creating, setCreating] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<DiscountOffer | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const handleCreate = async () => {
    if (!user?.hotelId || !form.name.trim() || !form.discountValue) {
      setError("Name and discount value are required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/discount-offers`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
            maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
            limitedQuantity: form.limitedQuantity ? Number(form.limitedQuantity) : null,
            priority: Number(form.priority || 0),
            startDate: form.startDate || null,
            endDate: form.endDate || null,
            startTime: form.startTime || null,
            endTime: form.endTime || null,
            autoApply: form.autoApply,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to create discount (HTTP ${res.status})`)
      }

      setCreating(false)
      setForm(emptyForm)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to create discount")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingDiscount || !user?.hotelId || !form.name.trim() || !form.discountValue) {
      setError("Name and discount value are required")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/discount-offers/${editingDiscount.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim() || null,
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
            maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
            limitedQuantity: form.limitedQuantity ? Number(form.limitedQuantity) : null,
            priority: Number(form.priority || 0),
            startDate: form.startDate || null,
            endDate: form.endDate || null,
            startTime: form.startTime || null,
            endTime: form.endTime || null,
            autoApply: form.autoApply,
            isActive: form.isActive,
          }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to update discount (HTTP ${res.status})`)
      }
      setEditingDiscount(null)
      setForm(emptyForm)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update discount")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.hotelId || !confirm("Delete this discount?")) return
    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/discount-offers/${id}`,
        { method: "DELETE", headers: { Authorization: token ? `Bearer ${token}` : "" } },
      )
      if (!res.ok) throw new Error("Failed to delete")
      onRefresh()
    } catch (e: any) {
      setError(e?.message || "Failed to delete discount")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Total discounts</div>
            <div className="text-lg font-semibold">{discounts.length.toString().padStart(2, "0")}</div>
          </div>
          <Percent className="h-8 w-8 opacity-80" />
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
            <CardTitle className="text-sm font-semibold text-slate-900">Discount offers</CardTitle>
            <Button size="sm" className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700" onClick={() => setCreating(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Create discount
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {discounts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No discount offers created yet.</div>
            ) : (
              discounts.map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{discount.name}</span>
                      <Badge className={`border text-[10px] ${discount.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {discount.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {discount.discountType === "Percentage" ? `${discount.discountValue}%` : `₹${discount.discountValue}`} off
                      {discount.minOrderValue && ` • Min order: ₹${discount.minOrderValue}`}
                      {discount.limitedQuantity != null && ` • Limited: ${discount.limitedQuantity}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3">
                    <Button variant="outline" size="icon" className="h-7 w-7 border-slate-200 text-slate-600" onClick={() => {
                      setEditingDiscount(discount)
                      setForm({
                        name: discount.name,
                        description: discount.description || "",
                        discountType: discount.discountType,
                        discountValue: String(discount.discountValue),
                        minOrderValue: discount.minOrderValue != null ? String(discount.minOrderValue) : "",
                        maxDiscountAmount: discount.maxDiscountAmount != null ? String(discount.maxDiscountAmount) : "",
                        limitedQuantity: discount.limitedQuantity != null ? String(discount.limitedQuantity) : "",
                        priority: String(discount.priority),
                        startDate: discount.startDate || "",
                        endDate: discount.endDate || "",
                        startTime: discount.startTime || "",
                        endTime: discount.endTime || "",
                        autoApply: discount.autoApply,
                        isActive: discount.isActive,
                      })
                    }} title="Edit discount">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 border-rose-200 text-rose-600" onClick={() => handleDelete(discount.id)} disabled={saving} title="Delete discount">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={creating || !!editingDiscount} onOpenChange={(open) => { if (!open) { setCreating(false); setEditingDiscount(null); setForm(emptyForm) } }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingDiscount ? "Edit discount offer" : "Create discount offer"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Weekend Special" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional" className="h-16 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs resize-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700" htmlFor="discount-type">Discount type *</label>
              <select id="discount-type" aria-label="Discount type" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as "Percentage" | "Flat" })} className="h-8 text-xs w-full rounded-md border border-slate-200 bg-white px-2">
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat amount</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Discount value *</label>
              <Input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} placeholder={form.discountType === "Percentage" ? "e.g. 20" : "e.g. 100"} className="h-8 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Min order value</label>
                <Input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} placeholder="Optional" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Max discount</label>
                <Input type="number" value={form.maxDiscountAmount} onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })} placeholder="Optional" className="h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Limited quantity</label>
                <Input type="number" value={form.limitedQuantity} onChange={(e) => setForm({ ...form, limitedQuantity: e.target.value })} placeholder="Optional" min="0" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Priority</label>
                <Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} placeholder="0" className="h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Start date</label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">End date</label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="h-8 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Start time</label>
                <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">End time</label>
                <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="h-8 text-xs" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="discount-auto-apply" type="checkbox" aria-label="Auto-apply when eligible" checked={form.autoApply} onChange={(e) => setForm({ ...form, autoApply: e.target.checked })} className="h-4 w-4" />
              <label htmlFor="discount-auto-apply" className="text-xs text-slate-700">Auto-apply when eligible</label>
            </div>
            {editingDiscount && (
              <div className="flex items-center gap-2">
                <input id="discount-is-active" type="checkbox" aria-label="Offer active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" />
                <label htmlFor="discount-is-active" className="text-xs text-slate-700">Active</label>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setCreating(false); setEditingDiscount(null) }}>Cancel</Button>
              {editingDiscount ? (
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700" disabled={!form.name.trim() || !form.discountValue || saving} onClick={handleUpdate}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              ) : (
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700" disabled={!form.name.trim() || !form.discountValue || saving} onClick={handleCreate}>
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
