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
import { AlertTriangle, Plus, Trash2, Edit2, Ticket } from "lucide-react"
import type { CouponCode } from "./ComboOffers"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  coupons: CouponCode[]
  onRefresh: () => void
}

export default function CouponCodes({ coupons, onRefresh }: Props) {
  const { user } = useAuth()
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingCoupon, setEditingCoupon] = useState<CouponCode | null>(null)
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "Percentage" as "Percentage" | "Flat",
    discountValue: "",
    minOrderValue: "",
    maxDiscountAmount: "",
    maxUses: "",
    startDate: "",
    endDate: "",
    isActive: true,
  })

  const resetForm = () => {
    setForm({
      code: "",
      name: "",
      description: "",
      discountType: "Percentage",
      discountValue: "",
      minOrderValue: "",
      maxDiscountAmount: "",
      maxUses: "",
      startDate: "",
      endDate: "",
      isActive: true,
    })
  }

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setForm({ ...form, code })
  }

  const handleCreate = async () => {
    if (!user?.hotelId || !form.code.trim() || !form.name.trim() || !form.discountValue) {
      setError("Code, name, and discount value are required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/coupon-codes`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: form.code.trim().toUpperCase(),
            name: form.name.trim(),
            description: form.description.trim() || null,
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
            maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
            maxUses: form.maxUses ? Number(form.maxUses) : null,
            startDate: form.startDate || null,
            endDate: form.endDate || null,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to create coupon (HTTP ${res.status})`)
      }

      setCreating(false)
      resetForm()
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to create coupon")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingCoupon || !user?.hotelId || !form.code.trim() || !form.name.trim() || !form.discountValue) {
      setError("Code, name, and discount value are required")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/coupon-codes/${editingCoupon.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: form.code.trim().toUpperCase(),
            name: form.name.trim(),
            description: form.description.trim() || null,
            discountType: form.discountType,
            discountValue: Number(form.discountValue),
            minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
            maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
            maxUses: form.maxUses ? Number(form.maxUses) : null,
            startDate: form.startDate || null,
            endDate: form.endDate || null,
            isActive: form.isActive,
          }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to update coupon (HTTP ${res.status})`)
      }
      setEditingCoupon(null)
      resetForm()
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update coupon")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.hotelId || !confirm("Delete this coupon?")) return
    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/coupon-codes/${id}`,
        { method: "DELETE", headers: { Authorization: token ? `Bearer ${token}` : "" } },
      )
      if (!res.ok) throw new Error("Failed to delete")
      onRefresh()
    } catch (e: any) {
      setError(e?.message || "Failed to delete coupon")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Total coupons</div>
            <div className="text-lg font-semibold">{coupons.length.toString().padStart(2, "0")}</div>
          </div>
          <Ticket className="h-8 w-8 opacity-80" />
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
            <CardTitle className="text-sm font-semibold text-slate-900">Coupon codes</CardTitle>
            <Button size="sm" className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => setCreating(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Create coupon
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {coupons.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No coupon codes created yet.</div>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 font-mono">{coupon.code}</span>
                      <Badge className={`border text-[10px] ${coupon.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {coupon.name} • {coupon.discountType === "Percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} off
                      {coupon.usedCount > 0 && ` • Used: ${coupon.usedCount}${coupon.maxUses ? `/${coupon.maxUses}` : ""}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3">
                    <Button variant="outline" size="icon" className="h-7 w-7 border-slate-200 text-slate-600" onClick={() => {
                      setEditingCoupon(coupon)
                      setForm({
                        code: coupon.code,
                        name: coupon.name,
                        description: coupon.description || "",
                        discountType: coupon.discountType,
                        discountValue: String(coupon.discountValue),
                        minOrderValue: coupon.minOrderValue != null ? String(coupon.minOrderValue) : "",
                        maxDiscountAmount: coupon.maxDiscountAmount != null ? String(coupon.maxDiscountAmount) : "",
                        maxUses: coupon.maxUses != null ? String(coupon.maxUses) : "",
                        startDate: coupon.startDate || "",
                        endDate: coupon.endDate || "",
                        isActive: coupon.isActive,
                      })
                    }} title="Edit coupon">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 border-rose-200 text-rose-600" onClick={() => handleDelete(coupon.id)} disabled={saving} title="Delete coupon">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={creating || !!editingCoupon} onOpenChange={(open) => { if (!open) { setCreating(false); setEditingCoupon(null); resetForm() } }}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit coupon code" : "Create coupon code"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Coupon code *</label>
              <div className="flex gap-2">
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20" className="h-8 text-xs flex-1 font-mono" />
                <Button size="sm" className="h-8 px-2 text-xs" onClick={generateCode}>Generate</Button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Summer Sale" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional" className="h-16 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs resize-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700" htmlFor="coupon-discount-type">Discount type *</label>
              <select id="coupon-discount-type" aria-label="Discount type" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as "Percentage" | "Flat" })} className="h-8 text-xs w-full rounded-md border border-slate-200 bg-white px-2">
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat amount</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Discount value *</label>
                <Input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} placeholder={form.discountType === "Percentage" ? "e.g. 20" : "e.g. 100"} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Max uses</label>
                <Input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Optional" className="h-8 text-xs" />
              </div>
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
                <label className="text-[11px] font-medium text-slate-700">Start date</label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">End date</label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="h-8 text-xs" />
              </div>
            </div>
            {editingCoupon && (
              <div className="flex items-center gap-2">
                <input id="coupon-is-active" type="checkbox" aria-label="Coupon active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4" />
                <label htmlFor="coupon-is-active" className="text-xs text-slate-700">Active</label>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setCreating(false); setEditingCoupon(null) }}>Cancel</Button>
              {editingCoupon ? (
                <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700" disabled={!form.code.trim() || !form.name.trim() || !form.discountValue || saving} onClick={handleUpdate}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              ) : (
                <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700" disabled={!form.code.trim() || !form.name.trim() || !form.discountValue || saving} onClick={handleCreate}>
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
