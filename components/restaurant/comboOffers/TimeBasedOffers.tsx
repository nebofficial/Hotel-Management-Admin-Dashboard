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
import { AlertTriangle, Clock } from "lucide-react"
import type { DiscountOffer } from "./ComboOffers"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  discounts: DiscountOffer[]
  onRefresh: () => void
}

export default function TimeBasedOffers({ discounts, onRefresh }: Props) {
  const { user } = useAuth()
  const [editing, setEditing] = useState<DiscountOffer | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
  })

  const timeBasedOffers = discounts.filter((d) => d.startTime && d.endTime)

  const handleUpdate = async () => {
    if (!editing || !user?.hotelId || !form.startTime || !form.endTime) {
      setError("Start and end times are required")
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
            startTime: form.startTime,
            endTime: form.endTime,
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
      <Card className="rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Time-based offers</div>
            <div className="text-lg font-semibold">{timeBasedOffers.length.toString().padStart(2, "0")}</div>
          </div>
          <Clock className="h-8 w-8 opacity-80" />
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
          <CardTitle className="text-sm font-semibold text-slate-900">Time-based offers (Happy Hours, Lunch Specials)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {timeBasedOffers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No time-based offers configured. Create a discount offer and set start/end times.
              </div>
            ) : (
              timeBasedOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">{offer.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {offer.startTime} - {offer.endTime} • {offer.discountType === "Percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue}`} off
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => {
                    setEditing(offer)
                    setForm({ startTime: offer.startTime || "", endTime: offer.endTime || "" })
                  }}>
                    Edit time
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
              <DialogTitle>Edit time-based offer</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700">Start time *</label>
                  <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700">End time *</label>
                  <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEditing(null)}>Cancel</Button>
                <Button size="sm" className="h-8 text-xs bg-amber-600 hover:bg-amber-700" disabled={!form.startTime || !form.endTime || saving} onClick={handleUpdate}>
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
