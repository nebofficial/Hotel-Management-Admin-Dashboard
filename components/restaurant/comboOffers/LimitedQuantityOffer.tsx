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
import { AlertTriangle, Package } from "lucide-react"
import type { DiscountOffer } from "./ComboOffers"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  discounts: DiscountOffer[]
  onRefresh: () => void
}

export default function LimitedQuantityOffer({ discounts, onRefresh }: Props) {
  const { user } = useAuth()
  const [editing, setEditing] = useState<DiscountOffer | null>(null)
  const [limitedQty, setLimitedQty] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const limitedOffers = discounts.filter((d) => d.limitedQuantity != null && d.limitedQuantity > 0)

  const handleSaveLimitedQuantity = async () => {
    if (!editing || !user?.hotelId) return
    const qty = limitedQty.trim() ? parseInt(limitedQty, 10) : null
    if (qty !== null && (isNaN(qty) || qty < 0)) {
      setError("Enter a valid number (0 or more)")
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
          body: JSON.stringify({ limitedQuantity: qty }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || "Failed to update")
      }
      setEditing(null)
      setLimitedQty("")
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update limited quantity")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Limited quantity offers</div>
            <div className="text-lg font-semibold">{limitedOffers.length.toString().padStart(2, "0")}</div>
          </div>
          <Package className="h-8 w-8 opacity-80" />
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
          <CardTitle className="text-sm font-semibold text-slate-900">Limited quantity offers</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {limitedOffers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No limited quantity offers configured. Set limited quantity in Discount offers or below.
              </div>
            ) : (
              limitedOffers.map((offer) => {
                const remaining = offer.limitedQuantity != null ? offer.limitedQuantity - offer.usedQuantity : 0
                return (
                  <div key={offer.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{offer.name}</span>
                        <Badge className={`border text-[10px] ${remaining > 0 ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                          {remaining > 0 ? `${remaining} left` : "Sold out"}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {offer.discountType === "Percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue}`} off •
                        Used: {offer.usedQuantity} / {offer.limitedQuantity}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs ml-3" onClick={() => { setEditing(offer); setLimitedQty(String(offer.limitedQuantity ?? "")) }} title="Edit limited quantity">
                      Set qty
                    </Button>
                  </div>
                )
              })
            )}
            {discounts.filter((d) => !d.limitedQuantity || d.limitedQuantity <= 0).length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <div className="text-[11px] font-medium text-slate-600 mb-1.5">Set limited quantity for other discounts</div>
                <div className="flex flex-wrap gap-1.5">
                  {discounts.filter((d) => !d.limitedQuantity || d.limitedQuantity <= 0).map((d) => (
                    <Button key={d.id} variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => { setEditing(d); setLimitedQty("") }}>
                      {d.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={() => { setEditing(null); setLimitedQty(""); setError(null) }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle>Set limited quantity</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            {editing && (
              <>
                <div className="text-xs text-slate-600">Offer: <span className="font-medium text-slate-900">{editing.name}</span></div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-700">Limited quantity (leave empty for unlimited)</label>
                  <Input type="number" value={limitedQty} onChange={(e) => setLimitedQty(e.target.value)} placeholder="e.g. 100" min="0" className="h-8 text-xs" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setEditing(null); setLimitedQty("") }}>Cancel</Button>
                  <Button size="sm" className="h-8 text-xs bg-rose-600 hover:bg-rose-700" disabled={saving} onClick={handleSaveLimitedQuantity}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
