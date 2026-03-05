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
import { AlertTriangle, Calendar } from "lucide-react"
import type { DiscountOffer } from "./ComboOffers"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  discounts: DiscountOffer[]
  onRefresh: () => void
}

export default function FestivalPromotions({ discounts, onRefresh }: Props) {
  const { user } = useAuth()
  const [editing, setEditing] = useState<DiscountOffer | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  })

  const festivalOffers = discounts.filter((d) => d.startDate && d.endDate)

  const handleUpdate = async () => {
    if (!editing || !user?.hotelId || !form.startDate || !form.endDate) {
      setError("Start and end dates are required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/discount-offers/${editing.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: form.startDate,
            endDate: form.endDate,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to update (HTTP ${res.status})`)
      }

      setEditing(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-red-500 to-pink-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Festival promotions</div>
            <div className="text-lg font-semibold">{festivalOffers.length.toString().padStart(2, "0")}</div>
          </div>
          <Calendar className="h-8 w-8 opacity-80" />
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
          <CardTitle className="text-sm font-semibold text-slate-900">Festival / Special event promotions</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {festivalOffers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No festival promotions configured. Create a discount offer and set start/end dates.
              </div>
            ) : (
              festivalOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">{offer.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {offer.startDate} to {offer.endDate} • {offer.discountType === "Percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue}`} off
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => {
                    setEditing(offer)
                    setForm({ startDate: offer.startDate || "", endDate: offer.endDate || "" })
                  }}>
                    Edit dates
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editing && (
        <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
          <DialogContent className="sm:max-w-md" showCloseButton>
            <DialogHeader>
              <DialogTitle>Edit festival promotion</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700">Start date *</label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700">End date *</label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEditing(null)}>Cancel</Button>
                <Button size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700" disabled={!form.startDate || !form.endDate || saving} onClick={handleUpdate}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
